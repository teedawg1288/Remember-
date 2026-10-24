import React from 'react';
import { X, FlaskConical, Binary, BookCheck, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { DeepResearchLab } from '../types/sameStory';

interface DeepResearchLabDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  research: DeepResearchLab;
  storyTitle: string;
}

export const DeepResearchLabDrawer: React.FC<DeepResearchLabDrawerProps> = ({
  isOpen,
  onClose,
  research,
  storyTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#10131b] border-l border-emerald-500/30 w-full max-w-2xl h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-lounge-border/70 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Research Lab & Empirical Audit
                </h3>
                <p className="text-xs text-stone-400 font-mono">
                  Formal mechanisms behind: {storyTitle.slice(0, 40)}...
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1b1f2b] text-stone-400 hover:text-white hover:bg-[#252a3a] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Intro notice */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 mb-6 text-xs text-emerald-200/90 leading-relaxed">
            <span className="font-bold text-emerald-300 block mb-0.5">
              Academic Separation Layer:
            </span>
            The conversational stories help generate hypotheses. This lab presents possible measurements and competing explanations; no source or model output should be treated as independently verified just because it appears here.
          </div>

          <div className="space-y-6">
            {/* 1. Formal Scientific Hypothesis */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                Formal Hypothesis:
              </h4>
              <div className="bg-[#161a25] border border-lounge-border rounded-xl p-4 text-xs sm:text-sm text-stone-200 leading-relaxed font-mono">
                {research.formalHypothesis}
              </div>
            </div>

            {/* 2. Measurable Variables & Models */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-2 flex items-center gap-1.5">
                <Binary className="w-4 h-4 text-cyan-400" />
                Measurable Variables:
              </h4>
              <div className="space-y-2">
                {research.measurableVariables.map((v, i) => (
                  <div
                    key={i}
                    className="bg-[#141822] border border-lounge-border/60 rounded-xl p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                  >
                    <span className="font-semibold text-stone-200 font-mono">{v.variable}</span>
                    <span className="text-stone-400 text-[11px] bg-[#0c0e14] px-2.5 py-1 rounded-md border border-lounge-border/40">
                      {v.measurementMethod}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Competing Explanations */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Competing / Alternative Explanations:
              </h4>
              <ul className="space-y-1.5">
                {research.competingExplanations.map((exp, i) => (
                  <li
                    key={i}
                    className="bg-[#141822] border border-lounge-border/60 rounded-xl p-3 text-xs text-stone-300 leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-amber-400 font-mono font-bold">{i + 1}.</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Empirical Test Protocol */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-300 font-bold mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Proposed Empirical Protocol:
              </h4>
              <div className="bg-[#12151f] border border-lounge-border rounded-xl p-4 text-xs text-stone-300 leading-relaxed font-sans">
                {research.proposedTestProtocol}
              </div>
            </div>

            {/* 5. Peer-Reviewed Citations */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold mb-2 flex items-center gap-1.5">
                <BookCheck className="w-4 h-4 text-stone-400" />
                Candidate References & Literature (Check Independently):
              </h4>
              <div className="space-y-2">
                {research.peerReviewedReferences.map((ref, i) => (
                  <div
                    key={i}
                    className="bg-[#0e1119] border border-lounge-border/50 rounded-xl p-3 text-xs"
                  >
                    <p className="font-medium text-stone-200 mb-1">{ref.citation}</p>
                    {ref.doiOrSource && /^https:\/\//i.test(ref.doiOrSource) && (
                      <a className="text-cyan-300 underline block my-1" href={ref.doiOrSource} target="_blank" rel="noopener noreferrer">Inspect candidate source</a>
                    )}
                    {!ref.doiOrSource && <p className="text-amber-300 text-[11px]">No linked source supplied; citation unverified.</p>}
                    <p className="text-[11px] text-amber-400/80 italic font-mono">
                      Relevance: {ref.relevance}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-lounge-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Close Lab Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
