import React from 'react';
import { GitCommit, Layers, AlertCircle, ArrowDown, Sparkles, RefreshCw, Milestone } from 'lucide-react';
import { StoryDevelopmentArc } from '../types/sameStory';

interface StoryDevelopmentViewProps {
  arc: StoryDevelopmentArc;
}

export const StoryDevelopmentView: React.FC<StoryDevelopmentViewProps> = ({ arc }) => {
  const steps = [
    {
      label: '1. What Started Happening',
      content: arc.whatStartedHappening,
      icon: <GitCommit className="w-4 h-4 text-amber-400" />,
      tag: 'Origin',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
    },
    {
      label: '2. What People Believed Was Happening',
      content: arc.whatPeopleBelieved,
      icon: <AlertCircle className="w-4 h-4 text-purple-400" />,
      tag: 'Perception vs Reality',
      bgColor: 'bg-purple-500/10 border-purple-500/30',
    },
    {
      label: '3. How They Reacted',
      content: arc.howTheyReacted,
      icon: <ArrowDown className="w-4 h-4 text-cyan-400" />,
      tag: 'The Reflex',
      bgColor: 'bg-cyan-500/10 border-cyan-500/30',
    },
    {
      label: '4. What Happened Because of Those Reactions',
      content: arc.whatHappenedBecauseOfReactions,
      icon: <Sparkles className="w-4 h-4 text-rose-400" />,
      tag: 'System Response',
      bgColor: 'bg-rose-500/10 border-rose-500/30',
    },
    {
      label: '5. The Unintended Consequence',
      content: arc.unintendedConsequence,
      icon: <RefreshCw className="w-4 h-4 text-amber-300" />,
      tag: 'Solution Created Problem',
      bgColor: 'bg-amber-950/30 border-amber-500/40',
    },
    {
      label: '6. What Kept The Cycle Going',
      content: arc.whatKeptTheCycleGoing,
      icon: <RefreshCw className="w-4 h-4 text-indigo-400" />,
      tag: 'The Loop',
      bgColor: 'bg-indigo-500/10 border-indigo-500/30',
    },
    {
      label: '7. The Turning Point',
      content: arc.turningPoint,
      icon: <Milestone className="w-4 h-4 text-emerald-400" />,
      tag: 'The Pivot',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
    },
  ];

  return (
    <div className="bg-[#141822] rounded-3xl border border-lounge-border/80 p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>The Progression Arc &bull; Beyond Beginning & Ending</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-white">
          How The Story Actually Developed
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
          Step-by-step breakdown of how beliefs, reactions, and feedback loops drove the situation:
        </p>
      </div>

      {/* Stepped Timeline */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-lounge-border/60">
        {steps.map((s, idx) => (
          <div key={idx} className="relative flex items-start gap-3.5 pl-1 group">
            <div className="w-8 h-8 rounded-full bg-[#1b202c] border border-lounge-border flex items-center justify-center shrink-0 z-10 group-hover:scale-110 transition-transform shadow-md">
              {s.icon}
            </div>

            <div className={`flex-1 p-4 rounded-2xl border ${s.bgColor} transition-all`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-stone-200">{s.label}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-stone-300 border border-white/10">
                  {s.tag}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
                {s.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Where Things Could Have Gone Differently */}
      <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#0f121a] border border-emerald-500/30">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-bold mb-1.5">
          <Milestone className="w-4 h-4" />
          <span>Where Things Could Have Gone Differently:</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
          {arc.whereItCouldHaveGoneDifferently}
        </p>
      </div>

      {/* Level-of-Collapse Framework */}
      <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-[#171b26] to-[#12151f] border border-purple-500/30">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-purple-300 font-bold mb-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>The Level-of-Collapse Framework:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-3">
          <div className="bg-[#0c0e15] p-3 rounded-xl border border-lounge-border/60">
            <span className="text-stone-400 block mb-0.5">Where the consequences appear:</span>
            <span className="text-amber-300 font-semibold">{arc.levelOfCollapse.levelAppears}</span>
          </div>
          <div className="bg-[#0c0e15] p-3 rounded-xl border border-lounge-border/60">
            <span className="text-stone-400 block mb-0.5">Where the driver is maintained:</span>
            <span className="text-purple-300 font-semibold">{arc.levelOfCollapse.levelMaintained}</span>
          </div>
        </div>
        <p className="text-xs text-stone-200 leading-relaxed italic font-serif">
          "{arc.levelOfCollapse.insight}"
        </p>
      </div>
    </div>
  );
};
