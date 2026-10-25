import React, { useState } from 'react';
import { ArrowRight, Bookmark, CheckCircle2, Compass, GitCompare, HelpCircle } from 'lucide-react';
import type { SameStoryResult, CrossExaminationResult } from '../types/sameStory';
import { CrossExaminationPanel } from './CrossExaminationPanel';

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
  const stage = bridge?.stages[Math.min(stageIndex, bridge.stages.length - 1)];
  const runCrossExam = async () => {
    if (examBusy) return;
    setExamBusy(true);
    setExamError(null);
    try {
      const response = await fetch('/api/same-story/cross-examine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: core.question, proposedMechanism: core.possibleMechanism }),
      });
      const data = await response.json();
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
        <details className="rounded-xl border border-stone-700 bg-[#101521] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-stone-300">How REMEMBER read your question</summary>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <section className="rounded-xl border border-stone-700 p-3">
              <h2 className="text-xs font-bold text-amber-300 uppercase mb-2">What you asked</h2>
              <p className="text-sm leading-relaxed">{core.whatIsReported}</p>
            </section>
            <section className="rounded-xl border border-cyan-500/30 p-3">
              <h2 className="text-xs font-bold text-cyan-300 uppercase mb-2">Possible pattern</h2>
              <p className="text-sm leading-relaxed">{core.possibleMechanism}</p>
            </section>
          </div>
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
                <p className="text-[10px] uppercase text-stone-400">{bridge.originalDomain}</p>
                <h3 className="text-sm sm:text-xl font-semibold break-words">{bridge.originalSystem}</h3>
              </div>
              <ArrowRight aria-hidden="true" className="w-5 h-5 text-cyan-400" />
              <div className="rounded-xl bg-[#10252a] border border-cyan-500/35 p-3 sm:p-5 text-center min-w-0">
                <p className="text-[10px] uppercase text-stone-400">{bridge.comparisonDomain}</p>
                <h3 className="text-sm sm:text-xl font-semibold break-words">{bridge.comparisonSystem}</h3>
              </div>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-[#0b111b] p-4">
              <p className="text-xs text-cyan-300 uppercase font-semibold mb-1">What connects these systems</p>
              <p className="font-serif text-lg">{bridge.possibleSharedMechanism}</p>
            </div>
            <div>
              <p className="text-xs text-stone-300 mb-3">Tap each step to see what matches—and what doesn't.</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {bridge.stages.map((item, index) => (
                  <button key={index} onClick={() => setStageIndex(index)}
                    aria-pressed={stageIndex === index}
                    className={'rounded-xl p-3 border text-left text-xs cursor-pointer ' + (stageIndex === index ? 'border-cyan-400 bg-cyan-950/40 text-white' : 'border-stone-700 bg-[#151a24] text-stone-300')}>
                    <span className="text-cyan-300 font-bold mr-1">{index + 1}.</span>{item.label}
                  </button>
                ))}
              </div>
            </div>
            {stage && (
              <div className="rounded-xl border border-stone-700 bg-[#131925] p-4 space-y-3" aria-live="polite">
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <p><span className="text-stone-400 text-xs block mb-1">{bridge.originalSystem}</span>{stage.inOriginal}</p>
                  <p><span className="text-stone-400 text-xs block mb-1">{bridge.comparisonSystem}</span>{stage.inComparison}</p>
                </div>
                <p className="text-sm text-cyan-200"><strong>Same function:</strong> {stage.sharedFunction}</p>
                <p className="text-sm text-amber-200"><strong>Crucial difference:</strong> {stage.importantDifference}</p>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-[#10201c] border border-emerald-600/20 p-4">
                <p className="text-emerald-300 font-bold text-xs uppercase mb-2">What this comparison suggests</p>
                {bridge.whatMightTransfer}
              </div>
              <div className="rounded-xl bg-[#231b18] border border-amber-600/20 p-4">
                <p className="text-amber-300 font-bold text-xs uppercase mb-2">Where they're different</p>
                {bridge.whereItBreaks}
              </div>
            </div>
            <p className="text-xs text-stone-400">{core.screening?.status === 'accepted' ? 'Model-screened hypothesis; not independently verified evidence.' : 'Unscreened saved comparison; not independent evidence.'}</p>
            {core.screening?.status === 'accepted' && (
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
            <h3 className="font-semibold text-amber-200">No cross-system prediction strong enough yet</h3>
            <p className="text-sm text-stone-300">{core.screening?.reason || 'No complete causal comparison was found. That does not prove a match is impossible.'}</p>
          </div>
        )}
      </section>

      {core.prediction && (
        <section className="rounded-2xl border border-emerald-500/35 bg-[#101f1d] p-5 sm:p-7 space-y-3">
          <h2 className="font-serif text-xl text-emerald-200">A prediction worth checking</h2>
          <p className="text-sm text-stone-300">A proposed transfer from the other system. This is not an established result.</p>
          <p><strong className="text-emerald-300">If:</strong> {core.prediction.ifCondition}</p>
          <p><strong className="text-emerald-300">Then we might see:</strong> {core.prediction.expectedOutcome}</p>
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
