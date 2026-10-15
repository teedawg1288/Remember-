import React, { useState } from 'react';
import {
  TranslationResult,
  PracticalOutsideAction,
  UnderstandingMomentFeedback,
} from '../../types/translation';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { AudioPlayerBar } from '../AudioPlayerBar';
import { RelationshipVisual } from '../RelationshipVisual';
import { VisualCourtMechanic } from '../visuals/VisualCourtMechanic';
import { VisualBatterySystem } from '../visuals/VisualBatterySystem';
import { VisualInformationNetwork } from '../visuals/VisualInformationNetwork';
import { VisualExplanationEngine } from '../visuals/VisualExplanationEngine';
import { UnderstandingCheckInline } from '../UnderstandingCheckInline';
import {
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Bookmark,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Compass,
  Layers,
  ChevronDown,
  ChevronUp,
  Play,
  HeartHandshake
} from 'lucide-react';

interface UnderstandScreenProps {
  translation: TranslationResult;
  onSimpler: () => void;
  onStillConfused: () => void;
  onAnotherExample: () => void;
  onReverseComparison: () => void;
  onGoDeeper: () => void;
  onConnectCustomDomain: () => void;
  onTriggerUnderstandingMoment: () => void;
  onSaveToJourney: () => void;
  onAdaptToPhysicalAnalogy?: (reason: string, preferredDomain?: string) => Promise<void>;
  onSavePracticalAction?: (action: PracticalOutsideAction, userNotes: string) => void;
  onUnderstandingEvaluated?: (feedback: UnderstandingMomentFeedback, userExplanation: string) => void;
  onNavigateToMissingEngine?: (topic: string) => void;
  isSaved: boolean;
  isRefining: boolean;
  refiningAction: string | null;
}

export const UnderstandScreen: React.FC<UnderstandScreenProps> = ({
  translation,
  onSimpler,
  onStillConfused,
  onAnotherExample,
  onReverseComparison,
  onGoDeeper,
  onConnectCustomDomain,
  onTriggerUnderstandingMoment,
  onSaveToJourney,
  onAdaptToPhysicalAnalogy,
  onSavePracticalAction,
  onUnderstandingEvaluated,
  onNavigateToMissingEngine,
  isSaved,
  isRefining,
  refiningAction,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedMapping, setExpandedMapping] = useState<number | null>(0);
  const speech = useSpeechSynthesis();

  const getFullNarrationText = () => {
    return `${translation.headlineSummary}. ` +
      `Here is how it connects: ${translation.section1Connects.summary}. ${translation.section1Connects.narrative}. ` +
      `Here is what is different: ${translation.section2Differences.summary}. ` +
      `Remember, a similarity does not mean two systems operate identically. ` +
      `What you can do next: ${translation.section4NextSteps.summary}. ${translation.section4NextSteps.practicalSteps.join('. ')}`;
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

  const handleCopy = () => {
    const text = `THE LAST 10% — UNDERSTANDING
Subject: ${translation.unfamiliarTopic}
Through: ${translation.familiarDomain}

CORE INSIGHT:
${translation.headlineSummary}

HOW IT CONNECTS:
${translation.section1Connects.narrative}

EXAMPLES:
${translation.section1Connects.realLifeExamples.map((e) => `• ${e}`).join('\n')}

WHERE THE COMPARISON STOPS:
${translation.section2Differences.summary}
${translation.section2Differences.breakdowns.map((b) => `• ${b.aspect}: ${b.whereItFails}`).join('\n')}

NEXT STEPS:
${translation.section4NextSteps.practicalSteps.map((s) => `• ${s}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-8">
      {/* Top Narrative Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Unfamiliar Subject:</span>
            <span className="text-slate-700 truncate max-w-xs">{translation.unfamiliarTopic}</span>
          </div>
          <div className="flex items-center gap-1.5 text-teal-800 font-medium">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Translated through {translation.familiarDomain}</span>
          </div>
        </div>

        {/* Headline Insight & Primary Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 leading-snug tracking-tight text-balance flex-1">
            &ldquo;{translation.headlineSummary}&rdquo;
          </h1>

          <div className="flex items-center gap-2 shrink-0">
            {/* Listen button */}
            <button
              onClick={handleToggleListen}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs active:scale-[0.98] ${
                speech.isPlaying
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold ring-2 ring-amber-400/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-50'
              }`}
            >
              {speech.isPlaying ? (
                <>
                  <VolumeX className="w-4 h-4 animate-pulse" />
                  <span>Stop Listening</span>
                </>
              ) : speech.isPaused ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Aloud</span>
                </>
              )}
            </button>

            {/* Save to Journey button */}
            <button
              onClick={onSaveToJourney}
              className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
              title="Save to My Journey"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Audio Player Bar when speaking */}
        {(speech.isPlaying || speech.isPaused) && (
          <AudioPlayerBar speech={speech} onRestart={() => speech.play(getFullNarrationText())} />
        )}

        {/* Narrative Prose */}
        <div className="text-base text-slate-700 leading-relaxed pt-2 space-y-4">
          <p>{translation.section1Connects.narrative}</p>
        </div>
      </div>

      {/* Tailored Visual Learning Engine */}
      {(() => {
        const topicLower = translation.unfamiliarTopic.toLowerCase();
        const domainLower = translation.familiarDomain.toLowerCase();

        // Example A: Court / Trial / Legal vs Car mechanic
        if (
          topicLower.includes('court') ||
          topicLower.includes('trial') ||
          topicLower.includes('legal') ||
          domainLower.includes('car') ||
          domainLower.includes('mechanic')
        ) {
          return <VisualCourtMechanic />;
        }

        // Example B: Battery / Electronics / Charging
        if (
          topicLower.includes('battery') ||
          topicLower.includes('lithium') ||
          topicLower.includes('charge') ||
          topicLower.includes('voltage') ||
          domainLower.includes('plumbing') ||
          domainLower.includes('water tank')
        ) {
          return <VisualBatterySystem />;
        }

        // Example C: Rumour / Viral info / Misinformation
        if (
          topicLower.includes('rumour') ||
          topicLower.includes('rumor') ||
          topicLower.includes('misinformation') ||
          topicLower.includes('information') ||
          topicLower.includes('viral') ||
          topicLower.includes('news')
        ) {
          return <VisualInformationNetwork />;
        }

        // Dynamic visual engine for all other queries
        return (
          <VisualExplanationEngine
            unfamiliarTopic={translation.unfamiliarTopic}
            familiarDomain={translation.familiarDomain}
            exploration={translation.visualExploration}
          />
        );
      })()}

      {/* Visual Relationship Mental Model Component */}
      <RelationshipVisual
        unfamiliarTopic={translation.unfamiliarTopic}
        familiarDomain={translation.familiarDomain}
        headlineSummary={translation.headlineSummary}
        mappings={translation.section1Connects.mappings}
        differences={translation.section2Differences.breakdowns}
        bidirectionalInsights={translation.bidirectionalInsights}
      />

      {/* Interactive Adaptation Controls (Working Buttons) */}
      <div className="bg-slate-100 rounded-2xl p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={onSimpler}
            disabled={isRefining}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {refiningAction === 'simpler' ? 'Simplifying...' : 'Explain it more simply'}
          </button>

          <button
            onClick={onAnotherExample}
            disabled={isRefining}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {refiningAction === 'another_example' ? 'Finding new angle...' : 'Show me another example'}
          </button>

          <button
            onClick={onStillConfused}
            disabled={isRefining}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {refiningAction === 'confused' ? 'Recalibrating...' : 'I still don\'t understand'}
          </button>

          <button
            onClick={onConnectCustomDomain}
            disabled={isRefining}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Connect to my experience
          </button>

          <button
            onClick={onReverseComparison}
            disabled={isRefining}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {refiningAction === 'reversed' ? 'Reversing...' : 'Explain it the other way around'}
          </button>

          <button
            onClick={onGoDeeper}
            disabled={isRefining}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {refiningAction === 'deeper' ? 'Deepening...' : 'Go deeper'}
          </button>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={handleCopy}
            className="min-h-[44px] px-3 py-2 text-xs font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
            title="Copy explanation"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-emerald-800 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* The Understanding Moment Trigger Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-amber-500/5 rounded-3xl border border-amber-300/80 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-900 font-semibold">
            <HeartHandshake className="w-4 h-4 text-amber-700" />
            <span>The Understanding Moment</span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-slate-900">
            Test your understanding in your own words
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Explain the core concept in 1–2 sentences. The AI will check if you captured 
            the essential relationship and reveal an everyday application in your real life.
          </p>
        </div>

        <button
          onClick={onTriggerUnderstandingMoment}
          className="min-h-[48px] px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm whitespace-nowrap shrink-0 transition-all shadow-sm active:scale-[0.98]"
        >
          Put It In My Words
        </button>
      </div>

      {/* Switch to an Everyday Experience You Know Well */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-teal-600" />
            <span>Prefer an everyday example from something you already live?</span>
          </span>
          <span className="text-slate-500 text-[11px]">Tap to re-explain through what you know</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { label: 'Driving & Traffic', icon: '🚗' },
            { label: 'Cooking & Kitchen', icon: '🍳' },
            { label: 'Work & Bosses', icon: '💼' },
            { label: 'Family & Arguments', icon: '🗣️' },
            { label: 'Sports & Games', icon: '⚽' },
            { label: 'Fixing Things & Plumbing', icon: '🔧' },
            { label: 'Habits & Autopilot', icon: '🔄' },
            { label: 'Kids & Parenting', icon: '👶' },
            { label: 'Money & Shopping', icon: '💳' },
          ].map((item) => {
            const isCurrent = translation.familiarDomain.toLowerCase().includes(item.label.toLowerCase().slice(0, 5));
            return (
              <button
                key={item.label}
                type="button"
                disabled={isRefining}
                onClick={() => onAdaptToPhysicalAnalogy?.(item.label, item.label)}
                className={`text-xs px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                  isCurrent
                    ? 'bg-teal-700 text-white border-teal-700 font-semibold shadow-xs'
                    : 'bg-white hover:bg-slate-100/90 text-slate-800 border-slate-200 active:scale-95 shadow-2xs'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Concrete Real-Life Examples Section (Start with what people already know) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-mono text-teal-700 font-bold mb-1 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-teal-600" />
            <span>Familiar to Unfamiliar &middot; Ordinary Life Connection</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-900">
            Think About It This Way: Real-Life Everyday Situations
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Notice how this exact relational dynamic operates in ordinary everyday life before exploring any technical theory:
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {translation.section1Connects.realLifeExamples.map((ex, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-900 font-mono text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="leading-relaxed">{ex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Element-by-Element System Mappings */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-900">
              Interactive Relationship Mappings
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Tap each parallel to examine how both systems exchange dynamic roles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {translation.section1Connects.mappings.map((mapping, idx) => {
            const isExpanded = expandedMapping === idx;
            return (
              <div
                key={idx}
                onClick={() => setExpandedMapping(isExpanded ? null : idx)}
                className="cursor-pointer p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all space-y-2.5 text-xs sm:text-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-500 font-medium">
                    Parallel 0{idx + 1}
                  </span>
                  <span className="text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold border border-teal-200/60">
                    {mapping.underlyingDynamic}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 text-[11px] uppercase tracking-wider font-mono">
                    Unfamiliar:
                  </div>
                  <div className="font-semibold text-slate-900">{mapping.unfamiliarElement}</div>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-200/60">
                  <div className="text-slate-500 text-[11px] uppercase tracking-wider font-mono">
                    Lived Twin:
                  </div>
                  <div className="font-medium text-slate-800">{mapping.familiarElement}</div>
                </div>

                <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                  {mapping.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Difference Boundaries (Where the comparison stops working) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wider font-mono text-rose-800 font-semibold mb-1">
            Boundary Analysis
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-900">
            Where The Comparison Stops Working
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {translation.section2Differences.summary}
          </p>
          <p className="text-xs text-rose-900 mt-2 font-medium bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 inline-block">
            *Never assume similarity proves identical operation.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {translation.section2Differences.breakdowns.map((diff, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{diff.aspect}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-medium text-emerald-800 block mb-0.5">Where it works:</span>
                  <p className="text-slate-600">{diff.whereComparisonWorks}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-medium text-rose-800 block mb-0.5">Where it fails:</span>
                  <p className="text-slate-600">{diff.whereItFails}</p>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-950">
                <span className="font-semibold block mb-0.5">The risk of assuming identical:</span>
                <p>{diff.riskOfAssumingIdentical}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-World Activities (Live Beyond The Screen) */}
      {translation.realWorldActivities && translation.realWorldActivities.length > 0 && (
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800 shadow-md">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider font-mono text-teal-400 font-semibold">
              Live Beyond The Screen
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white">
              Real-World Reinforcement Activities
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              The goal is to understand something and use it in your life without needing the app:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {translation.realWorldActivities.map((act, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2 text-xs"
              >
                <div className="font-mono text-[10px] text-teal-300 uppercase tracking-wider font-bold">
                  {act.type}
                </div>
                <div className="font-semibold text-white text-sm">{act.title}</div>
                <p className="text-slate-300 leading-relaxed">{act.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Question Engine Bridge Banner */}
      {onNavigateToMissingEngine && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-teal-500/40 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Deeper Inquiry &middot; The Missing Question Engine</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-white">
              Convene the Round Table for &ldquo;{translation.unfamiliarTopic}&rdquo;
            </h4>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Examine shared mechanisms vs patterns across historical eras, challenge assumptions, and uncover unanswered questions nobody is considering.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToMissingEngine(translation.unfamiliarTopic)}
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md active:scale-95"
          >
            <span>Launch Engine</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* INLINE OPPORTUNITY TO DEMONSTRATE UNDERSTANDING & OUTSIDE APPLICATION */}
      <UnderstandingCheckInline
        unfamiliarTopic={translation.unfamiliarTopic}
        currentDomain={translation.familiarDomain}
        onAdaptToPhysicalAnalogy={async (reason, preferredDomain) => {
          if (onAdaptToPhysicalAnalogy) {
            await onAdaptToPhysicalAnalogy(reason, preferredDomain);
          } else {
            onStillConfused();
          }
        }}
        onSavePracticalAction={onSavePracticalAction}
        onUnderstandingEvaluated={onUnderstandingEvaluated}
        isAdapting={isRefining && refiningAction === 'physical_adaptation'}
      />
    </div>
  );
};
