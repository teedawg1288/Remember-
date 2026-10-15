import React, { useState } from 'react';
import { RealityCheckResult } from '../../types/translation';
import { VisualRealitySpectrum } from '../visuals/VisualRealitySpectrum';
import {
  Scale,
  CheckCircle2,
  Eye,
  Heart,
  Brain,
  FileCheck,
  HelpCircle,
  ShieldAlert,
  Loader2,
  Sparkles,
  UserCheck,
  Copy,
  Check
} from 'lucide-react';

interface RealityScreenProps {
  initialTopic?: string;
}

export const RealityScreen: React.FC<RealityScreenProps> = ({ initialTopic = '' }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [context, setContext] = useState('');
  const [isYoungerUser, setIsYoungerUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RealityCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRunCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/reality-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          context: context.trim(),
          isYoungerUser,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to perform reality check.');
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Could not complete reality check.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `THE LAST 10% — REALITY CHECK
Topic: ${result.topic}

1. WHAT ACTUALLY HAPPENED:
${result.whatActuallyHappened.map((x) => `• ${x}`).join('\n')}

2. WHAT WAS DIRECTLY OBSERVED:
${result.whatWasDirectlyObserved.map((x) => `• ${x}`).join('\n')}

3. WHAT THE PERSON IS FEELING:
${result.whatThePersonIsFeeling.map((x) => `• ${x}`).join('\n')}

4. WHAT THE PERSON BELIEVES HAPPENED:
${result.whatThePersonBelievesHappened.map((x) => `• ${x}`).join('\n')}

5. WHAT EVIDENCE SUPPORTS:
${result.whatAvailableEvidenceSupports.map((x) => `• ${x}`).join('\n')}

6. WHAT REMAINS UNCERTAIN:
${result.whatRemainsUncertain.map((x) => `• ${x}`).join('\n')}

MISINFORMATION GUARD:
${result.misinformationGuard}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-8">
      {/* Editorial Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-6 sm:p-9 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
            <span>Screen 04</span>
            <span>·</span>
            <span>The Reality Check</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Separate Reality From Interpretation
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Feelings are real and valid, but feelings alone do not prove external events. 
            Ground your thinking by cleanly separating what happened, what was observed, 
            what is felt, and what is assumed.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
        <form onSubmit={handleRunCheck} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="realityTopic" className="block text-sm font-semibold text-slate-900">
              What situation, event, or belief do you want to evaluate?
            </label>
            <input
              id="realityTopic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 'A coworker ignored my email and I think they are trying to exclude me', 'A viral post claimed a new law passed'..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-900 placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="realityContext" className="block text-xs font-semibold text-slate-700">
              Any background or what you directly observed (optional):
            </label>
            <textarea
              id="realityContext"
              rows={2}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="What did you see, hear, or read firsthand?"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-900 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Controls: Younger learner toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
              <input
                type="checkbox"
                checked={isYoungerUser}
                onChange={(e) => setIsYoungerUser(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span>Age-appropriate mode (for younger learners / teens)</span>
            </label>

            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="min-h-[46px] px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-medium text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Separating facts & interpretations...</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  <span>Run Reality Check</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && <p className="text-xs text-rose-600 pt-1">{error}</p>}
      </div>

      {/* Reality Check Results: 6 Facets */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Interactive Visual Reality Separation Component */}
          <VisualRealitySpectrum result={result} />

          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-slate-900">
              Detailed Analytical Breakdown
            </h2>
            <button
              onClick={handleCopy}
              className="min-h-[38px] px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 flex items-center gap-1.5 font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-800">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Check</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. What Actually Happened */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>1. What actually happened</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 pl-1">
                {result.whatActuallyHappened.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. What Was Directly Observed */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <Eye className="w-4 h-4 text-teal-700 shrink-0" />
                <span>2. What was directly observed</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 pl-1">
                {result.whatWasDirectlyObserved.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold shrink-0">◎</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. What the Person is Feeling */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                <span>3. What is being felt (Validated & Acknowledged)</span>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Feelings are emotionally real; they are not proof of external intentions.
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 pl-1">
                {result.whatThePersonIsFeeling.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0">♥</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. What the Person Believes Happened */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <Brain className="w-4 h-4 text-amber-700 shrink-0" />
                <span>4. What is believed or assumed (The Story)</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 pl-1">
                {result.whatThePersonBelievesHappened.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">~</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. What Evidence Supports */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <FileCheck className="w-4 h-4 text-indigo-700 shrink-0" />
                <span>5. What available evidence actually supports</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 pl-1">
                {result.whatAvailableEvidenceSupports.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">⚖</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. What Remains Uncertain */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <HelpCircle className="w-4 h-4 text-amber-800 shrink-0" />
                <span>6. What remains uncertain</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 pl-1">
                {result.whatRemainsUncertain.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-800 font-bold shrink-0">?</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Misinformation Guard & Summary */}
          <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Misinformation & Online Narrative Guard</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {result.misinformationGuard}
            </p>

            <div className="pt-2 border-t border-slate-200 text-xs sm:text-sm text-slate-800 font-medium">
              <span className="text-slate-900 font-semibold block mb-0.5">Empowering Way Forward:</span>
              <p>{result.summaryGuidance}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
