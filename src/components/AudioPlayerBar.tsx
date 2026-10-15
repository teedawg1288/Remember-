import React from 'react';
import { SpeechControl } from '../hooks/useSpeechSynthesis';
import { Play, Pause, Square, Volume2, FastForward, RotateCcw } from 'lucide-react';

interface AudioPlayerBarProps {
  speech: SpeechControl;
  onRestart: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ speech, onRestart }) => {
  if (!speech.isSupported) {
    return null;
  }

  if (!speech.isPlaying && !speech.isPaused) {
    return null;
  }

  const progressPercent = speech.totalSentences > 0
    ? Math.min(100, Math.round(((speech.currentIndex + 1) / speech.totalSentences) * 100))
    : 0;

  return (
    <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 sm:p-5 shadow-lg border border-stone-800 space-y-3 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Status & Active sentence snippet */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span className="font-semibold text-amber-400">
                {speech.isPaused ? 'Paused' : 'Reading Aloud'}
              </span>
              <span>·</span>
              <span className="font-mono">{progressPercent}% complete</span>
              <span>·</span>
              <span className="font-mono text-[11px]">
                Sentence {speech.currentIndex + 1} of {speech.totalSentences}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 truncate mt-0.5 italic">
              &ldquo;{speech.currentSentence || 'Preparing speech...'}&rdquo;
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Rate Selector */}
          <div className="flex items-center bg-stone-800 rounded-lg p-0.5 text-xs">
            {[0.8, 1.0, 1.2, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => speech.setRate(speed)}
                className={`px-2 py-1 rounded-md min-h-[36px] font-mono transition-colors ${
                  speech.rate === speed
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Pause / Resume */}
          {speech.isPaused ? (
            <button
              onClick={speech.resume}
              className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              title="Resume speech"
            >
              <Play className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Resume</span>
            </button>
          ) : (
            <button
              onClick={speech.pause}
              className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              title="Pause speech"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Pause</span>
            </button>
          )}

          {/* Stop */}
          <button
            onClick={speech.stop}
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            title="Stop listening"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Stop</span>
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-amber-400 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
