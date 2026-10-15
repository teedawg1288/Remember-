import React, { useState } from 'react';
import {
  UnderstandingMomentFeedback,
  PracticalOutsideAction,
} from '../types/translation';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Send,
  Loader2,
  RotateCw,
  BookmarkCheck,
  Bookmark,
  Check,
  ShieldCheck,
  Sliders,
} from 'lucide-react';

interface UnderstandingCheckInlineProps {
  unfamiliarTopic: string;
  currentDomain: string;
  onAdaptToPhysicalAnalogy: (reason: string, preferredDomain?: string) => Promise<void>;
  onSavePracticalAction?: (action: PracticalOutsideAction, userNotes: string) => void;
  onUnderstandingEvaluated?: (feedback: UnderstandingMomentFeedback, userExplanation: string) => void;
  isAdapting?: boolean;
}

export const UnderstandingCheckInline: React.FC<UnderstandingCheckInlineProps> = ({
  unfamiliarTopic,
  currentDomain,
  onAdaptToPhysicalAnalogy,
  onSavePracticalAction,
  onUnderstandingEvaluated,
  isAdapting = false,
}) => {
  const [explanationText, setExplanationText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<UnderstandingMomentFeedback | null>(null);
  const [practicalAction, setPracticalAction] = useState<PracticalOutsideAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActionSaved, setIsActionSaved] = useState(false);
  const [actionDone, setActionDone] = useState(false);

  const handleSubmitExplanation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanationText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/test-understanding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unfamiliarTopic,
          userExplanation: explanationText.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not evaluate your explanation.');
      }

      setFeedback(data);
      if (data.practicalOutsideAction) {
        setPracticalAction(data.practicalOutsideAction);
      } else if (data.everydayApplication) {
        setPracticalAction({
          title: data.everydayApplication.title,
          description: data.everydayApplication.scenario,
          verificationStep: data.everydayApplication.actionableInsight,
        });
      }
      if (onUnderstandingEvaluated) {
        onUnderstandingEvaluated(data, explanationText.trim());
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Unable to check understanding right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAction = () => {
    if (!practicalAction || !onSavePracticalAction) return;
    onSavePracticalAction(
      practicalAction,
      explanationText ? `My understanding: "${explanationText}"` : ''
    );
    setIsActionSaved(true);
  };

  return (
    <section className="bg-slate-850/95 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 mt-8">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono tracking-wider text-teal-400 uppercase mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Comprehension Check</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white">
            Demonstrate Understanding in Your Own Words
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Real understanding means being able to translate a concept without repeating jargon. How would you explain <span className="text-slate-200 font-medium">&ldquo;{unfamiliarTopic}&rdquo;</span> to a friend using an everyday situation?
          </p>
        </div>

        {/* Quick button for when the user is confused */}
        <button
          onClick={() =>
            onAdaptToPhysicalAnalogy(
              'The previous analogy did not click. I need a more tangible everyday mechanical demonstration.'
            )
          }
          disabled={isAdapting}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-all flex items-center gap-2 text-xs font-medium shrink-0 self-start sm:self-auto"
        >
          {isAdapting ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          ) : (
            <RotateCw className="w-4 h-4 text-amber-400" />
          )}
          <span>I don&apos;t get it — change comparison</span>
        </button>
      </div>

      {/* Submission Form */}
      {!feedback ? (
        <form onSubmit={handleSubmitExplanation} className="space-y-4">
          <div>
            <label
              htmlFor="own-words-input"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Your summary or analogy:
            </label>
            <textarea
              id="own-words-input"
              rows={3}
              value={explanationText}
              onChange={(e) => setExplanationText(e.target.value)}
              placeholder={`e.g., "It's basically like when a workshop air compressor builds up too much pressure and a relief valve pops open..."`}
              className="w-full bg-slate-900 border border-slate-750 focus:border-teal-500 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-800/80">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-500">
              No grades or judgment. Checks if the underlying relationship holds true.
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !explanationText.trim()}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs sm:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Concept...</span>
                </>
              ) : (
                <>
                  <span>Check My Understanding</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Evaluation Results */
        <div className="space-y-5 animate-fadeIn">
          {/* Assessment Banner */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border ${
              feedback.reflectionAssessment.isAccurate
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-amber-950/30 border-amber-500/40'
            }`}
          >
            <div className="flex items-start gap-3">
              {feedback.reflectionAssessment.isAccurate ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white text-base">
                    {feedback.reflectionAssessment.isAccurate
                      ? 'Essential Concept Recognized!'
                      : 'Close, But There Is an Important Distinction'}
                  </h4>
                  <button
                    onClick={() => {
                      setFeedback(null);
                      setExplanationText('');
                    }}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Try Another Explanation
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <span className="font-medium text-teal-300">What is spot-on: </span>
                  {feedback.reflectionAssessment.whatIsSpotOn}
                </div>

                {feedback.reflectionAssessment.whatWasOverlookedOrMissing && (
                  <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed bg-amber-900/20 p-2.5 rounded-xl border border-amber-800/40">
                    <span className="font-medium text-amber-300">Keep in mind: </span>
                    {feedback.reflectionAssessment.whatWasOverlookedOrMissing}
                  </div>
                )}

                <p className="text-xs text-slate-400 italic pt-1">
                  &ldquo;{feedback.reflectionAssessment.encouragement}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* If not accurate: direct button to change physical comparison */}
          {!feedback.reflectionAssessment.isAccurate && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white block text-sm">Want a different visual angle?</span>
                Let&apos;s switch from this metaphor to a tactile physical mechanism (e.g. car hydraulic brakes or water piping valves).
              </div>
              <button
                onClick={() =>
                  onAdaptToPhysicalAnalogy(
                    'I want to see this as a physical hydraulic or mechanical system instead of the current model.'
                  )
                }
                disabled={isAdapting}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs transition-colors shrink-0 flex items-center justify-center gap-2"
              >
                {isAdapting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sliders className="w-4 h-4" />
                )}
                <span>Switch to Physical Analogy</span>
              </button>
            </div>
          )}

          {/* ONE PRACTICAL WAY TO APPLY WHAT YOU'VE LEARNED OUTSIDE THE APP */}
          {practicalAction && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-teal-500/30 space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider block">
                      Outside-App Application
                    </span>
                    <h5 className="font-serif text-base sm:text-lg font-semibold text-white">
                      {practicalAction.title}
                    </h5>
                  </div>
                </div>

                {onSavePracticalAction && (
                  <button
                    onClick={handleSaveAction}
                    disabled={isActionSaved}
                    className={`min-h-[38px] px-3 py-1.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 ${
                      isActionSaved
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {isActionSaved ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Saved to Journey</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save Action</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                <p>{practicalAction.description}</p>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-teal-200">
                  <span className="font-semibold text-white block mb-0.5">How to verify it worked:</span>
                  {practicalAction.verificationStep}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setActionDone(!actionDone)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                    actionDone
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${actionDone ? 'stroke-[3]' : ''}`} />
                  <span>{actionDone ? 'Practiced in Real Life!' : 'Mark as Ready to Practice'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
