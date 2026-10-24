import React, { useState } from 'react';
import { Users, Building2, Globe2, ArrowRight, CheckCircle2, Sparkles, Scale } from 'lucide-react';
import { ScaleConnection } from '../types/sameStory';
import { sound } from '../audio/soundEngine';

interface BiggerConnectionsLadderProps {
  connections: ScaleConnection[];
}

export const BiggerConnectionsLadder: React.FC<BiggerConnectionsLadderProps> = ({ connections }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!connections || connections.length === 0) return null;

  const current = connections[selectedIndex] || connections[0];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'personal':
        return <Users className="w-4 h-4" />;
      case 'group':
        return <Building2 className="w-4 h-4" />;
      case 'world':
      default:
        return <Globe2 className="w-4 h-4" />;
    }
  };

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
    sound.playNodeChime(420 + idx * 80);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % connections.length;
    handleSelect(nextIdx);
  };

  return (
    <div className="bg-[#121620] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>The Scale Ladder</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            See How This Happens On A Bigger Scale
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            The same invisible dynamic shows up in a text message, in a busy office, and in global history.
          </p>
        </div>

        {/* Stepper Tabs */}
        <div className="flex items-center gap-2 bg-[#0c0e14] p-1.5 rounded-2xl border border-stone-800 shrink-0">
          {connections.map((c, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={c.level || idx}
                onClick={() => handleSelect(idx)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-950/40'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                }`}
              >
                {getLevelIcon(c.level)}
                <span>Scale {idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Scale Card */}
      <div className="py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
              {current.levelLabel}
            </span>
            <span className="text-xs text-stone-400 font-medium">
              &bull; {current.setting}
            </span>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            Level {selectedIndex + 1} of {connections.length}
          </span>
        </div>

        <h4 className="font-serif text-xl sm:text-2xl font-bold text-white mb-3">
          {current.title}
        </h4>

        {/* Story on this scale */}
        <div className="bg-[#181d28] border border-stone-800/80 rounded-2xl p-5 mb-6 text-stone-200 text-base leading-relaxed">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold block mb-1">
            How It Appears Here:
          </span>
          <p>{current.howItAppearsHere}</p>
        </div>

        {/* The 3 Comparison Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>What Is The Same?</span>
            </div>
            <p className="text-stone-200 text-sm leading-relaxed">
              {current.whatIsTheSame}
            </p>
          </div>

          <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>What Is Different?</span>
            </div>
            <p className="text-stone-200 text-sm leading-relaxed">
              {current.whatIsDifferent}
            </p>
          </div>

          <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Scale className="w-4 h-4" />
              <span>Why It Matters</span>
            </div>
            <p className="text-stone-200 text-sm leading-relaxed">
              {current.whyTheDifferenceMatters}
            </p>
          </div>
        </div>

        {/* Next Scale Button */}
        {selectedIndex < connections.length - 1 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a202c] hover:bg-[#222938] border border-stone-700 text-stone-200 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <span>See next level ({connections[selectedIndex + 1]?.levelLabel})</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
