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
          {(focus !== 'mechanism' || !result.nextPredictionQuestion) && (
            <div className="rounded-xl border border-emerald-500/25 bg-[#11221d] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-300">Best safe check</p>
              <p className="text-sm text-stone-100 mt-1">{result.nextCheck}</p>
            </div>
          )}
          {focus === 'mechanism' && result.nextPredictionQuestion && (
            <div className="space-y-4">
              <section className="rounded-xl border border-amber-500/35 bg-[#211b16] p-4 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wide text-amber-300">
                  {result.prediction ? 'The prediction, asked as a question' : 'What must be answered before predicting'}
                </p>
                <h4 className="font-serif text-lg text-white">{result.nextPredictionQuestion.question}</h4>
                <p className="text-sm text-stone-100"><strong>The fact behind this question:</strong> {result.nextPredictionQuestion.factBehindQuestion}</p>
                <p className="text-sm text-stone-200"><strong>Why this question in particular:</strong> {result.nextPredictionQuestion.whyThisQuestion}</p>
                <p className="text-sm text-stone-300"><strong>How the answer changes things:</strong> {result.nextPredictionQuestion.howAnswerChangesPrediction}</p>
              </section>
              <section className="rounded-xl border border-stone-600 bg-[#121a24] p-4 space-y-3">
                <h4 className="font-semibold text-white">What we know—and why it could happen</h4>
                <p className="text-sm text-stone-300"><strong>Reported:</strong> {result.observed}</p>
                {result.causalFacts?.length ? result.causalFacts.map((fact, i) => (
                  <div key={i} className="text-sm border-l-2 border-cyan-500/50 pl-3">
                    <p className="text-[11px] uppercase text-cyan-200">
                      {fact.basis === 'reported' ? 'Stated in the question' : 'General principle · not source-checked'}
                    </p>
                    <p className="text-stone-100">{fact.statement}</p>
                    <p className="text-stone-400"><strong>Why it matters:</strong> {fact.whyItMatters}</p>
                  </div>
                )) : <p className="text-xs text-amber-200">No definite causal facts were established from this question.</p>}
                {result.causalExplanation && (
                  <p className="text-sm text-stone-200"><strong>How it could happen:</strong> {result.causalExplanation}</p>
                )}
              </section>
              {result.prediction ? (
                <details className="rounded-xl border border-emerald-500/30 bg-[#10211e] p-4 text-sm">
                  <summary className="cursor-pointer font-semibold text-emerald-200">What that question would predict if the conditions hold</summary>
                  <div className="mt-3 space-y-2">
                    <p className="text-stone-300"><strong>Borrowed lesson:</strong> {result.prediction.donorLesson}</p>
                    <p className="text-amber-200"><strong>Still unknown here:</strong> {result.prediction.missingTargetCondition}</p>
                    <p><strong className="text-emerald-300">If:</strong> {result.prediction.ifCondition}</p>
                    <p><strong className="text-emerald-300">Then we might see:</strong> {result.prediction.expectedOutcome}</p>
                    <p className="text-stone-300"><strong>Compared with:</strong> {result.prediction.comparedWith}</p>
                    <p className="text-rose-200"><strong>What would count against it:</strong> {result.prediction.whatWouldChallengeIt}</p>
                  </div>
                </details>
              ) : (
                <p className="rounded-xl border border-amber-500/25 bg-[#211b16] p-3 text-sm text-amber-200">No defensible prediction yet. {result.noPredictionReason}</p>
              )}
              <p className="text-xs text-emerald-200"><strong>Safe next check:</strong> {result.nextCheck}</p>
            </div>
          )}
          {focus === 'mechanism' && (
            <div className="space-y-3">
              {!result.nextPredictionQuestion && <p className="text-xs text-stone-400">Observation: {result.observed}</p>}
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
