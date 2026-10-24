import React, { useState } from 'react';
import { Users, ShieldCheck, ArrowRight, MessageSquareQuote } from 'lucide-react';
import { RoundTablePerspective, SameStoryResult } from '../types/sameStory';
import { sound } from '../audio/soundEngine';

interface RoundTableViewProps {
  perspectives: RoundTablePerspective[];
  synthesis?: SameStoryResult['roundTableSynthesis'];
  routing?: SameStoryResult['questionRouting'];
}

export const RoundTableView: React.FC<RoundTableViewProps> = ({ perspectives, synthesis, routing }) => {
  const [activeId, setActiveId] = useState(perspectives[0]?.id || 'barber');
  const activePerspective = perspectives.find((p) => p.id === activeId) || perspectives[0];

  if (perspectives.length === 0) return null;

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
          <span>The Round Table &bull; Different Ways of Knowing</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-white">
          The Round Table: {perspectives.length} Perspectives for This Question
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
          REMEMBER selects useful perspectives from the question itself. Tap a seat for another angle; agreement alone is not proof.
        </p>
        {routing && (
          <div className="mt-4 rounded-xl bg-[#0e1623] border border-cyan-500/25 px-4 py-3 space-y-1">
            <p className="text-xs font-semibold text-cyan-300">Why these perspectives?</p>
            <p className="text-sm text-stone-200">It sounds like you're asking: {routing.inferredNeed}</p>
            <p className="text-xs text-stone-400">{routing.whyTheseSeats}</p>
            <p className="text-[11px] text-stone-500">This is only a starting interpretation of your question. You choose which angle helps.</p>
          </div>
        )}
      </div>

      {/* Seat Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
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
              Perspective's evidence claim (not independently checked):
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

        {activePerspective.whatCouldChangeMyMind && (
          <p className="mb-3 text-xs text-cyan-200"><strong>What could change this view:</strong> {activePerspective.whatCouldChangeMyMind}</p>
        )}
        {activePerspective.questionForOtherSeats && (
          <p className="mb-3 text-xs text-stone-300"><strong>Question for another seat:</strong> {activePerspective.questionForOtherSeats}</p>
        )}

        {/* Core Key Point */}
        <div className="flex items-center gap-2 text-xs bg-[#191d29] px-3.5 py-2 rounded-lg border border-amber-500/20 text-stone-200 font-medium">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span><strong className="text-amber-300">Key Point:</strong> {activePerspective.keyPoint}</span>
        </div>
      </div>
      {synthesis && (
        <div className="mt-5 rounded-2xl border border-cyan-500/30 bg-[#101722] p-5 space-y-2 text-sm">
          <p className="text-emerald-300"><strong>Common ground:</strong> {synthesis.sharedGround}</p>
          <p className="text-amber-300"><strong>Where the seats disagree:</strong> {synthesis.keyDisagreement}</p>
          <p className="text-stone-200"><strong>Missing evidence:</strong> {synthesis.missingEvidence}</p>
          <p className="text-cyan-200"><strong>Next check:</strong> {synthesis.nextCheck}</p>
        </div>
      )}
    </div>
  );
};
