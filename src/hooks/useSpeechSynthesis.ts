import { useState, useEffect, useRef, useCallback } from 'react';

export interface SpeechControl {
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  currentSentence: string;
  currentIndex: number;
  totalSentences: number;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setRate: (rate: number) => void;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  play: (fullText: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isSupported: boolean;
}

export function useSpeechSynthesis(): SpeechControl {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRateState] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice[] | any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSentences, setTotalSentences] = useState(0);
  const [currentSentence, setCurrentSentence] = useState('');

  const sentencesRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const rateRef = useRef(1.0);
  const isPlayingRef = useRef(false);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load voices
  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (!selectedVoice && voices.length > 0) {
        // Prefer natural English voices
        const englishVoice =
          voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];
        setSelectedVoice(englishVoice);
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const speakNextSentence = useCallback(() => {
    if (!isSupported || !isPlayingRef.current) return;

    const sentences = sentencesRef.current;
    const idx = indexRef.current;

    if (idx >= sentences.length) {
      setIsPlaying(false);
      setIsPaused(false);
      isPlayingRef.current = false;
      setCurrentSentence('');
      return;
    }

    const textToSpeak = sentences[idx].trim();
    if (!textToSpeak) {
      indexRef.current += 1;
      setCurrentIndex(indexRef.current);
      speakNextSentence();
      return;
    }

    setCurrentSentence(textToSpeak);
    setCurrentIndex(idx);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rateRef.current;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      if (!isPlayingRef.current) return;
      indexRef.current += 1;
      setCurrentIndex(indexRef.current);
      speakNextSentence();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        indexRef.current += 1;
        speakNextSentence();
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice]);

  const play = useCallback((fullText: string) => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();

    // Split text into digestible sentences to prevent Chrome/Android timeout
    const rawSentences = fullText
      .split(/(?<=[.!?])\s+|\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    sentencesRef.current = rawSentences;
    indexRef.current = 0;
    isPlayingRef.current = true;
    setTotalSentences(rawSentences.length);
    setCurrentIndex(0);
    setIsPlaying(true);
    setIsPaused(false);

    speakNextSentence();
  }, [isSupported, speakNextSentence]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    isPlayingRef.current = false;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentence('');
    setCurrentIndex(0);
  }, [isSupported]);

  const setRate = useCallback((newRate: number) => {
    setRateState(newRate);
    rateRef.current = newRate;
    // If currently speaking, restart current sentence with new rate
    if (isPlayingRef.current && !isPaused) {
      window.speechSynthesis.cancel();
      speakNextSentence();
    }
  }, [isPaused, speakNextSentence]);

  return {
    isPlaying,
    isPaused,
    rate,
    currentSentence,
    currentIndex,
    totalSentences,
    availableVoices,
    selectedVoice,
    setRate,
    setSelectedVoice,
    play,
    pause,
    resume,
    stop,
    isSupported,
  };
}
