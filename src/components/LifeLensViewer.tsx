import React, { useState } from 'react';
import { Disc3, Sparkles, Clock, Music, Eye, Heart, CheckCircle2 } from 'lucide-react';
import { LifeLensStage } from '../types/sameStory';
import { sound } from '../audio/soundEngine';

interface LifeLensViewerProps {
  lenses: LifeLensStage[];
}

export const LifeLensViewer: React.FC<LifeLensViewerProps> = ({ lenses }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(1); // Default to "Carrying The Load" (index 1)

  if (!lenses || lenses.length === 0) return null;

  const current = lenses[activeStageIndex] || lenses[0];

  const handleSelect = (idx: number) => {
    setActiveStageIndex(idx);
    sound.playNodeChime(400 + idx * 70);
  };

  return (
    <div className="bg-[#121620] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Disc3 className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>The Song 20 Years Later &bull; Places In Life</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            The Song Didn't Change. You Did.
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            Two people can experience the exact same event and take completely different meanings from it because of where they stand in life. Switch the lens below:
          </p>
        </div>

        {/* Lens Stepper */}
        <div className="flex items-center gap-2 bg-[#0d1017] p-1.5 rounded-2xl border border-stone-800 shrink-0">
          {lenses.map((lens, idx) => (
            <button
              key={lens.stageId || idx}
              onClick={() => handleSelect(idx)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                idx === activeStageIndex
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{lens.stageTitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Lens Content Card */}
      <div className="py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
            {current.tagline}
          </span>
          <span className="text-xs text-stone-500 font-mono">
            Life Lens {activeStageIndex + 1} of {lenses.length}
          </span>
        </div>

        {/* How It Appears Through This Lens */}
        <div className="bg-[#181d28] rounded-2xl border border-stone-800 p-5 sm:p-6 text-stone-200 leading-relaxed space-y-2">
          <span className="text-xs font-mono uppercase text-amber-300 font-bold block">
            How The Situation Feels From This Place in Life:
          </span>
          <p className="text-base sm:text-lg font-serif text-white">
            "{current.howItAppearsHere}"
          </p>
        </div>

        {/* Two Contrast Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What Was Invisible */}
          <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>What You Couldn't See Back Then</span>
            </div>
            <p className="text-stone-300 text-sm leading-relaxed">
              {current.whatYouCouldNotSeeThen}
            </p>
          </div>

          {/* The Song Metaphor */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              <Music className="w-4 h-4 text-amber-400" />
              <span>The Music Analogy</span>
            </div>
            <p className="text-stone-300 text-sm leading-relaxed italic">
              "{current.theSongMetaphor}"
            </p>
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-stone-400">
          <p>
            Understanding isn't permanent. As your life deepens, this exact same dilemma will reveal another layer.
          </p>
        </div>
      </div>
    </div>
  );
};
