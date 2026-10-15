import React, { useState } from 'react';
import { TranslationResult, MissingAnalysis } from '../../types/translation';
import {
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  Split,
  Compass
} from 'lucide-react';

interface UncoverScreenProps {
  currentTranslation: TranslationResult | null;
  initialTopic?: string;
  onNavigateToDiscover: () => void;
  onNavigateToMissingEngine?: (topic: string) => void;
}

export const UncoverScreen: React.FC<UncoverScreenProps> = ({
  currentTranslation,
  initialTopic = '',
  onNavigateToDiscover,
  onNavigateToMissingEngine,
}) => {
  const [customInquiry, setCustomInquiry] = useState(initialTopic || '');
  const [customAnalysis, setCustomAnalysis] = useState<MissingAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialTopic && !customInquiry && !currentTranslation) {
      setCustomInquiry(initialTopic);
    }
  }, [initialTopic, currentTranslation]);

  const activeData: MissingAnalysis | null = customAnalysis || currentTranslation?.section3Missing || null;
  const activeTopic = customInquiry || currentTranslation?.unfamiliarTopic || initialTopic || 'Your current inquiry';

  const handleRunUncover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInquiry.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unfamiliarTopic: customInquiry.trim(),
          mode: 'standard',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze missing information.');

      setCustomAnalysis(data.section3Missing);
    } catch (err: any) {
      setError(err?.message || 'Could not uncover gaps right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!activeData) return;
    const text = `THE LAST 10% — WHAT AM I MISSING?
Topic: ${activeTopic}

ESTABLISHED FACTS:
${activeData.establishedFacts.map((f) => `• ${f}`).join('\n')}

MISSING INFORMATION:
${activeData.missingInformation.map((m) => `• ${m}`).join('\n')}

OVERLOOKED CONNECTIONS:
${activeData.overlookedConnections.map((c) => `• ${c}`).join('\n')}

QUESTIONS TO ASK:
${activeData.questionsToAsk.map((q) => `• ${q}`).join('\n')}

HOW TO RESOLVE UNCERTAINTY:
${activeData.howToResolveUncertainty.map((u) => `• ${u}`).join('\n')}
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
            <span>Screen 03</span>
            <span>·</span>
            <span>Cognitive Gap Discovery</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            What Am I Missing?
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Discover the invisible blind spots, unanswered questions, and competing explanations. 
            We strictly separate established evidence from assumptions so you can think for yourself.
          </p>
        </div>
      </div>

      {/* Inquiry or Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <form onSubmit={handleRunUncover} className="space-y-3">
          <label
            htmlFor="uncoverInput"
            className="block text-sm font-semibold text-slate-900"
          >
            Investigate blind spots for a specific subject:
          </label>
          <div className="flex gap-2">
            <input
              id="uncoverInput"
              type="text"
              value={customInquiry}
              onChange={(e) => setCustomInquiry(e.target.value)}
              placeholder={currentTranslation ? `Currently viewing: ${currentTranslation.unfamiliarTopic}` : 'e.g. Buying a used hybrid car, commercial lease terms, medical test results...'}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 text-sm placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!customInquiry.trim() || isLoading}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-medium text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Uncover</span>}
            </button>
          </div>
        </form>

        {error && <p className="text-xs text-rose-600">{error}</p>}
      </div>

      {/* Results View */}
      {activeData ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Card Top Actions */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 font-semibold uppercase tracking-wider">
              Analysis for: &ldquo;{activeTopic}&rdquo;
            </span>

            <button
              onClick={handleCopy}
              className="min-h-[40px] px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 flex items-center gap-1.5 font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-800">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Gaps</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Established Facts */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>What facts are established?</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 pl-1">
                {activeData.establishedFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Assumptions & Interpretations */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <Split className="w-4 h-4 text-amber-700 shrink-0" />
                <span>What is assumed or interpreted?</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 pl-1">
                {activeData.assumptionsAndInterpretations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-700 font-bold shrink-0">~</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Missing Information */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>What essential information is absent?</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 pl-1">
                {activeData.missingInformation.map((info, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-rose-600 font-bold shrink-0">!</span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Overlooked Connections */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <Lightbulb className="w-4 h-4 text-teal-700 shrink-0" />
                <span>What connections were overlooked?</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 pl-1">
                {activeData.overlookedConnections.map((conn, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-teal-700 font-bold shrink-0">★</span>
                    <span>{conn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Questions to Ask & Resolving Uncertainty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/90 space-y-3">
              <div className="text-sm font-semibold text-amber-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Questions you should ask next:</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-800 space-y-2 pl-1">
                {activeData.questionsToAsk.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-900 font-mono font-bold">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-teal-50/70 border border-teal-200/90 space-y-3">
              <div className="text-sm font-semibold text-teal-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-800 shrink-0" />
                <span>What will resolve the uncertainty:</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-800 space-y-2 pl-1">
                {activeData.howToResolveUncertainty.map((res, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-800 font-bold">→</span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Question Engine Bridge */}
            {onNavigateToMissingEngine && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-teal-950/40 border border-teal-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-100 shadow-md">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-teal-400" />
                    <span>Expand into the Missing Question Engine</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-white">
                    Convene the Round Table &amp; Map Causal Mechanisms
                  </h4>
                  <p className="text-xs text-slate-300">
                    Discover high-impact questions that nobody is asking and separate mechanisms from patterns.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToMissingEngine(activeTopic)}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <span>Launch Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Compass className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-slate-800">
            No Active Topic Selected
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Choose a subject on the Discover screen or enter any topic above to reveal the information gaps.
          </p>
          <button
            onClick={onNavigateToDiscover}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            Go to Discover
          </button>
        </div>
      )}
    </div>
  );
};
