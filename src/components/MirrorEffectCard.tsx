import React from 'react';
import { Eye, Check, AlertCircle, HelpCircle, Sparkles } from 'lucide-react';
import { MirrorEffect } from '../types/sameStory';

interface MirrorEffectCardProps {
  mirror: MirrorEffect;
}

export const MirrorEffectCard: React.FC<MirrorEffectCardProps> = ({ mirror }) => {
  return (
    <div className="bg-gradient-to-br from-[#161a25] via-[#12151e] to-[#10121a] rounded-3xl border border-purple-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-semibold mb-2">
          <Eye className="w-3.5 h-3.5 text-purple-400" />
          <span>Requirement 4 &bull; The Mirror Effect</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-white">
          Seeing The Pattern in The Mirror
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
          We easily spot this pattern in movies, books, or someone else's company—here is the gentle question that lets you discover it in your own:
        </p>
      </div>

      {/* The External Metaphor */}
      <div className="bg-[#0c0e15] rounded-2xl p-4 sm:p-5 border border-lounge-border/70 mb-5 italic font-serif text-stone-200 text-sm sm:text-base leading-relaxed">
        "{mirror.externalStoryOrMetaphor}"
      </div>

      {/* The Gentle Reflection Question */}
      <div className="bg-purple-950/20 border-l-4 border-purple-400 rounded-r-2xl p-5 mb-6">
        <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold block mb-1">
          A Gentle Question (No Judgment, Just Curiosity):
        </span>
        <h4 className="font-serif text-lg sm:text-xl font-bold text-white leading-snug">
          "{mirror.gentleReflectionQuestion}"
        </h4>
      </div>

      {/* Objective Facts vs Subjective Perceptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Objective Facts */}
        <div className="bg-[#121620] rounded-2xl border border-emerald-500/30 p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-2 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> What Actually Happened (Facts):
          </span>
          <ul className="space-y-1.5 text-xs text-stone-300">
            {mirror.objectiveFacts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">&bull;</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Subjective Perceptions */}
        <div className="bg-[#18131d] rounded-2xl border border-amber-500/30 p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> What People Think Happened (Perceptions):
          </span>
          <ul className="space-y-1.5 text-xs text-stone-300">
            {mirror.subjectivePerceptions.map((p, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">&bull;</span>
                <span className="italic">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The Hidden Blind Spot */}
      <div className="p-4 rounded-2xl bg-[#0d1017] border border-lounge-border text-xs flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
        <div>
          <span className="font-bold text-stone-200">The Hidden Blind Spot: </span>
          <span className="text-stone-300">{mirror.hiddenBlindSpot}</span>
        </div>
      </div>
    </div>
  );
};
