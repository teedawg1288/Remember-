import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Eye,
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
  persona,
  appName,
}) => {
  const [text, setText] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  const everydayScenarios = [
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

  const handleToggleReveal = () => {
    const nextState = !isRevealed;
    setIsRevealed(nextState);
    sound.playNodeChime(nextState ? 620 : 380);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    sound.playDiscoveryChime();
    onAnalyze(text.trim());
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-10 animate-fade-in">
      {/* 1. Cinematic Tactile Opening Hook */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#151926] via-[#0f121a] to-[#0a0d14] border border-amber-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Soft background ambient light */}
        <div
          className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-25 ${
            isRevealed ? 'bg-amber-500/30' : 'bg-indigo-600/25'
          }`}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{appName} · Understand What You Don't Know Through What You've Already Lived</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
            Ever had this happen?
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Touch the dilemma below to see how one event can have more than one explanation:
          </p>
        </div>

        {/* The tactile moment: compare an initial interpretation with an unverified alternative. */}
        <div className="relative z-10 max-w-2xl mx-auto mt-6 rounded-2xl bg-[#080b12] border border-stone-800 p-5 sm:p-6 space-y-4 shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">
              The Living Dilemma
            </span>
            <button
              onClick={handleToggleReveal}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                isRevealed
                  ? 'bg-amber-600 text-stone-950 border-amber-500 shadow-md'
                  : 'bg-[#141824] text-stone-300 border-stone-700 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isRevealed ? 'Showing Another Possibility' : 'See Another Possible Explanation'}</span>
            </button>
          </div>

          <div
            onClick={handleToggleReveal}
            className={`p-5 rounded-xl border transition-all duration-500 cursor-pointer ${
              isRevealed
                ? 'bg-gradient-to-r from-amber-950/40 via-stone-900 to-[#19150f] border-amber-500/40'
                : 'bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-indigo-900/40'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono mb-2">
              <span className={isRevealed ? 'text-amber-400 font-bold' : 'text-indigo-400 font-bold'}>
                {isRevealed ? 'Perspective 2 · One Other Possible Explanation' : 'Perspective 1 · The Meaning You Assigned'}
              </span>
              <span className="text-stone-400 italic">Tap card to flip</span>
            </div>

            <p className="font-serif text-base sm:text-lg text-stone-100 leading-snug">
              {isRevealed
                ? '"They might have been distracted, preoccupied, or dealing with something you could not see. We do not know what was happening without more information."'
                : '"They looked in my direction and walked right past without saying hello. They think they are better than me. Next time I see them, I will ignore them first."'}
            </p>

            <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-stone-400">
              <span>{isRevealed ? 'The Discovery: The same silence can have different explanations' : 'The Result: A reaction based on an untested assumption can have real consequences'}</span>
              {isRevealed ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScenarioClick(everydayScenarios[0]);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/40 cursor-pointer transition-all shrink-0"
                >
                  <span>Launch Living Discovery Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-amber-400 underline underline-offset-4 font-sans text-xs">
                  Touch card to compare possibilities &rarr;
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid of Recognizable Everyday Situations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Pick a familiar situation you've experienced:
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Tap a dilemma to explore possible mechanisms, crucial differences, and what another field may help explain:
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-[#161a24] px-3 py-1 rounded-lg border border-stone-800 hidden sm:inline">
            Instant Interactive View
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {everydayScenarios.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScenarioClick(item)}
              disabled={isLoading}
              className="group text-left p-4 sm:p-5 rounded-2xl bg-[#12151e] hover:bg-[#181d2a] border border-stone-800 hover:border-amber-500/50 transition-all cursor-pointer shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-stone-100 group-hover:text-amber-200">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#0b0e14] text-stone-400 border border-stone-800">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                  {item.subtext}
                </p>
              </div>

              <div className="text-[11px] font-mono text-amber-400/90 mt-4 flex items-center justify-between border-t border-stone-800/80 pt-2.5 group-hover:text-amber-300 transition-colors">
                <span>See what's underneath</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Conversational Writing Space */}
      <div className="rounded-3xl bg-[#11141e] border border-stone-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              Or describe what happened to you in your own words:
            </span>
            <span className="text-[11px] text-stone-500 font-mono">No corporate jargon</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="rounded-2xl bg-[#090b11] border border-stone-800 focus-within:border-amber-500/60 transition-colors p-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Someone said something that bugged me... / A coworker stopped replying... / I'm stuck doing all the work at home..."
                rows={3}
                className="w-full bg-transparent text-stone-100 placeholder-stone-500 text-sm focus:outline-none resize-none leading-relaxed"
                disabled={isLoading}
              />

              <div className="flex items-center justify-between pt-3 border-t border-stone-900 text-xs">
                <span className="text-[11px] text-stone-500 font-mono">
                  {text.length > 0 ? `${text.length} characters` : 'Talk naturally. We look for the pattern.'}
                </span>

                <button
                  type="submit"
                  disabled={isLoading || !text.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 shadow-md shadow-amber-950/30"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Finding Pattern...</span>
                    </>
                  ) : (
                    <>
                      <span>Show Me What's Happening</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
