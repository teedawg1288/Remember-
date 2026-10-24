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
import { CURATED_STORIES } from '../data/curatedStories';
import { SameStoryResult } from '../types/sameStory';
import { sound } from '../audio/soundEngine';

interface BarberInputProps {
  onAnalyze: (input: string) => void;
  onSelectCurated: (story: SameStoryResult) => void;
  isLoading: boolean;
  persona: 'barber' | 'bartender';
  appName: string;
}

export const BarberInput: React.FC<BarberInputProps> = ({
  onAnalyze,
  onSelectCurated,
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

  const everydayScenarios = [
    {
      id: 'bike-skipping',
      label: 'Why does a bicycle chain skip under load?',
      icon: <Wrench className="w-4 h-4 text-emerald-300" />,
      subtext: 'A direct mechanical problem to investigate without inventing a human story.',
      prompt: 'Why does my bicycle chain skip only when I pedal hard?',
      badge: 'Live AI',
    },
    {
      id: 'unanswered-text',
      label: 'Someone ignored your text or walked past you',
      icon: <MessageSquare className="w-4 h-4 text-amber-400" />,
      subtext: 'You sent a text or said hello, got dead silence, assumed they were blowing you off, and froze them out.',
      prompt: "Someone didn't answer my text message. I felt ignored, so I stopped talking to them. Now things feel awkward, we haven't spoken in three weeks, and both of us seem upset.",
      badge: 'Most Common',
    },
    {
      id: 'housework-chore-trap',
      label: 'Always doing all the housework & chores',
      icon: <Home className="w-4 h-4 text-cyan-400" />,
      subtext: 'You clean up because the mess bothers you, but doing it silently means nobody else ever helps.',
      prompt: "Someone always ends up doing all the housework. I clean up because I can't stand the mess, but the more I do, the less anyone else notices, and now I'm furious and exhausted.",
      badge: 'Scorekeeper Trap',
    },
    {
      id: 'parent-giving-in',
      label: 'Parent caving on candy to stop screaming',
      icon: <Smile className="w-4 h-4 text-pink-400" />,
      subtext: 'Giving in just to stop the scene in the grocery aisle, making the next tantrum twice as loud.',
      prompt: "A child gets away with something because a parent keeps giving in. The parent caves on candy just to stop the screaming in the store, and now the kid screams louder and longer every single time.",
      badge: 'Parenting Loop',
    },
    {
      id: 'bystander-freeze',
      label: 'Waiting for someone else to step up',
      icon: <Users className="w-4 h-4 text-indigo-400" />,
      subtext: 'A major problem was announced to 20 people, everybody saw it, but nobody stepped up to fix it.',
      prompt: "Everybody waits for someone else to take responsibility. A major problem was announced to a group of 20 people, everybody saw it, but nobody stepped up to fix it because everyone assumed someone else would do it.",
      badge: 'Group Freeze',
    },
    {
      id: 'misunderstood-words',
      label: 'Two people hear the same words differently',
      icon: <AlertCircle className="w-4 h-4 text-emerald-400" />,
      subtext: 'One person thought they offered constructive advice; the other heard a personal attack.',
      prompt: "Two friends hear the same conversation completely differently. One person thought they were just giving casual advice, but the other person heard it as an insult and felt attacked.",
      badge: 'Translation Gap',
    },
    {
      id: 'fix-makes-it-worse',
      label: 'Trying to fix it, but making it worse',
      icon: <Wrench className="w-4 h-4 text-amber-300" />,
      subtext: 'Over-explaining yourself during a disagreement and digging the hole three times deeper.',
      prompt: "Someone tries to fix a problem but accidentally makes it worse. I tried to over-explain myself to clear up a minor misunderstanding, but talking more just made the other person more defensive.",
      badge: 'Over-Explaining',
    },
  ];

  const handleScenarioClick = (item: (typeof everydayScenarios)[0]) => {
    sound.playDiscoveryChime();
    const match = CURATED_STORIES.find((c) => c.id === item.id);
    if (match) {
      onSelectCurated(match);
      return;
    }
    setText(item.prompt);
    onAnalyze(item.prompt);
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
                ? 'Live questions need the Gemini key in AI Studio Settings → Secrets. Prepared examples still work.'
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
                placeholder="Why does my bike skip under load? / What did the other person understand? / Why does this keep happening?"
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
        <p className="text-xs text-stone-400 mt-3 mb-3">Examples are starting points, not evidence of what actually happened to you.</p>
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
              <span className="block text-[11px] text-stone-400 mt-2">{item.badge === 'Live AI' ? 'Live AI question' : 'Prepared example'}</span>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
};
