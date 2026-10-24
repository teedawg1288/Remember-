import React from 'react';
import { X, Landmark, BookOpen, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { StoryParallel } from '../types/sameStory';

interface StoryHistoryModalProps {
  story: StoryParallel | null;
  onClose: () => void;
}

export const StoryHistoryModal: React.FC<StoryHistoryModalProps> = ({ story, onClose }) => {
  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#141822] border border-lounge-border/90 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#1d222e] text-stone-400 hover:text-white hover:bg-[#252b3b] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2">
            <Landmark className="w-3.5 h-3.5" />
            <span>{story.domainLabel}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">
            {story.title}
          </h2>
          <p className="text-xs sm:text-sm font-mono text-amber-400/90">
            Era & Origin: {story.timeAndPlace}
          </p>
        </div>

        {/* Storytelling Narrative */}
        <div className="bg-[#0c0f15] border border-lounge-border/70 rounded-xl p-4 sm:p-5 mb-6 text-stone-200 text-sm leading-relaxed font-serif italic">
          "{story.narrative}"
        </div>

        {/* Historical Reality: What Actually Happened */}
        <div className="space-y-5">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              What Actually Happened:
            </h4>
            <div className="bg-[#191d29] border border-lounge-border/60 rounded-xl p-4 text-sm text-stone-300 leading-relaxed">
              {story.whatActuallyHappened}
            </div>
          </div>

          {/* Solution & Breakthrough */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              The Breakthrough / Established Principle:
            </h4>
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-sm text-emerald-100 leading-relaxed">
              {story.whatThisFieldAlreadyFiguredOut}
            </div>
          </div>

          {/* Historical Record & Evidence */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-stone-400" />
              Primary Sources & Empirical Documentation:
            </h4>
            <div className="bg-[#10131a] border border-lounge-border/40 rounded-xl p-3.5 text-xs text-stone-400 font-mono leading-relaxed">
              {story.historicalRecordOrEvidence}
            </div>
          </div>

          {/* Character Roles in Depth */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold mb-2">
              Character & Entity Correspondence:
            </h4>
            <div className="divide-y divide-lounge-border/50 bg-[#161a25] rounded-xl border border-lounge-border/70 overflow-hidden">
              {story.characterMapping.map((map, i) => (
                <div key={i} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-stone-400">Your Story: </span>
                    <span className="text-stone-100 font-medium">{map.roleInUserStory}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-amber-400 hidden sm:inline" />
                    <span className="text-amber-300 font-semibold">{map.roleInParallelStory}</span>
                    <span className="text-stone-400 text-[10px]">({map.realEntity})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="mt-8 pt-4 border-t border-lounge-border/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Done Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
