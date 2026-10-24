import React from 'react';
import { SearchCheck, GitCompare, History, LoaderCircle } from 'lucide-react';
import type { CrossExaminationResult } from '../types/sameStory';

interface CrossExaminationPanelProps {
  focus: 'mechanism' | 'parallels' | 'eras';
  result: CrossExaminationResult | null;
  busy: boolean;
  error: string | null;
  onRun: () => void;
}

export const CrossExaminationPanel: React.FC<CrossExaminationPanelProps> = ({
  focus, result, busy, error, onRun,
}) => {
  const title = focus === 'eras'
    ? 'Cross-examine the era connection'
    : focus === 'parallels'
      ? 'Cross-examine possible parallels'
      : 'Challenge the proposed mechanism';
  const detail = focus === 'eras'
    ? 'Compare the function, language, tools and knowledge available in different periods.'
    : focus === 'parallels'
      ? 'Compare other systems by what causes the outcome, not by shared words.'
      : 'Test competing causes. What evidence could change the conclusion?';

  return (
    <section className="rounded-2xl border border-cyan-500/30 bg-[#101a26] p-4 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <SearchCheck className="w-6 h-6 text-cyan-300 shrink-0" />
        <div className="space-y-1">
          <h3 className="font-serif text-lg sm:text-xl text-white font-semibold">{title}</h3>
          <p className="text-xs sm:text-sm text-stone-300">{detail}</p>
        </div>
      </div>
      {!result && (
        <div className="space-y-2">
          <button type="button" disabled={busy} onClick={onRun}
            className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-stone-950 px-4 py-2 font-bold text-sm disabled:opacity-50 flex gap-2 items-center cursor-pointer">
            {busy ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <SearchCheck className="w-4 h-4" />}
            {busy ? 'Cross-examining…' : 'Run Cross-Examination'}
          </button>
          <p className="text-[11px] text-stone-400">Uses one additional live Gemini request when tapped. Not an independent source or fact check.</p>
        </div>
      )}
      {error && <p role="alert" className="text-sm text-rose-200 rounded-lg border border-rose-500/30 p-3">{error}</p>}
      {result && (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-500/25 bg-[#11221d] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-300">Best question to settle it</p>
            <p className="text-sm text-stone-100 mt-1">{result.nextCheck}</p>
          </div>
          {focus === 'mechanism' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-400">Observation: {result.observed}</p>
              {result.hypotheses.map((h, i) => (
                <article key={i} className="rounded-xl border border-stone-700 bg-[#10141e] p-4 space-y-2">
                  <h4 className="font-semibold text-white">{h.explanation}</h4>
                  <p className="text-xs text-emerald-200"><strong>Would support it:</strong> {h.whatWouldSupport}</p>
                  <p className="text-xs text-rose-200"><strong>Would challenge it:</strong> {h.whatWouldChallenge}</p>
                </article>
              ))}
            </div>
          )}
          {focus === 'parallels' && (
            <div className="space-y-3">
              {result.crossDomainCandidates.length ? result.crossDomainCandidates.map((item, i) => (
                <article key={i} className="rounded-xl border border-stone-700 bg-[#10141e] p-4 space-y-2">
                  <h4 className="flex gap-2 items-center font-semibold text-white"><GitCompare className="w-4 h-4 text-cyan-300" /> {item.system}</h4>
                  <p className="text-sm text-stone-200"><strong>Possible shared function:</strong> {item.sharedMechanism}</p>
                  <p className="text-sm text-amber-200"><strong>Critical difference:</strong> {item.criticalDifference}</p>
                  <p className="text-xs text-cyan-200"><strong>How to challenge it:</strong> {item.howToChallenge}</p>
                </article>
              )) : (
                <p className="text-sm text-stone-300">No cross-system candidate survived this preliminary comparison. The next check above is the useful result.</p>
              )}
            </div>
          )}
          {focus === 'eras' && (
            <div className="space-y-3">
              {result.eraCandidates.length ? result.eraCandidates.map((era, i) => (
                <article key={i} className="rounded-xl border border-stone-700 bg-[#10141e] p-4 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2"><History className="w-4 h-4 text-amber-300" /> {era.period}</h4>
                  <p className="text-sm text-stone-100">{era.comparableFunction}</p>
                  <p className="text-xs text-stone-300"><strong>Tools and limits:</strong> {era.toolsAndLimits}</p>
                  <p className="text-xs text-stone-300"><strong>Possible words and knowledge:</strong> {era.wordsAndKnowledge}</p>
                  <p className="text-xs text-amber-200"><strong>What changed:</strong> {era.whatChanged}</p>
                </article>
              )) : (
                <p className="text-sm text-stone-300">No defensible period comparison was proposed. That is a valid result; the next check is shown above.</p>
              )}
            </div>
          )}
          <p className="text-xs text-stone-400">{result.evidenceBoundary}</p>
          <button onClick={onRun} disabled={busy} type="button" className="text-xs underline text-cyan-300 cursor-pointer disabled:opacity-50">
            {busy ? 'Cross-examining…' : 'Re-examine with a new AI request'}
          </button>
        </div>
      )}
    </section>
  );
};
