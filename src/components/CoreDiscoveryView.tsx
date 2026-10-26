import React, { useState } from 'react';
import { ArrowRight, Bookmark, CheckCircle2, Compass, GitCompare, HelpCircle } from 'lucide-react';
import type { SameStoryResult, CrossExaminationResult } from '../types/sameStory';
import { CrossExaminationPanel } from './CrossExaminationPanel';
import { confirmedExperienceExcerpt } from '../data/grounding';
import { readApiResponse } from '../data/apiResponse';

const asDependentClause = (value: string) => {
  const clause = value.trim().replace(/[.!?]+$/, '');
  return /^(The|A|An|This|That|These|Those)\s/.test(clause)
    ? clause[0].toLowerCase() + clause.slice(1) : clause;
};

interface Props {
  analysis: SameStoryResult;
  isSaved: boolean;
  onToggleSave: () => void;
  onNewQuestion: () => void;
}

export const CoreDiscoveryView: React.FC<Props> = ({
  analysis, isSaved, onToggleSave, onNewQuestion,
}) => {
  const core = analysis.coreDiscovery;
  const [bridgeIndex, setBridgeIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [crossExam, setCrossExam] = useState<CrossExaminationResult | null>(null);
  const [examBusy, setExamBusy] = useState(false);
  const [examError, setExamError] = useState<string | null>(null);
  if (!core) return null;

  const bridge = core.bridges[bridgeIndex];
  const confirmedDonor = bridge ? confirmedExperienceExcerpt(core.question, bridge.comparisonSystem) : null;
  const stage = bridge?.stages[Math.min(stageIndex, bridge.stages.length - 1)];
  const runCrossExam = async () => {
    if (examBusy) return;
    setExamBusy(true);
    setExamError(null);
    try {
      const response = await fetch('/api/same-story/cross-examine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: core.question,
          proposedMechanism: core.possibleMechanism,
          // Cross-examination must interrogate the bridge the user actually sees.
          selectedBridge: bridge ? {
            originalSystem: bridge.originalSystem,
            comparisonSystem: bridge.comparisonSystem,
            sharedMechanism: core.screening?.causalMatch || bridge.possibleSharedMechanism,
            crucialDifference: core.screening?.crucialDifference || bridge.whereItBreaks,
            screeningStatus: core.screening?.status || 'unscreened',
            stages: bridge.stages,
          } : null,
          reviewedPrediction: core.prediction ? {
            ifCondition: core.prediction.ifCondition,
            expectedOutcome: core.prediction.expectedOutcome,
            borrowedFromOtherSystem: core.prediction.borrowedFromOtherSystem,
            whyItMayFail: core.prediction.whyItMayFail,
          } : null,
        }),
      });
      const data = await readApiResponse(response);
      if (!response.ok || !data.success || !data.examination) {
        throw new Error(data.error || 'Cross-examination is unavailable.');
      }
      setCrossExam(data.examination as CrossExaminationResult);
    } catch (err) {
      setExamError(err instanceof Error ? err.message : 'Cross-examination is unavailable.');
    } finally {
      setExamBusy(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-7 space-y-6 text-stone-100">
      <header className="rounded-3xl border border-amber-500/25 bg-[#151b27] p-5 sm:p-7 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">REMEMBER · Discovery</span>
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 text-sm rounded-lg border border-stone-600 px-3 py-2 hover:border-amber-400">
            <Bookmark className="w-4 h-4" />{isSaved ? 'Saved in Vault' : 'Save discovery'}
          </button>
        </div>
        <p className="text-xs uppercase tracking-wider text-stone-400">Your exact question</p>
        <h1 className="font-serif text-xl sm:text-2xl leading-snug">{core.question}</h1>
        {core.safetyNotice && (
          <div role="alert" className="rounded-xl border border-rose-400/70 bg-rose-950/50 p-4 text-sm font-semibold text-rose-100">
            {core.safetyNotice}
          </div>
        )}
        <details className="rounded-xl border border-stone-700 bg-[#101521] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-stone-300">How REMEMBER read your question</summary>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <section className="rounded-xl border border-stone-700 p-3">
              <h2 className="text-xs font-bold text-amber-300 uppercase mb-2">What was described</h2>
              <p className="text-sm leading-relaxed">{core.whatIsReported}</p><p className="text-xs text-stone-400 mt-2">This is an AI interpretation. Your original words above take priority.</p>
            </section>
            <section className="rounded-xl border border-cyan-500/30 p-3">
              <h2 className="text-xs font-bold text-cyan-300 uppercase mb-2">Possible explanation — not a fact</h2>
              <p className="text-sm leading-relaxed">{core.possibleMechanism}</p>
            </section>
          </div>
          {core.reportedChain && (
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-xs text-stone-400">Your stated meaning, actions and outcomes stay separate. REMEMBER has not filled in missing steps.</p>
              {core.reportedChain.interpretation && <p className="rounded-lg border border-purple-500/25 p-3"><strong className="text-purple-200">Your interpretation:</strong> “{core.reportedChain.interpretation}”</p>}
              {core.reportedChain.reaction && <p className="rounded-lg border border-blue-500/25 p-3"><strong className="text-blue-200">Response you described:</strong> “{core.reportedChain.reaction}”</p>}
              {core.reportedChain.consequence && <p className="rounded-lg border border-amber-500/25 p-3"><strong className="text-amber-200">Outcome you described:</strong> “{core.reportedChain.consequence}”</p>}
              <p className="text-xs text-stone-400">An outcome does not automatically prove the interpretation that came before it.</p>
            </div>
          )}
        </details>
      </header>

      <section className="rounded-3xl border border-cyan-500/35 bg-[#0c1420] p-5 sm:p-7 space-y-5">
        <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-widest">
          <GitCompare className="w-4 h-4" /> Here's where this might also happen
        </div>
        {bridge ? (
          <>
            {core.bridges.length > 1 && (
              <div className="flex flex-wrap gap-2" aria-label="Choose a system comparison">
                {core.bridges.map((b, index) => (
                  <button key={index} onClick={() => { setBridgeIndex(index); setStageIndex(0); }}
                    aria-pressed={bridgeIndex === index}
                    className={'rounded-lg px-3 py-2 text-xs border ' + (bridgeIndex === index ? 'border-cyan-400 bg-cyan-900/30' : 'border-stone-700')}>
                    {b.originalSystem} ↔ {b.comparisonSystem}
                  </button>
                ))}
              </div>
            )}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
              <div className="rounded-xl bg-[#121c2a] border border-stone-700 p-3 sm:p-5 text-center min-w-0">
                <p className="text-[10px] uppercase text-stone-400">{confirmedDonor ? 'Experience you described' : 'Outside experience · if familiar'}</p>
                <h3 className="text-sm sm:text-xl font-semibold break-words">{bridge.comparisonSystem}</h3>
              </div>
              <ArrowRight aria-label="Use this experience to explore your question" className="w-5 h-5 text-cyan-400" />
              <div className="rounded-xl bg-[#10252a] border border-cyan-500/35 p-3 sm:p-5 text-center min-w-0">
                <p className="text-[10px] uppercase text-stone-400">What you want to understand</p>
                <h3 className="text-sm sm:text-xl font-semibold break-words">{bridge.originalSystem}</h3>
              </div>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-[#0b111b] p-4">
              <p className="text-xs text-cyan-300 uppercase font-semibold mb-1">What connects these systems</p>
              <p className="font-serif text-lg">{core.screening?.experienceTranslation || (core.screening?.status === 'partial' ? core.screening.causalMatch : bridge.possibleSharedMechanism)}</p>
            </div>
            {bridge.stages.length > 0 && <details className="rounded-xl border border-stone-700 bg-[#111824] p-4 space-y-3">
              <summary className="cursor-pointer text-sm text-cyan-200 font-semibold">Want to see how the steps connect?</summary>
              <p className="text-xs text-stone-300 my-3">{confirmedDonor
                ? 'This uses the experience you described. These steps show what carries over and where new knowledge is needed.'
                : 'If this outside experience is familiar, use its steps to see where the new subject is similar and different.'}</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {bridge.stages.map((item, index) => (
                  <button key={index} onClick={() => setStageIndex(index)}
                    aria-pressed={stageIndex === index}
                    className={'rounded-xl p-3 border text-left text-xs cursor-pointer ' + (stageIndex === index ? 'border-cyan-400 bg-cyan-950/40 text-white' : 'border-stone-700 bg-[#151a24] text-stone-300')}>
                    <span className="text-cyan-300 font-bold mr-1">{index + 1}.</span>{item.label}
                  </button>
                ))}
              </div>
              {stage && (
                <div className="rounded-xl border border-stone-700 bg-[#131925] p-4 space-y-3 mt-3" aria-live="polite">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <p><span className="text-stone-400 text-xs block mb-1">{bridge.comparisonSystem}</span>{stage.inComparison}</p>
                    <p><span className="text-stone-400 text-xs block mb-1">{bridge.originalSystem}</span>{stage.inOriginal}</p>
                  </div>
                  <p className="text-sm text-cyan-200"><strong>Same function:</strong> {stage.sharedFunction}</p>
                  <p className="text-sm text-amber-200"><strong>What is different:</strong> {stage.importantDifference}</p>
                  {stage.newKnowledgeNeeded && (
                    <p className="text-sm rounded-lg border border-emerald-500/25 bg-emerald-950/20 p-3"><strong className="text-emerald-200">What you still need to learn here:</strong> {stage.newKnowledgeNeeded}</p>
                  )}
                </div>
              )}
            </details>}
            <div className={core.screening ? 'text-sm' : 'grid sm:grid-cols-2 gap-3 text-sm'}>
              {/* Review replaces the first pass's unreviewed transfer, even without a prediction. */}
              {!core.screening && (
                <div className="rounded-xl bg-[#10201c] border border-emerald-600/20 p-4">
                  <p className="text-emerald-300 font-bold text-xs uppercase mb-2">What this comparison suggests</p>
                  {bridge.whatMightTransfer}
                </div>
              )}
              <div className="rounded-xl bg-[#231b18] border border-amber-600/20 p-4">
                <p className="text-amber-300 font-bold text-xs uppercase mb-2">Where they're different</p>
                {bridge.whereItBreaks}
              </div>
            </div>
            <p className="text-xs text-stone-400">{core.screening?.status === 'accepted'
              ? 'Possible match and prediction, reviewed by AI—not independently verified.'
              : core.screening?.status === 'partial'
                ? 'Possible causal parallel; no reliable transferred prediction yet.'
                : 'Unscreened saved comparison; not independent evidence.'}</p>
            {core.screening?.status === 'partial' && (
              <div className="rounded-lg border border-amber-500/25 bg-[#211c17] p-3 text-sm">
                <p className="font-semibold text-amber-200 mb-1">The connection may hold, but the prediction doesn't yet.</p>
                <p className="text-stone-300">{core.screening.reason}</p>
              </div>
            )}
            {(core.screening?.status === 'accepted' || core.screening?.status === 'partial') && (
              <details className="rounded-lg border border-stone-700 p-3 text-sm text-stone-300">
                <summary className="cursor-pointer font-semibold">Why REMEMBER chose this comparison</summary>
                <p className="mt-3">{core.screening.reason}</p>
                <p className="mt-2"><strong>Matching causes:</strong> {core.screening.causalMatch}</p>
                <p className="mt-2"><strong>What could make it wrong:</strong> {core.screening.crucialDifference}</p>
              </details>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-amber-500/25 bg-[#211c17] p-5 space-y-2">
            <h3 className="font-semibold text-amber-200">{core.safetyNotice ? 'A comparison cannot safely answer this question' : 'No convincing causal parallel found this time'}</h3>
            <p className="text-sm text-stone-300">{core.screening?.reason || 'No complete causal comparison was found. That does not prove a match is impossible.'}</p>
          </div>
        )}
      </section>

      {core.prediction && (
        <section className="rounded-2xl border border-emerald-500/35 bg-[#101f1d] p-5 sm:p-7 space-y-3">
          <h2 className="font-serif text-xl text-emerald-200">A question worth investigating</h2>
          <p className="text-sm text-stone-300">A proposed transfer from the other system. This is not an established result.</p>
          <p className="font-serif text-lg">If {asDependentClause(core.prediction.ifCondition)}, might it follow that {asDependentClause(core.prediction.expectedOutcome)}?</p>
          <p className="text-sm text-stone-300"><strong>Why this question:</strong> {core.prediction.borrowedFromOtherSystem}</p>
          <details className="rounded-lg border border-stone-700 p-3 text-sm">
            <summary className="cursor-pointer font-semibold">Why this prediction—and what would count against it</summary>
            <p className="mt-3"><strong>Borrowed insight:</strong> {core.prediction.borrowedFromOtherSystem}</p>
            <p className="mt-2"><strong>Where it might fail:</strong> {core.prediction.whyItMayFail}</p>
            <p className="mt-2"><strong>What would count against it:</strong> {core.prediction.whatWouldDisproveIt}</p>
          </details>
          <p className="text-sm"><strong className="text-emerald-300">Next safe check:</strong> {core.prediction.safeNextCheck}</p>
        </section>
      )}

      {core.meaningCheck && !/^(not reported|none reported|not specified|no specific (words|statement))/i.test(core.meaningCheck.whatWasSaidOrObserved.trim()) && (
        <section className="rounded-2xl border border-purple-500/25 bg-[#151625] p-5 space-y-3">
          <h2 className="font-serif text-lg">What was understood?</h2>
          <p className="text-xs text-stone-400">Hearing words and understanding their meaning are not the same step. Unreported meanings stay uncertain.</p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <p><strong className="text-purple-300 block">Said or observed</strong>{core.meaningCheck.whatWasSaidOrObserved}</p>
            <p><strong className="text-purple-300 block">Possible intended meaning</strong>{core.meaningCheck.possibleIntendedMeaning}</p>
            <p><strong className="text-purple-300 block">Possible understood meaning</strong>{core.meaningCheck.possibleUnderstoodMeaning}</p>
            <p><strong className="text-purple-300 block">Unknown</strong>{core.meaningCheck.whatRemainsUnknown}</p>
          </div>
          <p className="text-sm text-cyan-200"><strong>Clarify:</strong> {core.meaningCheck.howToClarify}</p>
        </section>
      )}

      <section className="rounded-2xl border border-emerald-500/30 bg-[#11201d] p-5 sm:p-7 space-y-3">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase"><Compass className="w-4 h-4" /> The missing piece</div>
        <h2 className="font-serif text-lg">{core.missingInformation}</h2>
        {!core.prediction && <p className="text-sm"><strong className="text-emerald-300">What to check next:</strong> {core.nextCheck}</p>}
        {bridge && <p className="text-xs text-stone-300"><strong>What could challenge the connection:</strong> {bridge.howToChallenge}</p>}
      </section>

      <details className="rounded-2xl border border-stone-700 bg-[#111722] p-4 sm:p-5">
        <summary className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-stone-200"><HelpCircle className="w-4 h-4" /> Challenge this explanation or explore another era</summary>
        <div className="mt-4 space-y-4">
          {core.alternativeExplanations.length > 0 && (
            <div className="text-sm text-stone-300 space-y-2">
              <p className="text-amber-200 font-semibold">Other explanations worth checking</p>
              {core.alternativeExplanations.map((item, index) => <p key={index}>{index + 1}. {item}</p>)}
            </div>
          )}
          <p className="text-xs text-stone-400">A deeper cross-examination uses one additional Gemini request only when you choose to run it.</p>
          <CrossExaminationPanel focus="mechanism" result={crossExam} busy={examBusy} error={examError} onRun={runCrossExam} />
          {crossExam && <CrossExaminationPanel focus="eras" result={crossExam} busy={examBusy} error={examError} onRun={runCrossExam} />}
        </div>
      </details>

      <div className="flex flex-wrap items-center justify-between gap-3 pb-8">
        <p className="flex gap-2 items-center text-xs text-stone-400"><CheckCircle2 className="w-4 h-4" /> Your conclusions remain yours.</p>
        <button onClick={onNewQuestion} className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-[#111827]">Ask another question</button>
      </div>
    </div>
  );
};
