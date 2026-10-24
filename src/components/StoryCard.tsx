import React from 'react';
import { Landmark, Sparkles, Dna, Wrench, Coffee, Brain, ArrowRight, Eye } from 'lucide-react';
import { StoryParallel, StoryDomain } from '../types/sameStory';

interface StoryCardProps {
  story: StoryParallel;
  index: number;
  onExplore: (story: StoryParallel) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, index, onExplore }) => {
  const getDomainIcon = (domain: StoryDomain) => {
    switch (domain) {
      case 'history':
        return <Landmark className="w-4 h-4 text-amber-400" />;
      case 'mythology_religion':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'science_biology':
        return <Dna className="w-4 h-4 text-emerald-400" />;
      case 'engineering':
        return <Wrench className="w-4 h-4 text-cyan-400" />;
      case 'psychology':
        return <Brain className="w-4 h-4 text-indigo-400" />;
      case 'everyday_life':
      default:
        return <Coffee className="w-4 h-4 text-amber-300" />;
    }
  };

  const getDomainStyle = (domain: StoryDomain) => {
    switch (domain) {
      case 'history':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
      case 'mythology_religion':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/25';
      case 'science_biology':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
      case 'engineering':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25';
      case 'psychology':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25';
      case 'everyday_life':
      default:
        return 'bg-stone-500/10 text-stone-300 border-stone-500/25';
    }
  };

  return (
    <div className="bg-[#141821] rounded-2xl border border-lounge-border hover:border-amber-500/40 p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between shadow-lg relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />

      <div>
        {/* Top header: Domain & Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getDomainStyle(
              story.domain
            )}`}
          >
            {getDomainIcon(story.domain)}
            <span>{story.domainLabel}</span>
          </div>
          <span className="text-[11px] font-mono text-stone-400">Parallel #{index + 1}</span>
        </div>

        {/* Story Title & Setting */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-amber-200 transition-colors leading-snug mb-1">
          {story.title}
        </h3>
        <p className="text-xs text-amber-400/80 font-mono mb-4 flex items-center gap-1">
          <span>📍</span> {story.timeAndPlace}
        </p>

        {/* Narrative */}
        <div className="bg-[#0e1118] rounded-xl p-3.5 border border-lounge-border/60 text-stone-300 text-xs sm:text-sm leading-relaxed mb-4 italic font-serif">
          "{story.narrative}"
        </div>

        {/* Character Mapping: Who Plays Who */}
        <div className="mb-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-2">
            Who Plays Who:
          </p>
          <div className="space-y-1.5">
            {story.characterMapping.slice(0, 3).map((mapping, mIdx) => (
              <div
                key={mIdx}
                className="flex items-center justify-between text-xs bg-[#191d28]/70 px-2.5 py-1.5 rounded-lg border border-lounge-border/40 gap-2"
              >
                <span className="text-stone-300 truncate max-w-[45%] font-medium">
                  {mapping.roleInUserStory}
                </span>
                <span className="text-amber-500/80 text-[10px]">&harr;</span>
                <span className="text-amber-300 truncate max-w-[45%] font-semibold text-right">
                  {mapping.roleInParallelStory}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* What this field figured out */}
        <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 mb-4">
          <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-bold mb-1">
            What was figured out here:
          </p>
          <p className="text-xs text-stone-200 leading-relaxed font-medium">
            {story.whatThisFieldAlreadyFiguredOut}
          </p>
        </div>
      </div>

      {/* Action: Explore history & evidence */}
      <button
        onClick={() => onExplore(story)}
        className="w-full mt-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#1d222e] hover:bg-amber-600 hover:text-stone-950 text-stone-300 font-semibold text-xs transition-all border border-lounge-border hover:border-amber-500/50 cursor-pointer"
      >
        <Eye className="w-3.5 h-3.5" />
        <span>Explore Historical Evidence</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
