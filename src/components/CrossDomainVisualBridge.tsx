import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Layers,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Radio,
  Users,
  GitCompare,
  Sliders,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { CrossFieldPrediction, SameStoryResult } from '../types/sameStory';
import { sound } from '../audio/soundEngine';
import { assessPredictionIntegrity } from '../data/predictionIntegrity';

interface CrossDomainVisualBridgeProps {
  analysis: SameStoryResult;
  onOpenResearchLab?: () => void;
}

export const CrossDomainVisualBridge: React.FC<CrossDomainVisualBridgeProps> = ({
  analysis,
  onOpenResearchLab,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isOverlayMode, setIsOverlayMode] = useState<boolean>(false);
  const [testOutcome, setTestOutcome] = useState<'worked' | 'mixed' | 'didnt_work' | null>(() => {
    return (localStorage.getItem(`test_outcome_${analysis.prediction?.id || analysis.id}`) as any) || null;
  });
  const [testNote, setTestNote] = useState<string>(() => {
    return localStorage.getItem(`test_note_${analysis.prediction?.id || analysis.id}`) || '';
  });
  const [noteSaved, setNoteSaved] = useState(false);

  const predictionIntegrity = assessPredictionIntegrity(analysis.prediction);
  const candidateBridge = analysis.mechanismBridges?.[0];
  const prediction: CrossFieldPrediction = analysis.prediction || {
    id: `unavailable-${analysis.id}`,
    timestamp: analysis.timestamp,
    questionInvestigated: 'No specific prediction was supplied',
    donorField: analysis.borrowedInsight?.donorField || 'Not determined',
    targetField: analysis.borrowedInsight?.recipientField || 'Not determined',
    unansweredQuestion: analysis.unresolvedQuestion?.novelQuestion || 'What evidence is still missing?',
    establishedKnowledgeApplied: analysis.borrowedInsight?.whatWasLearnedThere || 'No verified donor finding available.',
    falsifiablePrediction: 'A testable prediction has not been generated for this analysis.',
    evidenceThatWouldProve: 'Define an observable result before testing.',
    evidenceThatWouldDisprove: 'Define a result that would challenge the hypothesis.',
    confidenceRating: 'Plausible Hypothesis' as const,
  };

  const steps = [
    {
      num: '01',
      title: 'Start With What You Know',
      everyday: analysis.userWordsSummary,
      scientific: analysis.familiarStartingPoint || 'The observation supplied by the user',
      connection: 'Separate an observation from the explanation assigned to it.',
    },
    {
      num: '02',
      title: 'Find a Different Field',
      everyday: analysis.borrowedInsight?.recipientField || 'Your original question',
      scientific: analysis.borrowedInsight?.donorField || 'Potential comparison',
      connection: analysis.borrowedInsight?.whatWasLearnedThere || 'Look for a relevant finding, not just a similar story.',
    },
    {
      num: '03',
      title: 'Compare the Mechanisms',
      everyday: analysis.stories?.[0]?.narrative || analysis.userWordsSummary,
      scientific: analysis.stories?.[0]?.whatThisFieldAlreadyFiguredOut || 'Possible donor-domain explanation',
      connection: analysis.underneathMechanism,
    },
    {
      num: '04',
      title: 'Find the Critical Difference',
      everyday: analysis.crucialDifferences?.[0]?.comparison || 'Where the situations may differ',
      scientific: analysis.crucialDifferences?.[0]?.whyThisDifferenceMatters || 'A difference that may break the analogy',
      connection: 'A shared pattern does not guarantee a shared cause or outcome.',
    },
    {
      num: '05',
      title: 'Make a Testable Prediction',
      everyday: prediction.falsifiablePrediction,
      scientific: prediction.evidenceThatWouldDisprove,
      connection: analysis.unresolvedQuestion?.testablePossibility || 'Collect evidence that could change the conclusion.',
    },
  ];

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    sound.playNodeChime(420 + index * 50);
  };

  const handleToggleOverlay = () => {
    setIsOverlayMode(!isOverlayMode);
    sound.playDiscoveryChime();
  };

  const handleSetOutcome = (outcome: 'worked' | 'mixed' | 'didnt_work') => {
    if (predictionIntegrity.status !== 'candidate') return;
    setTestOutcome(outcome);
    localStorage.setItem(`test_outcome_${prediction.id}`, outcome);
    sound.playNodeChime(outcome === 'worked' ? 620 : outcome === 'mixed' ? 480 : 360);
  };

  const handleSaveNote = () => {
    localStorage.setItem(`test_note_${prediction.id}`, testNote);
    setNoteSaved(true);
    sound.playNodeChime(560);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const currentStep = steps[activeStep];

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#111624] via-[#0d101a] to-[#090b12] p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Background ambient pulse */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Cross-Action Discovery · Visual Comparative Bridge</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-medium text-white tracking-tight">
            From a Familiar Experience to a New Question
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
            Follow the proposed bridge step by step. The comparison may be useful even when the mechanism is not yet proven.
          </p>
        </div>

        {/* Blueprint Overlay Toggle */}
        <button
          onClick={handleToggleOverlay}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer border shadow-md ${
            isOverlayMode
              ? 'bg-cyan-500 text-stone-950 border-cyan-400'
              : 'bg-[#151a27] text-cyan-300 border-cyan-500/40 hover:bg-[#1a2133]'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>{isOverlayMode ? 'Split Views' : 'Overlay Blueprints'}</span>
        </button>
      </div>

      {/* 5-Step Process Scrubber */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
            Interactive Mechanism Scrubber
          </span>
          <span className="text-xs font-mono text-cyan-300">
            Step {activeStep + 1} of 5: {currentStep.title}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {steps.map((s, idx) => (
            <button
              key={s.num}
              onClick={() => handleStepClick(idx)}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeStep === idx
                  ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
                  : 'bg-[#0e121c] border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              <span className="text-[10px] font-mono block opacity-60">{s.num}</span>
              <span className="text-xs font-semibold truncate block mt-0.5">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dual-World Visual Stage */}
      <div className="relative z-10">
        {isOverlayMode ? (
          /* Merged Blueprint View */
          <div className="bg-[#0b0e17] rounded-2xl border border-cyan-500/50 p-6 sm:p-8 space-y-6 animate-fade-in shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 uppercase font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Proposed Mechanism Alignment — Check Every Stage
              </span>
              <span className="text-xs font-serif italic text-amber-300">
                "Similar functions do not prove identical causes."
              </span>
            </div>

            {/* Candidate bridge uses the actual question's model-generated stages only. */}
            {candidateBridge && candidateBridge.stages?.length >= 3 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-amber-500/30 bg-[#151821] p-4">
                    <span className="text-amber-300 font-bold">Original · {candidateBridge.originalDomain}</span>
                    <p className="text-stone-200 mt-2">{candidateBridge.originalSystem}</p>
                  </div>
                  <div className="rounded-xl border border-cyan-500/30 bg-[#111b28] p-4">
                    <span className="text-cyan-300 font-bold">Comparison · {candidateBridge.comparisonDomain}</span>
                    <p className="text-stone-200 mt-2">{candidateBridge.comparisonSystem}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {candidateBridge.stages.slice(0, 5).map((stage, idx) => (
                    <div key={idx} className="rounded-xl border border-stone-700 bg-[#111520] p-4 space-y-2">
                      <h4 className="font-bold text-cyan-200 text-sm">{idx + 1}. {stage.stage}</h4>
                      <p className="text-xs text-stone-200"><strong>Original:</strong> {stage.inOriginalSystem}</p>
                      <p className="text-xs text-stone-200"><strong>Comparison:</strong> {stage.inComparisonSystem}</p>
                      <p className="text-xs text-emerald-200"><strong>Possibly shared function:</strong> {stage.sameFunction}</p>
                      <p className="text-xs text-rose-200"><strong>Important difference:</strong> {stage.importantDifference}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-[#111520] border border-cyan-500/20 p-4 space-y-2 text-xs text-stone-200">
                  <p><strong className="text-cyan-300">Potential transfer:</strong> {candidateBridge.possibleTransfer}</p>
                  <p><strong className="text-rose-300">Where it may break:</strong> {candidateBridge.transferLimit}</p>
                  <p><strong className="text-amber-300">Safe next check:</strong> {candidateBridge.safeNextCheck}</p>
                  <p className="text-stone-400">AI-generated structural proposal — not a proven equivalence.</p>
                </div>
              </div>
            ) : (
              <p role="status" className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-5 text-sm text-amber-100">
                REMEMBER has not supplied a complete, stage-by-stage mechanism bridge for this question.
                A similar outcome is not enough to claim the same cause.
              </p>
            )}

            <div className="bg-[#101420] p-4 rounded-xl border border-stone-800 text-xs text-stone-300">
              <span className="font-mono text-amber-400 uppercase font-bold block mb-1">
                The Core Discovery:
              </span>
              <p className="font-serif text-sm sm:text-base text-stone-100 leading-relaxed">
                "{analysis.underneathMechanism}"
              </p>
            </div>
          </div>
        ) : (
          /* Split Comparison View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* World 1: The actual question */}
            <div className="bg-[#0e121c] rounded-2xl border border-stone-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  The Original Situation
                </span>
                <span className="text-[11px] text-stone-400 font-mono">User-provided question</span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-stone-400 block">
                  At this stage in your story:
                </span>
                <p className="font-serif text-base sm:text-lg text-stone-100 mt-1 leading-snug">
                  {currentStep.everyday}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090c14] border border-stone-800/80 text-xs text-stone-400">
                <span className="text-stone-300 font-mono uppercase block mb-1 text-[10px]">
                  What needs checking:
                </span>
                {activeStep === 0 && 'This is an observation. Its cause still needs independent evidence.'}
                {activeStep === 1 && 'Check whether the donor field is genuinely different and relevant.'}
                {activeStep === 2 && 'Test the proposed causal steps, not just similar-looking outcomes.'}
                {activeStep === 3 && 'A difference in causes or constraints may break the analogy.'}
                {activeStep === 4 && 'A valid test must change only the variable the prediction identifies.'}
              </div>
            </div>

            {/* World 2: The Parallel Science */}
            <div className="bg-[#0e1422] rounded-2xl border border-cyan-500/30 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                  <Radio className="w-4 h-4" />
                  Candidate comparison: {analysis.borrowedInsight?.donorField || prediction.donorField}
                </span>
                <span className="text-[11px] text-cyan-300 font-mono">Donor-field idea · Check source</span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-300/80 block">
                  Potential comparison-side information:
                </span>
                <p className="font-serif text-base sm:text-lg text-cyan-100 mt-1 leading-snug">
                  {currentStep.scientific}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090d18] border border-cyan-500/20 text-xs text-stone-300">
                <span className="text-cyan-400 font-mono uppercase block mb-1 text-[10px]">
                  Possible transferable idea (check evidence):
                </span>
                {currentStep.connection}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* The Everyday Test (Clear, Plain Language) */}
      <div className="bg-gradient-to-br from-cyan-950/30 via-[#131826] to-[#0c101a] rounded-2xl p-6 sm:p-8 border border-cyan-500/40 space-y-5 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold block mb-1">
              Proposed Prediction — Check the Test First
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-white font-bold">
              "{prediction.falsifiablePrediction}"
            </h3>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto shrink-0">
            {prediction.sourceUrl?.startsWith('https://') ? 'Candidate source supplied' : 'Untested transfer hypothesis'}
          </span>
        </div>

        {predictionIntegrity.status === 'blocked' ? (
          <div role="alert" className="rounded-xl border border-amber-500/40 bg-amber-950/25 p-5 text-sm text-amber-100 space-y-3">
            <p className="font-bold">This prediction's test did not pass REMEMBER's basic consistency check.</p>
            {predictionIntegrity.issues.map((issue, idx) => <p key={idx}>{issue}</p>)}
            <p className="text-stone-300">The proposed proof/failure criteria and outcome buttons are withheld. Define a test that checks the original claim without changing a different variable.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-amber-200">Basic consistency checks passed, but these are still AI-proposed criteria — not independent proof that the experiment is valid.</p>
        {/* Observable Proof Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#0b0f17] p-4 rounded-xl border border-emerald-500/30 space-y-1.5">
            <span className="text-emerald-400 font-bold font-mono uppercase flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Possible observation supporting the prediction:
            </span>
            <p className="text-stone-200 leading-relaxed font-sans">
              {prediction.evidenceThatWouldProve}
            </p>
          </div>

          <div className="bg-[#120c11] p-4 rounded-xl border border-rose-500/30 space-y-1.5">
            <span className="text-rose-400 font-bold font-mono uppercase flex items-center gap-1.5 text-[11px]">
              <XCircle className="w-4 h-4 text-rose-400" />
              Possible observation challenging the prediction:
            </span>
            <p className="text-stone-200 leading-relaxed font-sans">
              {prediction.evidenceThatWouldDisprove}
            </p>
          </div>
        </div>

        {/* Real-World Action Log */}
        <div className="pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase text-amber-400 font-bold block">
              Did you test the proposed change?
            </span>
            <p className="text-xs text-stone-400">
              Log what you observed. This does not independently verify the mechanism:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSetOutcome('worked')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                testOutcome === 'worked'
                  ? 'bg-emerald-600 text-stone-950 shadow-md'
                  : 'bg-[#181d28] text-stone-300 hover:text-emerald-300 hover:bg-[#1f2636]'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>It Worked!</span>
            </button>

            <button
              onClick={() => handleSetOutcome('mixed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                testOutcome === 'mixed'
                  ? 'bg-amber-600 text-stone-950 shadow-md'
                  : 'bg-[#181d28] text-stone-300 hover:text-amber-300 hover:bg-[#1f2636]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Mixed</span>
            </button>

            <button
              onClick={() => handleSetOutcome('didnt_work')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                testOutcome === 'didnt_work'
                  ? 'bg-rose-600 text-stone-950 shadow-md'
                  : 'bg-[#181d28] text-stone-300 hover:text-rose-300 hover:bg-[#1f2636]'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Didn't Work</span>
            </button>
          </div>
        </div>

        {testOutcome && (
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={testNote}
              onChange={(e) => setTestNote(e.target.value)}
              placeholder="What did you directly observe when you tested the proposed change?"
              className="w-full bg-[#090b10] border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleSaveNote}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-bold text-xs shrink-0 cursor-pointer transition-colors"
            >
              {noteSaved ? 'Saved!' : 'Save Log'}
            </button>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};
