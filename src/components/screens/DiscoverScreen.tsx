import React, { useState } from 'react';
import { TranslationResult, DomainSuggestion } from '../../types/translation';
import { EXAMPLE_TOPICS } from '../../data/examples';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { VisualCarEngine } from '../visuals/VisualCarEngine';
import { VisualCourtMechanic } from '../visuals/VisualCourtMechanic';
import { VisualBatterySystem } from '../visuals/VisualBatterySystem';
import {
  Sparkles,
  ArrowRight,
  Mic,
  MicOff,
  Compass,
  Lightbulb,
  Loader2,
  Wrench,
  Scale,
  BatteryCharging,
  Layers,
  ChevronRight,
  Eye,
  Sliders,
  CheckCircle2,
  History
} from 'lucide-react';

interface DiscoverScreenProps {
  onTranslate: (unfamiliar: string, familiar: string) => Promise<void>;
  onIntelligentGuide: (problemDescription: string, familiarDomain?: string) => Promise<void>;
  onSelectExample: (example: TranslationResult) => void;
  isLoading: boolean;
  onNavigateToSameStory?: () => void;
  onNavigateToMissingEngine?: (initialQuery?: string) => void;
}

const COMMON_DOMAINS = [
  'Driving, traffic & getting lost',
  'Cooking, recipes & kitchen chemistry',
  'Work, bosses & team dynamics',
  'Relationships, friends & family arguments',
  'Sports, referees & competition',
  'Fixing things & household plumbing',
  'Kids, parents & growing up',
  'Money, shopping & paying bills',
  'Phones, apps & daily routines',
  'Car mechanics & workshop diagnostics',
];

const INSPIRATION_PROMPTS = [
  'Why does history seem to repeat itself with different characters?',
  'Why do two people remember the exact same argument completely differently?',
  'Why do I act like a different person around my boss than around my friends?',
  'Why is it so hard to change an old habit even when I really want to?',
  'Why does the same problem keep happening no matter how many times we patch it?',
  'Why do our team projects keep stalling at the 90% mark?',
];

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onTranslate,
  onIntelligentGuide,
  onSelectExample,
  isLoading,
  onNavigateToSameStory,
  onNavigateToMissingEngine,
}) => {
  const [unfamiliarTopic, setUnfamiliarTopic] = useState('');
  const [familiarDomain, setFamiliarDomain] = useState('');
  const [suggestedDomains, setSuggestedDomains] = useState<DomainSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  // Active Centerpiece Visual Demonstration (1: Engine, 2: Court vs Mechanic, 3: Battery)
  const [activeDemo, setActiveDemo] = useState<'engine' | 'court_mechanic' | 'battery'>('engine');

  // Voice input
  const voice = useVoiceInput((finalText) => {
    setUnfamiliarTopic((prev) => (prev ? `${prev} ${finalText}` : finalText));
  });

  const handleToggleVoice = () => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unfamiliarTopic.trim() || isLoading) return;
    onIntelligentGuide(unfamiliarTopic.trim(), familiarDomain.trim());
  };

  const handleDirectTranslate = () => {
    if (!unfamiliarTopic.trim() || isLoading) return;
    onTranslate(unfamiliarTopic.trim(), familiarDomain.trim());
  };

  const handleFetchSuggestions = async () => {
    if (!unfamiliarTopic.trim() || isSuggesting) return;
    setIsSuggesting(true);
    setSuggestError(null);
    try {
      const res = await fetch('/api/suggest-domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unfamiliarTopic: unfamiliarTopic.trim() }),
      });
      const data = await res.json();
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestedDomains(data.suggestions);
      } else {
        setSuggestError('Could not generate suggestions right now.');
      }
    } catch (err: any) {
      setSuggestError('Failed to fetch domain suggestions.');
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-10">
      {/* Refined, Compact Header — Reduced from oversized banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-teal-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>Discover Knowledge</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Interactive Visual Foundation</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug">
            Understand what you don&apos;t know through what you&apos;ve lived.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Discover more. Understand better. Live beyond the screen. Explore dynamic physical systems below to see how relationships transfer across domains.
          </p>
        </div>
      </div>

      {/* LARGE ANIMATED INTERACTIVE CENTERPIECE */}
      <section className="space-y-3">
        {/* Demonstration Switcher Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>Interactive Visual Demonstrations</span>
          </div>
          <span className="text-[11px] font-mono text-teal-400 bg-teal-950/70 border border-teal-800/60 px-2.5 py-0.5 rounded-full">
            3 Functional Models
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveDemo('engine')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeDemo === 'engine'
                ? 'bg-slate-800 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4 text-teal-400" />
            <span>1. Car Engine Mechanics</span>
          </button>

          <button
            onClick={() => setActiveDemo('court_mechanic')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeDemo === 'court_mechanic'
                ? 'bg-slate-800 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Scale className="w-4 h-4 text-amber-400" />
            <span>2. Court vs Auto Shop</span>
          </button>

          <button
            onClick={() => setActiveDemo('battery')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeDemo === 'battery'
                ? 'bg-slate-800 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BatteryCharging className="w-4 h-4 text-sky-400" />
            <span>3. Battery Chemistry & Load</span>
          </button>
        </div>

        {/* Demonstration Container */}
        <div className="transition-all duration-300">
          {activeDemo === 'engine' && (
            <div className="space-y-3">
              <VisualCarEngine />
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <div className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Use this mechanical knowledge to understand complex institutions like courts, networks, and legal contracts.</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectExample(EXAMPLE_TOPICS[0])}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold border border-teal-500/40 flex items-center gap-1.5 shrink-0 ml-2"
                >
                  <span>Explore Court Comparison</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeDemo === 'court_mechanic' && (
            <div className="space-y-3">
              <VisualCourtMechanic />
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <div className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>See how intake scopes, diagnostic teardowns, and hearsay filtration mirror shop mechanics.</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectExample(EXAMPLE_TOPICS[0])}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/40 flex items-center gap-1.5 shrink-0 ml-2"
                >
                  <span>Open Full Translation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeDemo === 'battery' && (
            <div className="space-y-3">
              <VisualBatterySystem />
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <div className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Explore how battery physics, water plumbing, and thermodynamic friction share identical underlying math.</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectExample(EXAMPLE_TOPICS[2])}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-semibold border border-sky-500/40 flex items-center gap-1.5 shrink-0 ml-2"
                >
                  <span>Open Full Battery Translation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured New Screen: SAME STORY. DIFFERENT CHARACTERS. */}
      {onNavigateToSameStory && (
        <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-teal-500/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                    New Feature
                  </span>
                  <span className="text-xs font-mono text-slate-400">Interactive History & Pattern Explorer</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-1">
                  Same Story. Different Characters.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                  Why similar situations happen repeatedly across centuries, organizations, and everyday life. Explore animated dual timelines, pressure buildup, and turning points.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToSameStory}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 shadow-md shadow-teal-500/20 active:scale-95"
            >
              <span>Explore History Patterns</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Featured Core Engine: MISSING QUESTION ENGINE */}
      {onNavigateToMissingEngine && (
        <section className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/30 to-slate-900 border border-teal-500/50 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold bg-teal-900/60 px-2 py-0.5 rounded border border-teal-700/60">
                    Core Intelligence
                  </span>
                  <span className="text-xs font-mono text-slate-300">The Missing Question Engine</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-1">
                  Discover Questions Nobody Has Considered
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                  Identify what is known vs assumed, compare shared mechanisms across history, convene the multi-perspective Round Table, and uncover the decisive missing questions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToMissingEngine(unfamiliarTopic || undefined)}
              className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-teal-500/25 active:scale-95 cursor-pointer"
            >
              <span>Launch Question Engine</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* IMMERSIVE INQUIRY CONSOLE — Charcoal/Navy Theme */}
      <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Translation Engine</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-white mt-1">
            Now, explore your own question:
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Describe any unfamiliar concept, policy, medical condition, technical topic, or dispute.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question 1: Unfamiliar Topic */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="unfamiliarInput"
                className="block text-sm sm:text-base font-semibold text-slate-100 font-serif"
              >
                What are you trying to understand?
              </label>
              {voice.isSupported && (
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                    voice.isListening
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-600 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                  }`}
                  title={voice.isListening ? 'Click to stop voice input' : 'Click to speak your question'}
                >
                  {voice.isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-rose-400" />
                      <span>Listening... Speak now</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-teal-400" />
                      <span>Voice input</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <textarea
              id="unfamiliarInput"
              rows={3}
              value={unfamiliarTopic}
              onChange={(e) => setUnfamiliarTopic(e.target.value)}
              placeholder="Describe any question, situation, problem, or subject in your own words..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-slate-100 text-sm sm:text-base placeholder:text-slate-500 resize-none transition-colors"
              required
            />

            {/* Quick Inspiration Prompts */}
            <div className="pt-1">
              <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Or select a sample question to test:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {INSPIRATION_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setUnfamiliarTopic(prompt)}
                    className="text-xs text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-850 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question 2: Familiar Domain (Optional) */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label
                htmlFor="familiarInput"
                className="block text-sm font-semibold text-slate-200"
              >
                What do you already understand or have experience with?
              </label>
              <span className="text-xs font-mono text-slate-500">Optional</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Your hobbies, trade, parenting, cooking, tools, or everyday routine. 
              Leave blank if unsure—the AI will find the most natural comparison for you.
            </p>

            <input
              id="familiarInput"
              type="text"
              value={familiarDomain}
              onChange={(e) => setFamiliarDomain(e.target.value)}
              placeholder="e.g. Cooking, auto diagnostics, parenting, gardening, soccer coaching..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-slate-100 text-sm placeholder:text-slate-500 transition-colors"
            />

            {/* Suggestions Trigger */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium">Common lived experiences:</span>
              <button
                type="button"
                onClick={handleFetchSuggestions}
                disabled={!unfamiliarTopic.trim() || isSuggesting}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 disabled:opacity-40 min-h-[36px] px-2.5 py-1 rounded-xl hover:bg-teal-950/40 transition-colors"
              >
                {isSuggesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Finding best matches...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5" />
                    <span>Find tailored comparisons for my topic</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick choices pills */}
            <div className="flex flex-wrap gap-1.5">
              {COMMON_DOMAINS.map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setFamiliarDomain(dom)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all ${
                    familiarDomain === dom
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/60 font-semibold shadow-xs'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>

            {/* AI Suggested domains */}
            {suggestedDomains.length > 0 && (
              <div className="mt-3 p-4 rounded-2xl bg-teal-950/40 border border-teal-800/70 space-y-2 animate-fadeIn">
                <div className="text-xs font-semibold text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Tailored Comparisons for Your Question:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedDomains.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFamiliarDomain(s.domain)}
                      className="text-left p-3 rounded-xl bg-slate-900 border border-teal-900/60 hover:border-teal-500/70 hover:shadow-xs transition-all text-xs"
                    >
                      <div className="font-semibold text-slate-100">{s.domain}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5 leading-snug">{s.reason}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {suggestError && (
              <p className="text-xs text-rose-400 mt-1">{suggestError}</p>
            )}
          </div>

          {/* Submit Action */}
          {/* Submit Actions */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={!unfamiliarTopic.trim() || isLoading}
              className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-950/40 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-slate-950">Intelligently analyzing and routing your question...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>Intelligently Guide Me (Recommended)</span>
                  <ArrowRight className="w-5 h-5 text-slate-950" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs text-slate-400">
              <span>Not sure which tool to choose? Intelligent Guide routes you directly with 1-tap alternatives.</span>
              <button
                type="button"
                onClick={handleDirectTranslate}
                disabled={!unfamiliarTopic.trim() || isLoading}
                className="text-xs text-teal-400 hover:text-teal-300 underline font-medium disabled:opacity-40"
              >
                Or translate straight into an analogy
              </button>
              {onNavigateToMissingEngine && (
                <button
                  type="button"
                  onClick={() => onNavigateToMissingEngine(unfamiliarTopic || undefined)}
                  className="text-xs text-sky-400 hover:text-sky-300 underline font-medium flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Or explore with Missing Question Engine</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </section>

      {/* 3 Core Tested Analogy Cards */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-mono text-teal-400 font-semibold">
              Deep Comparative Case Studies
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-white mt-0.5">
              Three Tested Comparisons
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXAMPLE_TOPICS.map((topic, i) => (
            <div
              key={topic.id}
              onClick={() => onSelectExample(topic)}
              className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-teal-500/60 p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group active:scale-[0.99]"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-teal-950/60 border border-teal-800/60 flex items-center justify-center text-teal-300 mb-3 group-hover:scale-105 transition-transform">
                  {i === 0 && <Wrench className="w-4 h-4" />}
                  {i === 1 && <Scale className="w-4 h-4" />}
                  {i === 2 && <BatteryCharging className="w-4 h-4" />}
                </div>

                <h3 className="font-serif font-semibold text-base text-slate-100 group-hover:text-teal-300 transition-colors leading-snug">
                  {i === 0 && 'Court Procedures via Car Mechanics'}
                  {i === 1 && 'Rumour Diffusion & Fact Verification'}
                  {i === 2 && 'Battery Physics & Temperature Load'}
                </h3>

                <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  &ldquo;{topic.headlineSummary}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-teal-400">
                <span>Load Translation</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
