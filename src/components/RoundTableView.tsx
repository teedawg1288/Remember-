import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, ArrowRight, MessageSquareQuote } from 'lucide-react';
import { RoundTablePerspective, SameStoryResult } from '../types/sameStory';
import { sound } from '../audio/soundEngine';
import { chooseAutomaticLensWeights, redistributeLensWeight } from '../core/roundTableControl';

interface RoundTableViewProps {
  analysis: SameStoryResult;
  onUpdated?: (perspectives: RoundTablePerspective[], synthesis?: SameStoryResult['roundTableSynthesis']) => void;
}

export const RoundTableView: React.FC<RoundTableViewProps> = ({ analysis, onUpdated }) => {
  const [currentPerspectives, setCurrentPerspectives] = useState<RoundTablePerspective[]>(analysis.roundTable || []);
  const [currentSynthesis, setCurrentSynthesis] = useState(analysis.roundTableSynthesis);
  const [activeId, setActiveId] = useState(analysis.roundTable?.[0]?.id || '');
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [weights, setWeights] = useState(() => chooseAutomaticLensWeights(analysis.userOriginalInput || analysis.userWordsSummary, analysis.roundTable || []));
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activePerspective = currentPerspectives.find(p => p.id === activeId) || currentPerspectives[0];

  useEffect(() => {
    setCurrentPerspectives(analysis.roundTable || []);
    setCurrentSynthesis(analysis.roundTableSynthesis);
    setActiveId(analysis.roundTable?.[0]?.id || '');
    setWeights(chooseAutomaticLensWeights(analysis.userOriginalInput || analysis.userWordsSummary, analysis.roundTable || []));
    setMode('auto');
    setError(null);
  }, [analysis.id]);

  const handleModeChange = (nextMode: 'auto' | 'manual') => {
    setMode(nextMode);
    if (nextMode === 'auto') {
      setWeights(chooseAutomaticLensWeights(analysis.userOriginalInput || analysis.userWordsSummary, currentPerspectives));
    }
  };

  const handleRerun = async () => {
    if (isRunning || !currentPerspectives.length) return;
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch('/api/same-story/round-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: analysis.userOriginalInput || analysis.userWordsSummary,
          knownFacts: analysis.familiarStartingPoint || analysis.userWordsSummary,
          proposedMechanism: analysis.underneathMechanism,
          borrowedInsight: analysis.borrowedInsight,
          lenses: currentPerspectives.map(p => ({
            id: p.id, name: p.name, role: p.role, avatar: p.avatar, color: p.color,
            weight: weights[p.id] ?? 0,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success || !Array.isArray(data.perspectives) || !data.perspectives.length || !data.synthesis) {
        throw new Error(data.error || 'Round Table could not complete the comparison.');
      }
      setCurrentPerspectives(data.perspectives);
      setCurrentSynthesis(data.synthesis);
      setActiveId(data.perspectives[0].id);
      onUpdated?.(data.perspectives, data.synthesis);
      sound.playDiscoveryChime();
    } catch (err: any) {
      setError(err?.message || 'Round Table is unavailable.');
    } finally {
      setIsRunning(false);
    }
  };

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
          The Round Table: Four Perspectives on One Dilemma
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
          Each seat translates the problem through a different field. Their ideas can disagree; agreement alone does not make a claim true.
        </p>
      </div>

      {/* User-controlled weighting changes the actual Round Table request. */}
      <div className="mb-6 rounded-2xl border border-cyan-500/30 bg-[#0d1520] p-4 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-bold text-white">Who gets the floor?</p>
            <p className="text-xs text-stone-400">Weights decide how much attention each lens gets, not how likely it is to be right.</p>
          </div>
          <div className="flex rounded-xl border border-stone-700 overflow-hidden text-xs">
            <button type="button" onClick={() => handleModeChange('auto')} className={`px-3 py-2 ${mode === 'auto' ? 'bg-cyan-700 text-white' : 'text-stone-300'}`}>Auto</button>
            <button type="button" onClick={() => handleModeChange('manual')} className={`px-3 py-2 ${mode === 'manual' ? 'bg-cyan-700 text-white' : 'text-stone-300'}`}>My Mix</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentPerspectives.map(seat => (
            <label key={seat.id} className="space-y-1 block">
              <span className="flex justify-between text-xs text-stone-200 gap-2">
                <span>{seat.avatar} {seat.name}</span>
                <span className="font-mono text-cyan-300">{weights[seat.id] ?? 0}%</span>
              </span>
              <input type="range" min={0} max={100} step={1} disabled={mode === 'auto' || isRunning}
                value={weights[seat.id] ?? 0}
                onChange={event => setWeights(prev => redistributeLensWeight(prev, seat.id, Number(event.target.value)))}
                className="w-full accent-cyan-500 disabled:opacity-50" aria-label={`Attention for ${seat.name}`} />
            </label>
          ))}
        </div>
        <button type="button" onClick={handleRerun} disabled={isRunning || !currentPerspectives.length}
          className="rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 px-4 py-2.5 text-stone-950 text-xs font-bold">
          {isRunning ? 'Reconsidering perspectives…' : 'Run the Round Table With This Mix'}
        </button>
        <p className="text-[11px] text-stone-400">One AI model compares these disciplinary perspectives. They are not independent human experts or independently verified research.</p>
        {error && <p role="alert" className="text-rose-300 text-xs">{error}</p>}
      </div>

      {/* Seat Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {currentPerspectives.map((seat) => (
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
      {activePerspective && <div className="bg-[#0e1119] rounded-2xl border border-amber-500/30 p-5 sm:p-7 shadow-lg">
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

        {activePerspective.sourceUrl?.startsWith('https://') && (
          <a href={activePerspective.sourceUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs text-cyan-300 underline inline-block mb-3">Inspect candidate source (not verified)</a>
        )}

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
      </div>}
      {currentSynthesis && (
        <div className="mt-5 rounded-2xl border border-cyan-500/30 bg-[#101722] p-5 space-y-2 text-sm">
          <p className="text-emerald-300"><strong>Common ground:</strong> {currentSynthesis.sharedGround}</p>
          <p className="text-amber-300"><strong>Where the seats disagree:</strong> {currentSynthesis.keyDisagreement}</p>
          <p className="text-stone-200"><strong>Missing evidence:</strong> {currentSynthesis.missingEvidence}</p>
          <p className="text-cyan-200"><strong>Next check:</strong> {currentSynthesis.nextCheck}</p>
        </div>
      )}
    </div>
  );
};
