import React from 'react';
import { ArrowLeftRight, Compass, Scale, ShieldCheck, CircleHelp } from 'lucide-react';
import type { MeaningSynchronization } from '../types/sameStory';

interface Props {
  comparison?: MeaningSynchronization;
}

/**
 * A two-way translator, not a personality verdict.
 * Language about someone's mind is deliberately shown as unconfirmed.
 */
export const MeaningSynchronizationView: React.FC<Props> = ({ comparison }) => {
  if (!comparison || !Array.isArray(comparison.directions) || comparison.directions.length !== 2) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#101b27] to-[#10121a] p-5 sm:p-7 space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-cyan-300">
          <ArrowLeftRight className="h-4 w-4" /> Mutual Meaning Bridge
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          What each side meant. What the other understood.
        </h3>
        <p className="text-xs leading-relaxed text-stone-300">
          Both directions matter. Unobserved interpretations are possibilities until confirmed.
          A role or label does not establish human worth or prove what a system can do.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {comparison.directions.map((direction, index) => (
          <article key={index} className="rounded-2xl border border-stone-700 bg-[#101721] p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-300">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              {direction.from} → {direction.to}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-stone-400">What was actually said or signalled</p>
              <p className="mt-1 text-sm text-white">{direction.observableWordsOrSignal}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-stone-400">Possible meaning at the source</p>
              <p className="mt-1 text-sm text-stone-200">{direction.possibleIntendedMeaningOrFunction}</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3">
              <p className="text-[10px] uppercase tracking-wider text-amber-300">Possible meaning received · Not confirmed</p>
              <p className="mt-1 text-sm text-stone-100">{direction.possibleReceivedMeaningOrEffect}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-cyan-300">Ask or check</p>
              <p className="mt-1 text-sm text-stone-200">{direction.whatWouldConfirm}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-stone-700 bg-[#0e151e] p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <Scale className="h-4 w-4" /> {comparison.contextType === 'systems' ? 'Label is not performance' : 'Role is not worth'}
        </div>
        <p className="text-sm text-white">
          <span className="text-stone-400">Title or label in play: </span>{comparison.assignedRoleOrTitle}
        </p>
        <p className="text-sm text-stone-200">
          <span className="font-semibold text-cyan-300">What it can establish: </span>{comparison.whatThatRoleActuallyEstablishes}
        </p>
        <p className="text-sm text-stone-200">
          <span className="font-semibold text-amber-300">What it cannot prove: </span>{comparison.whatItDoesNotProve}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-700 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
            <Compass className="h-4 w-4 text-cyan-300" /> Then: what was known?
          </div>
          <p className="text-sm text-stone-200">{comparison.informationAvailableThen}</p>
          <p className="text-sm text-stone-300">
            <span className="text-amber-300">Missing: </span>{comparison.informationMissingThen}
          </p>
          <p className="text-sm text-stone-300">
            <span className="text-amber-300">Impact: </span>{comparison.consequenceOrImpact}
          </p>
        </div>
        <div className="rounded-xl border border-stone-700 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
            <ShieldCheck className="h-4 w-4 text-emerald-300" /> Now: what changes?
          </div>
          <p className="text-sm text-stone-200">{comparison.newInformationOrOpportunity}</p>
          <p className="text-sm text-stone-300">
            <span className="text-emerald-300">Choice and responsibility: </span>{comparison.choiceAndResponsibilityNow}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-500/25 bg-cyan-950/20 p-4 space-y-3">
        <p className="text-sm text-white"><span className="font-semibold text-cyan-300">Shared ground: </span>{comparison.commonGround}</p>
        <p className="text-sm text-stone-300"><span className="font-semibold text-amber-300">Still unknown: </span>{comparison.unknowns}</p>
        <div className="flex gap-2 items-start border-t border-cyan-500/20 pt-3">
          <CircleHelp className="h-4 w-4 mt-0.5 shrink-0 text-cyan-300" />
          <p className="text-sm text-cyan-100">{comparison.nextMutualCheck}</p>
        </div>
      </div>
    </section>
  );
};
