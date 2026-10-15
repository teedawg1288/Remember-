import React, { useState, useEffect } from 'react';
import {
  TranslationResult,
  RelationshipMapping,
  DifferenceBreakdown,
  MissingAnalysis
} from '../types/translation';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { AudioPlayerBar } from './AudioPlayerBar';
import {
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  FileQuestion,
  ExternalLink,
  ShieldCheck,
  Layers,
  ChevronRight,
  MessageSquare,
  Play
} from 'lucide-react';

interface TranslationViewerProps {
  translation: TranslationResult;
  onSimpler: () => void;
  onStillConfused: () => void;
  onAnotherExample: () => void;
  onReverseComparison: () => void;
  onGoDeeper: () => void;
  onFocusMissing: () => void;
  onStartOver: () => void;
  isRefining: boolean;
  refiningAction: string | null;
}

export const TranslationViewer: React.FC<TranslationViewerProps> = ({
  translation,
  onSimpler,
  onStillConfused,
  onAnotherExample,
  onReverseComparison,
  onGoDeeper,
  onFocusMissing,
  onStartOver,
  isRefining,
  refiningAction,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'connects' | 'different' | 'missing' | 'next'>('all');
  const [copied, setCopied] = useState(false);
  const speech = useSpeechSynthesis();

  // Stop speech if translation changes
  useEffect(() => {
    return () => {
      speech.stop();
    };
  }, [translation.id]);

  // Construct text for full speech synthesis
  const getFullNarrationText = () => {
    return `${translation.headlineSummary}. ` +
      `Here is how it connects. ${translation.section1Connects.summary}. ${translation.section1Connects.narrative}. ` +
      `Here is what is different. ${translation.section2Differences.summary}. ` +
      `Important rule: a similarity does not mean two systems operate identically. ` +
      `What you are missing. Established facts include: ${translation.section3Missing.establishedFacts.join('. ')}. ` +
      `Key questions to ask: ${translation.section3Missing.questionsToAsk.join('. ')}. ` +
      `What you can do next. ${translation.section4NextSteps.summary}. ${translation.section4NextSteps.practicalSteps.join('. ')}`;
  };

  const handleToggleListen = () => {
    if (speech.isPlaying) {
      speech.stop();
    } else if (speech.isPaused) {
      speech.resume();
    } else {
      speech.play(getFullNarrationText());
    }
  };

  const handleListenSection = (sectionText: string) => {
    speech.play(sectionText);
  };

  // Copy full explanation to clipboard
  const handleCopy = () => {
    const text = `THE LAST 10% — TRANSLATION
Understanding: ${translation.unfamiliarTopic}
Through: ${translation.familiarDomain}

CORE INSIGHT:
${translation.headlineSummary}

1. HERE'S HOW IT CONNECTS:
${translation.section1Connects.narrative}
Key Examples:
${translation.section1Connects.realLifeExamples.map((e) => `• ${e}`).join('\n')}

2. HERE'S WHAT'S DIFFERENT:
${translation.section2Differences.summary}
${translation.section2Differences.breakdowns.map((b) => `• ${b.aspect}: Fails because "${b.whereItFails}". Warning: ${b.riskOfAssumingIdentical}`).join('\n')}

3. WHAT YOU'RE MISSING:
Established Facts:
${translation.section3Missing.establishedFacts.map((f) => `• ${f}`).join('\n')}
Missing Info:
${translation.section3Missing.missingInformation.map((m) => `• ${m}`).join('\n')}
Questions to Ask:
${translation.section3Missing.questionsToAsk.map((q) => `• ${q}`).join('\n')}

4. NEXT STEPS:
${translation.section4NextSteps.practicalSteps.map((s) => `• ${s}`).join('\n')}
${translation.section4NextSteps.cautionaryLimitations ? `\nLimitation: ${translation.section4NextSteps.cautionaryLimitations}` : ''}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner: Context & Headline */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 mb-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-900">Unfamiliar:</span>
            <span className="text-stone-700">{translation.unfamiliarTopic}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-900 font-medium">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Translated via {translation.familiarDomain}</span>
          </div>
        </div>

        {/* Breakthrough Headline & Action */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-stone-900 leading-snug tracking-tight text-balance flex-1">
            &ldquo;{translation.headlineSummary}&rdquo;
          </h2>

          <button
            onClick={handleToggleListen}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all shadow-xs active:scale-[0.98] ${
              speech.isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold ring-2 ring-amber-400/50'
                : 'bg-stone-900 hover:bg-stone-800 text-stone-50'
            }`}
          >
            {speech.isPlaying ? (
              <>
                <VolumeX className="w-4 h-4 text-stone-950 animate-pulse" />
                <span>Stop Listening</span>
              </>
            ) : speech.isPaused ? (
              <>
                <Play className="w-4 h-4 fill-current text-stone-50" />
                <span>Resume Reading</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Listen Aloud</span>
              </>
            )}
          </button>
        </div>

        {/* Embedded Audio Player Bar when speaking */}
        {(speech.isPlaying || speech.isPaused) && (
          <div className="mt-4">
            <AudioPlayerBar speech={speech} onRestart={() => speech.play(getFullNarrationText())} />
          </div>
        )}

        {/* 5-Step Framework Ribbon (Reality -> Observation -> Translation -> Understanding -> Action) */}
        <div className="mt-6 pt-6 border-t border-stone-100">
          <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-3">
            The 5-Stage Cognitive Chain
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="font-semibold text-stone-900 block mb-0.5">1. Reality</span>
              <p className="text-stone-600 line-clamp-3">{translation.frameworkFlow.reality}</p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="font-semibold text-stone-900 block mb-0.5">2. Observation</span>
              <p className="text-stone-600 line-clamp-3">{translation.frameworkFlow.observation}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
              <span className="font-semibold text-amber-950 block mb-0.5">3. Translation</span>
              <p className="text-stone-700 line-clamp-3">{translation.frameworkFlow.translation}</p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="font-semibold text-stone-900 block mb-0.5">4. Understanding</span>
              <p className="text-stone-600 line-clamp-3">{translation.frameworkFlow.understanding}</p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="font-semibold text-stone-900 block mb-0.5">5. Action</span>
              <p className="text-stone-600 line-clamp-3">{translation.frameworkFlow.action}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Action Toolbar (Working Buttons) */}
      <div className="bg-stone-100/90 rounded-2xl p-3 border border-stone-200/90 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={onSimpler}
            disabled={isRefining}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-lg bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {refiningAction === 'simpler' ? 'Simplifying...' : 'Explain it more simply'}
          </button>

          <button
            onClick={onStillConfused}
            disabled={isRefining}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-lg bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {refiningAction === 'confused' ? 'Recalibrating...' : 'I still don\'t understand'}
          </button>

          <button
            onClick={onAnotherExample}
            disabled={isRefining}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-lg bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {refiningAction === 'another_example' ? 'Finding new angle...' : 'Show me another example'}
          </button>

          <button
            onClick={onReverseComparison}
            disabled={isRefining}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-lg bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {refiningAction === 'reversed' ? 'Reversing...' : 'Reverse the comparison'}
          </button>

          <button
            onClick={() => {
              setActiveTab('missing');
              onFocusMissing();
            }}
            className="min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300/80 shadow-xs transition-all active:scale-[0.98]"
          >
            What am I missing?
          </button>

          <button
            onClick={onGoDeeper}
            disabled={isRefining}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-lg bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {refiningAction === 'deeper' ? 'Deepening...' : 'Go deeper'}
          </button>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Read aloud button */}
          <button
            onClick={handleToggleListen}
            className={`min-h-[44px] min-w-[44px] px-3 py-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
              speech.isPlaying
                ? 'bg-amber-100 border-amber-300 text-amber-950 font-semibold'
                : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200/90'
            }`}
            title={speech.isPlaying ? 'Stop listening' : 'Read explanation aloud'}
            aria-label={speech.isPlaying ? 'Stop listening' : 'Read explanation aloud'}
          >
            {speech.isPlaying ? (
              <>
                <VolumeX className="w-4 h-4 text-amber-900 animate-pulse" />
                <span className="hidden sm:inline">Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Listen</span>
              </>
            )}
          </button>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="min-h-[44px] px-3 py-2 text-xs font-medium rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/90 flex items-center gap-1.5 transition-colors"
            title="Copy entire translation"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span className="text-emerald-800 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Start Over */}
          <button
            onClick={onStartOver}
            className="min-h-[44px] px-3 py-2 text-xs font-medium rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start over</span>
          </button>
        </div>
      </div>

      {/* Section Filter Tabs (Interactive Segmented Control) */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`min-h-[40px] px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'all'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          All 4 Sections
        </button>
        <button
          onClick={() => setActiveTab('connects')}
          className={`min-h-[40px] px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'connects'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          1. Here&apos;s How It Connects
        </button>
        <button
          onClick={() => setActiveTab('different')}
          className={`min-h-[40px] px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'different'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          2. Here&apos;s What&apos;s Different
        </button>
        <button
          onClick={() => setActiveTab('missing')}
          className={`min-h-[40px] px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'missing'
              ? 'bg-amber-100 text-amber-950 shadow-xs font-semibold border border-amber-300/80'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          3. What Am I Missing?
        </button>
        <button
          onClick={() => setActiveTab('next')}
          className={`min-h-[40px] px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'next'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          4. What You Can Do Next
        </button>
      </div>

      {/* Bidirectional Insight Callout (Compare systems in BOTH directions) */}
      <div className="bg-gradient-to-br from-amber-50 to-stone-100 rounded-2xl border border-amber-200/80 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-950 uppercase tracking-wider mb-2">
          <ArrowLeftRight className="w-4 h-4 text-amber-800" />
          <span>Bidirectional Translation · Comparing Systems in Both Directions</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="bg-white/80 p-4 rounded-xl border border-amber-200/60 text-xs sm:text-sm">
            <span className="font-semibold text-stone-900 block mb-1">
              What {translation.familiarDomain} reveals about {translation.unfamiliarTopic}:
            </span>
            <p className="text-stone-700 leading-relaxed">
              {translation.bidirectionalInsights.unfamiliarToFamiliar}
            </p>
          </div>
          <div className="bg-white/80 p-4 rounded-xl border border-amber-200/60 text-xs sm:text-sm">
            <span className="font-semibold text-stone-900 block mb-1">
              What {translation.unfamiliarTopic} reveals back about {translation.familiarDomain}:
            </span>
            <p className="text-stone-700 leading-relaxed">
              {translation.bidirectionalInsights.familiarToUnfamiliar}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Here's how it connects */}
      {(activeTab === 'all' || activeTab === 'connects') && (
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-1">
              Section 01
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
              Here&apos;s How It Connects
            </h3>
            <p className="text-sm sm:text-base text-stone-600 mt-1 font-medium">
              {translation.section1Connects.summary}
            </p>
          </div>

          {/* Narrative text */}
          <div className="text-base text-stone-700 leading-relaxed space-y-4">
            <p>{translation.section1Connects.narrative}</p>
          </div>

          {/* Real-life concrete examples */}
          <div className="pt-2">
            <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-3">
              Real-Life Examples You Recognize
            </h4>
            <div className="space-y-2.5">
              {translation.section1Connects.realLifeExamples.map((ex, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-sm text-stone-800 flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed">{ex}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Element-by-Element Relationship Mappings */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-3">
              Direct System Mapping
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {translation.section1Connects.mappings.map((mapping, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-2 text-xs sm:text-sm"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                    <span className="text-stone-900 font-medium">Parallel {idx + 1}</span>
                    <span className="text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md font-mono text-[11px]">
                      {mapping.underlyingDynamic}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-stone-500 text-xs">Unfamiliar Element:</div>
                    <div className="font-semibold text-stone-900">{mapping.unfamiliarElement}</div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-stone-200/60">
                    <div className="text-stone-500 text-xs">Familiar Twin:</div>
                    <div className="font-medium text-stone-800">{mapping.familiarElement}</div>
                  </div>

                  <p className="text-xs text-stone-600 pt-1 leading-relaxed">
                    {mapping.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: Here's what's different */}
      {(activeTab === 'all' || activeTab === 'different') && (
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-1">
              Section 02
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
              Here&apos;s What&apos;s Different
            </h3>
            <p className="text-sm sm:text-base text-stone-600 mt-1 font-medium">
              {translation.section2Differences.summary}
            </p>
            <p className="text-xs text-amber-900 mt-2 font-medium">
              *Crucial Rule: A similarity does not mean two systems operate identically.
            </p>
          </div>

          <div className="space-y-4">
            {translation.section2Differences.breakdowns.map((diff, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <h4 className="font-semibold text-stone-900 text-sm sm:text-base">
                    {diff.aspect}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                    <span className="font-medium text-emerald-800 block mb-1">Where it works:</span>
                    <p className="text-stone-600">{diff.whereComparisonWorks}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                    <span className="font-medium text-amber-900 block mb-1">Where it fails:</span>
                    <p className="text-stone-600">{diff.whereItFails}</p>
                  </div>
                </div>

                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70 text-xs text-amber-950">
                  <span className="font-semibold block mb-0.5">The risk of assuming they are identical:</span>
                  <p>{diff.riskOfAssumingIdentical}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: Here's what you're missing ("What am I missing?") */}
      {(activeTab === 'all' || activeTab === 'missing') && (
        <section id="section-missing" className="bg-white rounded-3xl border-2 border-amber-300/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-1">
                Section 03 · Core Feature
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                Here&apos;s What You&apos;re Missing
              </h3>
              <p className="text-sm text-stone-600 mt-1">
                Rigorous gap discovery: separating facts from interpretations, 
                identifying invisible blind spots, and asking the right questions.
              </p>
            </div>
            <div className="shrink-0">
              <span className="text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
                Zero Guesswork Policy
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Established Facts */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>What facts are established?</span>
              </div>
              <ul className="text-xs sm:text-sm text-stone-600 space-y-2 pl-1">
                {translation.section3Missing.establishedFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-stone-400">·</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assumptions & Interpretations */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-sm">
                <FileQuestion className="w-4 h-4 text-amber-700 shrink-0" />
                <span>What is assumed or interpreted?</span>
              </div>
              <ul className="text-xs sm:text-sm text-stone-600 space-y-2 pl-1">
                {translation.section3Missing.assumptionsAndInterpretations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-stone-400">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Information */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0" />
                <span>What information is missing?</span>
              </div>
              <ul className="text-xs sm:text-sm text-stone-600 space-y-2 pl-1">
                {translation.section3Missing.missingInformation.map((info, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-stone-400">·</span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Overlooked Connections */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-sm">
                <Lightbulb className="w-4 h-4 text-amber-700 shrink-0" />
                <span>What connections might be overlooked?</span>
              </div>
              <ul className="text-xs sm:text-sm text-stone-600 space-y-2 pl-1">
                {translation.section3Missing.overlookedConnections.map((conn, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-stone-400">·</span>
                    <span>{conn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Questions to ask & How to resolve uncertainty */}
          <div className="pt-3 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="text-xs sm:text-sm font-semibold text-amber-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-800 shrink-0" />
                <span>What questions should be asked?</span>
              </div>
              <ul className="text-xs sm:text-sm text-stone-700 space-y-2 pl-1">
                {translation.section3Missing.questionsToAsk.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-800 font-bold">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="text-xs sm:text-sm font-semibold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>What could help resolve uncertainty?</span>
              </div>
              <ul className="text-xs sm:text-sm text-stone-600 space-y-2 pl-1">
                {translation.section3Missing.howToResolveUncertainty.map((res, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-stone-400">✓</span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: Here's what you can do next */}
      {(activeTab === 'all' || activeTab === 'next') && (
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-1">
              Section 04
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
              Here&apos;s What You Can Do Next
            </h3>
            <p className="text-sm sm:text-base text-stone-600 mt-1 font-medium">
              {translation.section4NextSteps.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Practical steps */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                Practical Real-World Actions
              </h4>
              <ul className="text-xs sm:text-sm text-stone-700 space-y-2">
                {translation.section4NextSteps.practicalSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verification methods */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                How to Independently Verify
              </h4>
              <ul className="text-xs sm:text-sm text-stone-700 space-y-2">
                {translation.section4NextSteps.verificationMethods.map((v, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold shrink-0">→</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cautionary limitations if applicable */}
          {translation.section4NextSteps.cautionaryLimitations && (
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-1">
              <span className="font-semibold text-stone-800 block">
                Standard Subject Limitation:
              </span>
              <p>{translation.section4NextSteps.cautionaryLimitations}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
