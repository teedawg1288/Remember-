import React, { useState } from 'react';
import {
  AutonomousDiscoveryJob,
  SavedJourneyItem,
} from '../types/translation';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scale,
  MessageSquare,
  Eye,
  Bookmark,
  Trash2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  HelpCircle,
  Activity,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface AutonomousDiscoveryCardProps {
  job: AutonomousDiscoveryJob;
  onOpenInTalk: (item: SavedJourneyItem) => void;
  onOpenInShowMe: (item: SavedJourneyItem) => void;
  onSaveToDiscoveries: (job: AutonomousDiscoveryJob) => void;
  onDismiss: (id: string) => void;
  onApprove?: (id: string) => void;
  isSaved?: boolean;
}

export const AutonomousDiscoveryCard: React.FC<AutonomousDiscoveryCardProps> = ({
  job,
  onOpenInTalk,
  onOpenInShowMe,
  onSaveToDiscoveries,
  onDismiss,
  onApprove,
  isSaved = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedLocal, setSavedLocal] = useState(isSaved || job.isSavedToDiscoveries);

  // Convert job into a navigable SavedJourneyItem for Let's Talk / Show Me
  const buildJourneyItem = (): SavedJourneyItem => {
    return {
      id: `auto-${job.id}`,
      topic: job.title,
      domain: `${job.primaryFieldA} & ${job.primaryFieldB}`,
      headline: job.plainEnglishSummary,
      savedAt: new Date(job.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      userNotes: `Autonomous Discovery: "${job.conversationalHeadline}"\n\nUnasked Question: ${job.unaskedQuestionDiscovered}\n\nComputational Verdict: ${job.calculationVerdict}`,
      autonomousJob: job,
      translation: {
        id: `trans-${job.id}`,
        unfamiliarTopic: job.title,
        familiarDomain: job.primaryFieldB,
        headlineSummary: job.plainEnglishSummary,
        simplicityLevel: 'standard',
        frameworkFlow: {
          reality: job.sharedMechanism,
          observation: job.unansweredQuestion,
          translation: job.plainEnglishSummary,
          understanding: job.unaskedQuestionDiscovered,
          action: job.evidenceSeparation.realWorldValidationStatus,
        },
        visualExploration: {
          visualType: 'dual_scene_comparison',
          systemAName: job.primaryFieldA,
          systemBName: job.primaryFieldB,
          steps: [
            {
              stepNumber: 1,
              title: 'Field Baseline & Established Laws',
              unfamiliarScene: job.expandingFields[0]?.knownContribution || 'Observed dynamics in Field A',
              familiarScene: job.expandingFields[1]?.knownContribution || 'Observed dynamics in Field B',
              connectionPoint: job.sharedMechanism,
              boundaryWarning: job.conditionsWhereItFails[0] || 'Diverges outside specified conditions',
            },
            {
              stepNumber: 2,
              title: 'The Question Nobody Thought to Ask',
              unfamiliarScene: job.contradictionOrClash,
              familiarScene: job.unaskedQuestionDiscovered,
              connectionPoint: job.sharedMechanism,
              boundaryWarning: 'Requires checking actual numerical boundaries',
            },
            {
              stepNumber: 3,
              title: 'Computational Test & Verdict',
              unfamiliarScene: `${job.computationalTest.formulaOrLaw}: ${job.computationalTest.variableA}`,
              familiarScene: job.computationalTest.calculatedCorrelation,
              connectionPoint: job.computationalTest.interpretation,
              boundaryWarning: job.evidenceSeparation.realWorldValidationStatus,
            },
          ],
          interactivePrompts: [
            `How does ${job.unaskedQuestionDiscovered} shift how we approach this problem?`,
            `What happens if system capacity drops below the threshold?`,
          ],
        },
        section1Connects: {
          summary: job.sharedMechanism,
          narrative: job.plainEnglishSummary,
          realLifeExamples: job.conditionsWhereItWorks,
          mappings: [
            {
              familiarElement: job.primaryFieldB,
              unfamiliarElement: job.primaryFieldA,
              underlyingDynamic: job.sharedMechanism,
              explanation: job.conditionsWhereItWorks[0] || 'Everyday operational balance',
            },
          ],
        },
        section2Differences: {
          summary: job.contradictionOrClash,
          breakdowns: [
            {
              aspect: 'Operational Limits',
              whereComparisonWorks: job.conditionsWhereItWorks.join('; '),
              whereItFails: job.conditionsWhereItFails.join('; '),
              riskOfAssumingIdentical: job.contradictionOrClash,
            },
          ],
        },
        section3Missing: {
          establishedFacts: job.evidenceSeparation.empiricallyDocumented,
          assumptionsAndInterpretations: job.evidenceSeparation.newlyGeneratedHypothesis,
          missingInformation: [job.evidenceSeparation.realWorldValidationStatus],
          overlookedConnections: [job.contradictionOrClash],
          questionsToAsk: [job.unaskedQuestionDiscovered],
          howToResolveUncertainty: job.evidenceSeparation.computationalResult,
        },
        section4NextSteps: {
          summary: job.evidenceSeparation.realWorldValidationStatus,
          practicalSteps: job.conditionsWhereItWorks,
          verificationMethods: job.evidenceSeparation.computationalResult,
          cautionaryLimitations: job.conditionsWhereItFails.join(', '),
        },
        bidirectionalInsights: {
          familiarToUnfamiliar: job.plainEnglishSummary,
          unfamiliarToFamiliar: job.unaskedQuestionDiscovered,
        },
      },
    };
  };

  const getHeadlineBadgeStyle = () => {
    const h = job.conversationalHeadline;
    if (h.includes("These two fields might have the answer")) {
      return {
        bg: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
        dot: 'bg-teal-400',
      };
    }
    if (h.includes("didn't hold up") || job.calculationVerdict === 'divergent_or_failed') {
      return {
        bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        dot: 'bg-amber-400',
      };
    }
    if (h.includes('needs a real-world experiment')) {
      return {
        bg: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
        dot: 'bg-sky-400',
      };
    }
    return {
      bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
      dot: 'bg-emerald-400',
    };
  };

  const badge = getHeadlineBadgeStyle();
  const isRequiresApproval = job.status === 'requires_approval';

  const handleSaveClick = () => {
    setSavedLocal(!savedLocal);
    onSaveToDiscoveries(job);
  };

  return (
    <div
      className={`rounded-3xl border transition-all duration-200 overflow-hidden shadow-xl ${
        isRequiresApproval
          ? 'bg-amber-950/20 border-amber-800/60 hover:border-amber-700'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700/80'
      }`}
    >
      {/* Top Header Bar */}
      <div className="p-5 sm:p-6 pb-4 border-b border-slate-800/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Conversational Opener Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${badge.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
            <span className="font-sans italic">&ldquo;{job.conversationalHeadline}&rdquo;</span>
          </div>

          {/* Verdict / Status Flag */}
          <div className="flex items-center gap-2">
            {job.calculationVerdict === 'mathematically_supported' ? (
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Survived Math Simulation
              </span>
            ) : (
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60 font-semibold flex items-center gap-1">
                <Scale className="w-3 h-3 text-amber-400" />
                Refuted Metaphor
              </span>
            )}

            {job.isDeepInvestigation && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800/60 uppercase">
                Deep Expansion
              </span>
            )}
          </div>
        </div>

        {/* Title & Core Unanswered Question */}
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
            {job.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 flex items-start gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
            <span>
              <strong>Unanswered Question:</strong> {job.unansweredQuestion}
            </span>
          </p>
        </div>

        {/* Plain English Summary */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed">
          {job.plainEnglishSummary}
        </div>
      </div>

      {/* Deep Investigation Approval Gate (if pending) */}
      {isRequiresApproval && onApprove && (
        <div className="p-5 bg-amber-950/40 border-b border-amber-800/60 text-xs text-amber-200 space-y-3">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-white">
                Deep Recursive Investigation Ready for Approval
              </p>
              <p className="text-amber-300/90 leading-relaxed">
                This investigation brings together 3+ interdisciplinary fields and will run deep computational simulations (~{job.estimatedTokens} tokens). To control costs and prevent uncontrolled background spending, it requires your explicit sign-off.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onApprove(job.id)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
            >
              <span>Approve Deep Investigation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDismiss(job.id)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* The Expanding Round Table Grid */}
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-teal-400 font-bold mb-2.5">
            <Layers className="w-3.5 h-3.5" />
            <span>The Expanding Round Table: What Each Field Understood</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {job.expandingFields.map((field, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                  field.isExpandingField
                    ? 'bg-purple-950/20 border-purple-800/50 text-purple-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[13px]">{field.fieldName}</span>
                  {field.isExpandingField && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-purple-900/60 text-purple-300 font-semibold">
                      Auxiliary Field
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-[11px] leading-relaxed">
                  <p>
                    <strong className="text-teal-300">Empirically Knows:</strong>{' '}
                    {field.knownContribution}
                  </p>
                  <p>
                    <strong className="text-amber-300">Missing Limit:</strong>{' '}
                    {field.limitOrMissingPiece}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Question Nobody Thought to Ask */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/40 via-sky-950/30 to-purple-950/40 border border-teal-500/30 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase font-mono">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>The Question Nobody Thought to Ask</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-white italic leading-relaxed">
            &ldquo;{job.unaskedQuestionDiscovered}&rdquo;
          </p>
        </div>

        {/* Toggle Details / Math & Contradiction Section */}
        <div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2 font-mono">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>Computational Calculations, Falsification Tests & Evidence</span>
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs animate-fadeIn">
              {/* Contradiction & Clash */}
              <div className="space-y-1">
                <span className="font-bold text-amber-300 uppercase font-mono text-[11px] block">
                  Why Accepted Explanations Clashed
                </span>
                <p className="text-slate-300 leading-relaxed">{job.contradictionOrClash}</p>
              </div>

              {/* Genuine Computational Evaluation */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-400 font-mono text-[11px] uppercase flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    Computational Test: {job.computationalTest.formulaOrLaw}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <p>
                    <strong className="text-slate-400">Parameter A:</strong>{' '}
                    {job.computationalTest.variableA}
                  </p>
                  <p>
                    <strong className="text-slate-400">Parameter B:</strong>{' '}
                    {job.computationalTest.variableB}
                  </p>
                </div>
                <p className="text-[11px] text-teal-200 bg-teal-950/40 p-2.5 rounded-lg border border-teal-800/40 font-mono">
                  {job.computationalTest.calculatedCorrelation}
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  {job.computationalTest.interpretation}
                </p>
              </div>

              {/* Conditions Where It Works vs Fails */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
                  <strong className="text-emerald-300 font-mono uppercase block">
                    Conditions Where It Holds
                  </strong>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {job.conditionsWhereItWorks.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                  <strong className="text-rose-300 font-mono uppercase block">
                    Conditions Where It Fails / Breaks
                  </strong>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {job.conditionsWhereItFails.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Rigorous Evidence Separation */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px]">
                <span className="font-bold text-slate-300 uppercase font-mono block">
                  Rigorous Evidence Separation (Anti-Hallucination Audit)
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2 text-slate-300">
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-mono font-bold text-[10px] shrink-0">
                      DOCUMENTED LAW
                    </span>
                    <span>{job.evidenceSeparation.empiricallyDocumented.join('; ')}</span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-300">
                    <span className="px-1.5 py-0.5 rounded-md bg-sky-950 text-sky-300 font-mono font-bold text-[10px] shrink-0">
                      NEW HYPOTHESIS
                    </span>
                    <span>{job.evidenceSeparation.newlyGeneratedHypothesis.join('; ')}</span>
                  </div>

                  <div className="flex items-start gap-2 text-amber-200/90 bg-amber-950/30 p-2 rounded-lg border border-amber-900/40">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Real-World Validation:</strong>{' '}
                      {job.evidenceSeparation.realWorldValidationStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenInTalk(buildJourneyItem())}
              className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Discuss this breakthrough in Let's Talk"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discuss in Let&apos;s Talk</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenInShowMe(buildJourneyItem())}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Inspect visually in Show Me"
            >
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>Inspect in Show Me</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveClick}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                savedLocal
                  ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                  : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={savedLocal ? 'Saved in My Discoveries' : 'Save to My Discoveries'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedLocal ? 'fill-teal-400 text-teal-400' : ''}`} />
              <span className="hidden sm:inline">{savedLocal ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={() => onDismiss(job.id)}
              className="p-2 rounded-xl bg-slate-800/70 hover:bg-rose-950/40 hover:text-rose-300 border border-slate-700/60 text-slate-400 transition-colors"
              title="Dismiss discovery"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
