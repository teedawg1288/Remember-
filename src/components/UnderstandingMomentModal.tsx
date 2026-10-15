import React, { useState } from 'react';
import { UnderstandingMomentFeedback } from '../types/translation';
import {
  X,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Loader2
} from 'lucide-react';

interface UnderstandingMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  unfamiliarTopic: string;
  onSavedUserNotes?: (notes: string) => void;
}

export const UnderstandingMomentModal: React.FC<UnderstandingMomentModalProps> = ({
  isOpen,
  onClose,
  unfamiliarTopic,
  onSavedUserNotes,
}) => {
  const [userExplanation, setUserExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<UnderstandingMomentFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userExplanation.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/test-understanding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unfamiliarTopic,
          userExplanation: userExplanation.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to check understanding.');
      setFeedback(data);

      if (onSavedUserNotes) {
        onSavedUserNotes(userExplanation.trim());
      }
    } catch (err: any) {
      setError(err?.message || 'Could not verify explanation right now.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-800 font-semibold">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
              <span>The Understanding Moment</span>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-slate-900">
              Put It In Your Own Words
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!feedback ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs text-slate-600 leading-relaxed">
                When you can explain a concept in your own voice, you own the knowledge. 
                How would you explain <strong>{unfamiliarTopic}</strong> to a friend in 1–2 sentences?
              </p>
              <textarea
                rows={4}
                value={userExplanation}
                onChange={(e) => setUserExplanation(e.target.value)}
                placeholder="In my own words, it works like this because..."
                className="w-full p-3.5 rounded-2xl border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-900 placeholder:text-slate-400 resize-none"
                required
              />
            </div>

            {error && <p className="text-xs text-rose-600">{error}</p>}

            <button
              type="submit"
              disabled={!userExplanation.trim() || isLoading}
              className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking core relationship...</span>
                </>
              ) : (
                <>
                  <span>Check My Explanation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-5 animate-fadeIn">
            {/* Assessment card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>What you nailed down accurately:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {feedback.reflectionAssessment.whatIsSpotOn}
              </p>

              {feedback.reflectionAssessment.whatWasOverlookedOrMissing && (
                <div className="pt-2 border-t border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>A subtle nuance to keep in mind:</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feedback.reflectionAssessment.whatWasOverlookedOrMissing}
                  </p>
                </div>
              )}

              <p className="text-[11px] text-teal-800 font-medium pt-1">
                {feedback.reflectionAssessment.encouragement}
              </p>
            </div>

            {/* Everyday Application */}
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-amber-950 uppercase tracking-wider font-mono text-[11px]">
                <Lightbulb className="w-3.5 h-3.5 text-amber-800" />
                <span>Application in Real Life</span>
              </div>
              <div className="font-semibold text-slate-900 text-sm">
                {feedback.everydayApplication.title}
              </div>
              <p className="text-slate-700 leading-relaxed">
                {feedback.everydayApplication.scenario}
              </p>
              <div className="pt-2 text-amber-950 font-medium border-t border-amber-200/80">
                Actionable takeaway: {feedback.everydayApplication.actionableInsight}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
