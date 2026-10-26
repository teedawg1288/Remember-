import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  MessageSquare,
  Home,
  Smile,
  Users,
  AlertCircle,
  Wrench,
  Compass,
  Send,
  RefreshCw,
} from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface BarberInputProps {
  onAnalyze: (input: string) => void;
  isLoading: boolean;
  persona: 'barber' | 'bartender';
  appName: string;
}

export const BarberInput: React.FC<BarberInputProps> = ({
  onAnalyze,
  isLoading,
  appName,
}) => {
  const [text, setText] = useState('');
  const [aiKeyStatus, setAiKeyStatus] = useState<'checking' | 'present' | 'missing' | 'unknown'>('checking');

  useEffect(() => {
    let active = true;
    fetch('/api/health', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Health check unavailable');
        const status = await response.json();
        if (active) setAiKeyStatus(status.geminiConfigured === true ? 'present' : 'missing');
      })
      .catch(() => { if (active) setAiKeyStatus('unknown'); });
    return () => { active = false; };
  }, []);

  // These are neutral entry questions, not rehearsed stories or prescribed conclusions.
  // Every example goes through the same live discovery route as a user-written question.
  const everydayScenarios = [
    {
      id: 'computer-slow',
      label: 'Why does my computer slow down when I open several programs?',
      icon: <Compass className="w-4 h-4 text-cyan-300" />,
    },
    {
      id: 'car-rust',
      label: 'How do I stop rust coming back on my car door?',
      icon: <Wrench className="w-4 h-4 text-emerald-300" />,
    },
    {
      id: 'bike-skipping',
      label: 'Why does my bicycle chain skip when I pedal hard?',
      icon: <Wrench className="w-4 h-4 text-amber-300" />,
    },
    {
      id: 'frozen-drink',
      label: 'How does a frozen drink machine keep the drink slushy?',
      icon: <Smile className="w-4 h-4 text-pink-400" />,
    },
    {
      id: 'legal-words',
      label: 'Why is the wording in a law so hard to understand?',
      icon: <AlertCircle className="w-4 h-4 text-indigo-300" />,
    },
    {
      id: 'conversation-memory',
      label: 'Why can two people remember the same conversation differently?',
      icon: <MessageSquare className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'sink-clog',
      label: 'Why does my sink keep clogging?',
      icon: <Home className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'stories-similar',
      label: 'Why do stories from different places and times sound similar?',
      icon: <Users className="w-4 h-4 text-emerald-300" />,
    },
  ];

  const handleScenarioClick = (item: (typeof everydayScenarios)[0]) => {
    sound.playDiscoveryChime();
    setText(item.label);
    onAnalyze(item.label);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    sound.playDiscoveryChime();
    onAnalyze(text.trim());
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6 animate-fade-in">
      <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#181d28] to-[#0e1119] p-6 sm:p-9 shadow-xl">
        <div className="max-w-3xl mx-auto space-y-5">
          <div>
            <p className="text-[11px] text-amber-300 font-bold tracking-widest uppercase">{appName} · Let's Talk</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-bold mt-2">What are you trying to understand?</h1>
            <p className="text-sm text-stone-300 mt-2">A situation, a machine, a conversation, a question. Start wherever you are.</p>
          </div>
          {aiKeyStatus !== 'present' && (
            <p role="status" className="text-xs text-amber-200 bg-amber-950/20 border border-amber-500/30 p-3 rounded-xl">
              {aiKeyStatus === 'missing'
                ? 'Live questions and the example buttons need a Gemini key in AI Studio Settings → Secrets.'
                : aiKeyStatus === 'checking'
                  ? 'Checking live AI availability…'
                  : 'AI status could not be checked; submitting a question will show any connection error.'}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <label htmlFor="remember-question" className="block text-sm font-semibold text-stone-200">Your question</label>
            <div className="rounded-2xl border border-stone-700 bg-[#090c14] p-4 focus-within:border-amber-400/70">
              <textarea
                id="remember-question"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask your question in your own words. No special wording needed."
                rows={4}
                disabled={isLoading}
                className="w-full bg-transparent text-stone-100 placeholder-stone-500 text-sm focus:outline-none resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between pt-3 border-t border-stone-800 gap-3">
                <span className="text-[11px] text-stone-400">{text.length ? `${text.length} characters` : 'Your words are enough.'}</span>
                <button
                  type="submit"
                  disabled={isLoading || !text.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold text-sm flex items-center gap-2 cursor-pointer"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{isLoading ? 'Analyzing…' : 'Show Me'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <details className="group rounded-2xl border border-stone-800 bg-[#11151e] p-4 sm:p-5">
        <summary className="cursor-pointer text-sm font-semibold text-stone-200 flex justify-between items-center">
          <span>Try a sample question</span>
          <span className="text-xs text-amber-300">Examples <ArrowRight className="w-3 h-3 inline" /></span>
        </summary>
        <p className="text-xs text-stone-400 mt-3 mb-3">Choose any question to watch REMEMBER find its own comparison. Every example runs live AI.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {everydayScenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleScenarioClick(item)}
              disabled={isLoading}
              className="rounded-xl border border-stone-700 hover:border-amber-500/50 bg-[#141a25] p-4 text-left cursor-pointer disabled:opacity-50"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-white">{item.icon}{item.label}</span>
              <span className="block text-[11px] text-stone-400 mt-2">Live AI question</span>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
};
