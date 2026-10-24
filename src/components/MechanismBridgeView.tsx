import React, { useState } from 'react';
import { ArrowLeftRight, GitCompareArrows, Lightbulb, ShieldAlert, FlaskConical } from 'lucide-react';
import type { MechanismBridge } from '../types/sameStory';

interface MechanismBridgeViewProps {
  bridges?: MechanismBridge[];
}

export const MechanismBridgeView: React.FC<MechanismBridgeViewProps> = ({ bridges }) => {
  const [activeBridgeIndex, setActiveBridgeIndex] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const selected = bridges?.[activeBridgeIndex] || bridges?.[0];
  const selectedStage = selected?.stages?.[activeStageIndex] || selected?.stages?.[0];

  const selectBridge = (index: number) => {
    setActiveBridgeIndex(index);
    setActiveStageIndex(0);
  };

  return (
    <section className="rounded-3xl border border-cyan-500/35 bg-gradient-to-br from-[#121c2b] to-[#0d111a] p-5 sm:p-8 space-y-5 shadow-xl" aria-label="Same Mechanism, Different System">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-cyan-500/15 border border-cyan-500/30 p-2.5 text-cyan-300">
          <GitCompareArrows className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest font-mono text-cyan-300">The Mechanism Bridge</p>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">Same Mechanism, Different System</h3>
          <p className="text-sm text-stone-300 mt-1">
            Look at what each system does, stage by stage. Similar structure does not mean identical causes.
          </p>
        </div>
      </div>

      {!bridges ? (
        <div className="rounded-xl border border-stone-700 p-4 bg-[#0e1520] text-sm text-stone-300">
          This result was created before Mechanism Bridge was available. Ask a new question to generate a comparison.
        </div>
      ) : bridges.length === 0 || !selected || !selectedStage ? (
        <div className="rounded-xl border border-amber-500/30 p-4 bg-amber-950/15 text-sm text-amber-200">
          No defensible cross-system mechanism was identified for this question. A weak analogy is not a discovery.
        </div>
      ) : (
        <>
          {bridges.length > 1 && (
            <div className="space-y-2">
              <p className="text-xs text-stone-400">Explore another system</p>
              <div className="flex flex-wrap gap-2">
                {bridges.map((bridge, index) => (
                  <button
                    type="button"
                    key={bridge.id || index}
                    onClick={() => selectBridge(index)}
                    aria-pressed={activeBridgeIndex === index}
                    className={activeBridgeIndex === index
                      ? 'rounded-xl border border-cyan-400 bg-cyan-500/20 text-cyan-100 px-3 py-2 text-xs font-semibold'
                      : 'rounded-xl border border-stone-700 bg-[#101522] text-stone-300 px-3 py-2 text-xs hover:border-cyan-500/40'}
                  >
                    {bridge.comparisonDomain}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-cyan-500/25 bg-[#0b1521] p-4 text-center space-y-1">
            <p className="text-[11px] font-mono uppercase text-cyan-300">Proposed shared mechanism</p>
            <p className="text-lg sm:text-xl font-serif font-bold text-white">{selected.sharedMechanism}</p>
            <p className="text-xs text-stone-400">{selected.reasonForComparison}</p>
            <span className="inline-block rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] px-3 py-1">
              Proposed comparison · Independently unverified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-3">
              <p className="text-[10px] uppercase font-mono text-amber-300">{selected.originalDomain}</p>
              <p className="font-bold text-sm sm:text-base text-white mt-1">{selected.originalSystem}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/10 p-3">
              <p className="text-[10px] uppercase font-mono text-cyan-300">{selected.comparisonDomain}</p>
              <p className="font-bold text-sm sm:text-base text-white mt-1">{selected.comparisonSystem}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-stone-400">Tap a stage to inspect the match and the difference.</p>
            {selected.stages.map((stage, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setActiveStageIndex(index)}
                aria-pressed={index === activeStageIndex}
                className={index === activeStageIndex
                  ? 'w-full rounded-xl border border-amber-400 bg-[#202638] p-3 text-left'
                  : 'w-full rounded-xl border border-stone-700 bg-[#101622] p-3 text-left hover:border-cyan-500/40'}
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-amber-300 mb-2">
                  {index + 1}. {stage.stage}
                </p>
                <div className="grid grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)] items-center gap-2">
                  <span className="text-xs sm:text-sm text-stone-100 break-words">{stage.inOriginalSystem}</span>
                  <ArrowLeftRight className="w-4 h-4 text-cyan-300" />
                  <span className="text-xs sm:text-sm text-stone-100 break-words">{stage.inComparisonSystem}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-stone-700 bg-[#0b1019] p-4 space-y-3">
            <h4 className="text-sm font-bold text-white">Why stage {activeStageIndex + 1} connects</h4>
            <p className="text-sm text-emerald-200">
              <strong className="text-emerald-300">Same function:</strong> {selectedStage.sameFunction}
            </p>
            <p className="text-sm text-rose-200">
              <strong className="text-rose-300">Different mechanism or constraint:</strong> {selectedStage.importantDifference}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-amber-500/25 bg-amber-950/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                <Lightbulb className="w-4 h-4" /> What might transfer
              </div>
              <p className="text-sm text-stone-200">{selected.possibleTransfer}</p>
            </div>
            <div className="rounded-xl border border-rose-500/25 bg-rose-950/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
                <ShieldAlert className="w-4 h-4" /> Where the analogy stops
              </div>
              <p className="text-sm text-stone-200">{selected.transferLimit}</p>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/10 p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-200 font-semibold text-sm">
              <FlaskConical className="w-4 h-4" /> What would test this connection?
            </div>
            <p className="text-sm text-stone-200">{selected.safeNextCheck}</p>
            <p className="text-xs text-stone-400">A testable question, not a prediction of guaranteed results. No experiments on unwilling people.</p>
          </div>
        </>
      )}
    </section>
  );
};
