import React from 'react';
import { Scale, CheckCircle2, XCircle, Sparkles, Compass } from 'lucide-react';
import { DifferenceThatChangesEverything } from '../types/sameStory';

interface DifferenceThatChangesEverythingViewProps {
  diff: DifferenceThatChangesEverything;
}

export const DifferenceThatChangesEverythingView: React.FC<DifferenceThatChangesEverythingViewProps> = ({
  diff,
}) => {
  return (
    <div className="bg-[#141822] rounded-3xl border border-amber-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2">
          <Scale className="w-3.5 h-3.5" />
          <span>Requirement 6 &bull; The Divergence Law</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-white">
          The Difference That Changes Everything
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
          Two situations can look identical on the surface, but one survives while the other collapses. What is the single difference that decided the outcome?
        </p>
      </div>

      {/* Side-by-Side Divergence Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Case A: Survived / Recovered */}
        <div className="bg-[#0f1418] rounded-2xl border border-emerald-500/30 p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-bold mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Case A &bull; Survived / Recovered</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-white mb-2">
              {diff.caseASurvived.name}
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
              {diff.caseASurvived.description}
            </p>
          </div>
          <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30 text-xs text-emerald-200 font-medium">
            <span className="font-bold block mb-0.5">Outcome:</span>
            {diff.caseASurvived.outcome}
          </div>
        </div>

        {/* Case B: Collapsed / Relapsed */}
        <div className="bg-[#171013] rounded-2xl border border-rose-500/30 p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-rose-400 font-bold mb-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Case B &bull; Collapsed / Relapsed</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-white mb-2">
              {diff.caseBCollapsed.name}
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
              {diff.caseBCollapsed.description}
            </p>
          </div>
          <div className="bg-rose-950/30 p-3 rounded-xl border border-rose-500/30 text-xs text-rose-200 font-medium">
            <span className="font-bold block mb-0.5">Outcome:</span>
            {diff.caseBCollapsed.outcome}
          </div>
        </div>
      </div>

      {/* The Crucial Difference Banner */}
      <div className="bg-gradient-to-r from-amber-950/30 to-[#191d29] border-l-4 border-amber-500 rounded-r-2xl p-5 mb-6">
        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
          The Deciding Pivot:
        </span>
        <h4 className="font-serif text-lg sm:text-xl font-bold text-white mb-1">
          "{diff.theCrucialDifference}"
        </h4>
        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
          {diff.whyThisExplainsTheOutcome}
        </p>
      </div>

      {/* Cross-Field Discovery Application */}
      <div className="bg-[#0e111a] rounded-2xl border border-cyan-500/30 p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
              Cross-Field Discovery Question:
            </span>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
              "{diff.crossFieldDiscoveryApplication}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
