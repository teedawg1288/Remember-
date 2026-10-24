import React, { useState } from 'react';
import { Users, ShieldCheck, ArrowRight, MessageSquareQuote } from 'lucide-react';
import { RoundTablePerspective } from '../types/sameStory';
import { sound } from '../audio/soundEngine';

interface RoundTableViewProps {
  perspectives: RoundTablePerspective[];
}

export const RoundTableView: React.FC<RoundTableViewProps> = ({ perspectives }) => {
  const [activeId, setActiveId] = useState(perspectives[0]?.id || 'barber');
  const activePerspective = perspectives.find((p) => p.id === activeId) || perspectives[0];

  const handleSelect = (id: string) => {
    setActiveId(id);
    sound.playNodeChime(460);
  };

  return (
    <div className="bg-[#141822] rounded-3xl border border-lounge-border/80 p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>Requirement 9 &bull; The Round Table</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-white">
          The Round Table: Four Perspectives on One Dilemma
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
          Different fields describe this exact situation in completely different vocabularies. Listen to what each seat has to say:
        </p>
      </div>

      {/* Seat Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {perspectives.map((seat) => (
          <button
            key={seat.id}
            onClick={() => handleSelect(seat.id)}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeId === seat.id
                ? 'bg-[#1e2331] border-amber-500 shadow-md shadow-amber-950/30'
                : 'bg-[#10131b] border-lounge-border/70 hover:border-stone-500 text-stone-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xl">{seat.avatar}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-stone-300">
                {seat.evidenceStrength.split(' ')[0]}
              </span>
            </div>
            <div>
              <span className={`text-xs font-bold block ${activeId === seat.id ? 'text-amber-300' : 'text-stone-200'}`}>
                {seat.name}
              </span>
              <span className="text-[10px] text-stone-400 line-clamp-1">{seat.role}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Active Seat Spotlight Card */}
      <div className="bg-[#0e1119] rounded-2xl border border-amber-500/30 p-5 sm:p-7 shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">{activePerspective.avatar}</span>
            <div>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
                {activePerspective.name}
              </h4>
              <p className="text-xs text-amber-400/90 font-mono">{activePerspective.role}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-0.5">
              Evidence Foundation:
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
              {activePerspective.evidenceStrength}
            </span>
          </div>
        </div>

        {/* The Take */}
        <div className="bg-[#151924] rounded-xl p-4 sm:p-5 border border-lounge-border text-stone-200 text-sm sm:text-base leading-relaxed italic font-serif mb-4">
          "{activePerspective.take}"
        </div>

        {/* Core Key Point */}
        <div className="flex items-center gap-2 text-xs bg-[#191d29] px-3.5 py-2 rounded-lg border border-amber-500/20 text-stone-200 font-medium">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span><strong className="text-amber-300">Core Takeaway:</strong> {activePerspective.keyPoint}</span>
        </div>
      </div>
    </div>
  );
};
