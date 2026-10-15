import React, { useState } from 'react';
import { GetUnstuckResult } from '../../types/translation';
import { VisualUnstuckJourney } from '../visuals/VisualUnstuckJourney';
import {
  Footprints,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCw,
  Compass,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Target,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface MoveForwardScreenProps {
  initialSituation?: string;
  onNavigateToDiscover: () => void;
}

export const MoveForwardScreen: React.FC<MoveForwardScreenProps> = ({
  initialSituation = '',
  onNavigateToDiscover,
}) => {
  const [situation, setSituation] = useState(initialSituation);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GetUnstuckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetUnstuck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/get-unstuck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: situation.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze sticking point.');
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Could not process request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-6 sm:p-9 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
            <span>Screen 05</span>
            <span>·</span>
            <span>Get Unstuck</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Stop Going In Circles & Move Forward
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            The app does not exist to keep you talking to an AI. When overthinking sets in, 
            we clarify what you control, what you can do right now, and when it is best to step away.
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <form onSubmit={handleGetUnstuck} className="space-y-4">
          <label htmlFor="unstuckInput" className="block text-sm font-semibold text-slate-900">
            Where are you feeling stuck or going in circles?
          </label>
          <textarea
            id="unstuckInput"
            rows={3}
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="Describe the decision, paralysis, conflict, or question you can't seem to resolve..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 text-sm placeholder:text-slate-400 resize-none"
            required
          />

          <button
            type="submit"
            disabled={!situation.trim() || isLoading}
            className="min-h-[48px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-medium text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Finding clear agency & next steps...</span>
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                <span>Get Unstuck</span>
              </>
            )}
          </button>
        </form>

        {error && <p className="text-xs text-rose-600">{error}</p>}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Interactive Visual Next-Step Agency Journey */}
          <VisualUnstuckJourney result={result} />

          {/* Loop Detector Banner if repetitive */}
          {result.isRepetitiveLoopDetected && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3">
              <RotateCw className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm">
                <span className="font-semibold block text-amber-900">
                  Repetitive Loop Detected
                </span>
                <p>
                  You are spinning on this topic without new inputs. AI cannot resolve what requires 
                  real-world evidence or personal acceptance. Choose one of the 3 pathways below to break the loop:
                </p>
              </div>
            </div>
          )}

          {/* ONE Immediate High-Leverage Step */}
          <div className="p-6 sm:p-8 rounded-3xl bg-teal-900 text-white space-y-4 shadow-lg border border-teal-800">
            <div className="text-xs uppercase tracking-wider font-mono text-teal-300 font-semibold">
              The Primary Way Forward
            </div>
            <h3 className="font-serif text-2xl font-semibold text-white">
              One Reasonable Next Step
            </h3>
            <p className="text-base text-teal-50 font-medium leading-relaxed bg-white/10 p-4 rounded-2xl border border-white/10">
              {result.oneReasonableNextStep}
            </p>

            <div className="pt-2 text-xs sm:text-sm text-teal-200">
              <span className="font-semibold text-white block mb-0.5">How to evaluate whether this worked:</span>
              <p>{result.howToEvaluateOutcome}</p>
            </div>
          </div>

          {/* Control vs Outside Control Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Within Control */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>What you can actually control</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2 pl-1">
                {result.whatUserCanControl.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outside Control */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span>What is outside your control</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-500 space-y-2 pl-1">
                {result.whatUserCannotControl.map((uc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">✕</span>
                    <span>{uc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Friction & Missing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-mono font-semibold">
                What is preventing progress
              </h4>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5">
                {result.whatsPreventingProgress.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-400">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-mono font-semibold">
                Targeted information still needed
              </h4>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5">
                {result.whatInformationIsStillNeeded.map((n, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-400">·</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Three Constructive Loop-Break Pathways */}
          <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-slate-900">
              Three Paths Forward (Anti-Loop Guarantee)
            </h3>
            <p className="text-xs text-slate-600">
              Instead of endless back-and-forth, choose one of these clear decisions:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Path 1 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                <span className="font-mono text-teal-800 font-bold uppercase tracking-wider text-[10px]">
                  Path 1 · Investigate Fresh Angle
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {result.loopBreakChoices.choice1Investigate}
                </p>
              </div>

              {/* Path 2 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                <span className="font-mono text-amber-800 font-bold uppercase tracking-wider text-[10px]">
                  Path 2 · Real-World Action
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {result.loopBreakChoices.choice2Action}
                </p>
              </div>

              {/* Path 3 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                <span className="font-mono text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  Path 3 · Live Beyond The Screen
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {result.loopBreakChoices.choice3LeaveUnresolved}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
