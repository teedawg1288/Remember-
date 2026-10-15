import React, { useState } from 'react';
import {
  TranslationResult,
  MystiqueDomain,
} from '../../types/translation';
import { VisualCarEngine } from '../visuals/VisualCarEngine';
import { VisualCourtMechanic } from '../visuals/VisualCourtMechanic';
import { VisualBatterySystem } from '../visuals/VisualBatterySystem';
import {
  Eye,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Users,
  History,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  GitBranch,
  Network,
  Scale,
  Compass,
} from 'lucide-react';

interface ShowMeScreenProps {
  translation: TranslationResult | null;
  onNavigateToTalk: (topic?: string) => void;
  mystiqueDomain: MystiqueDomain;
  onChangeMystiqueDomain: (domain: MystiqueDomain) => void;
  onAdaptAnalogy?: (analogy: string) => void;
  onStartExample?: (topic: string, domain?: string) => void;
}

const MYSTIQUE_DOMAINS: Array<{ id: MystiqueDomain; label: string; icon: string }> = [
  { id: 'everyday', label: 'Everyday Life', icon: '💡' },
  { id: 'cooking', label: 'Cooking', icon: '🍳' },
  { id: 'driving', label: 'Cars', icon: '🚗' },
  { id: 'relationships', label: 'Family & Friends', icon: '👥' },
  { id: 'work', label: 'Work & Bosses', icon: '💼' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'fixing', label: 'Fixing & Plumbing', icon: '🔧' },
  { id: 'tech', label: 'Phones & Tech', icon: '📱' },
];

export const ShowMeScreen: React.FC<ShowMeScreenProps> = ({
  translation,
  onNavigateToTalk,
  mystiqueDomain,
  onChangeMystiqueDomain,
  onStartExample,
}) => {
  // Visual Navigation Tabs within Show Me
  const [activeVisualTab, setActiveVisualTab] = useState<'outcomes' | 'cross_field' | 'facts_vs_guesses' | 'connections'>('outcomes');

  // Interactive states for whatever visual is being displayed
  const [activePerspective, setActivePerspective] = useState<'A' | 'B' | 'reality'>('A');
  const [activeTimelineStep, setActiveTimelineStep] = useState<number>(0);
  const [activeNode, setActiveNode] = useState<'twin' | 'boundary' | 'assumption' | 'missing'>('twin');
  const [selectedBranch, setSelectedBranch] = useState<'default' | 'intervention'>('default');
  const [crossFieldMode, setCrossFieldMode] = useState<'mechanism' | 'appearance'>('mechanism');
  const [selectedKnowledgeTier, setSelectedKnowledgeTier] = useState<number>(0);

  // If no translation active yet, show a clean, relatable visual preview
  if (!translation) {
    return (
      <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto pb-16">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Visual Explanations & Connections
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            When you explore an idea in Let&apos;s Talk, this section visually illustrates the perspectives, timelines, predictions, and cross-field connections directly tied to your conversation.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateToTalk()}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-teal-500/20 active:scale-95"
            >
              Start a Conversation
            </button>
          </div>
        </div>

        {/* Instant Interactive Previews */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
            Or tap an everyday topic to see its visual connection map right now:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                if (onStartExample) {
                  onStartExample(
                    'Why two people remember the same argument completely differently',
                    'Two people watching the same hockey game from opposite ends of the arena'
                  );
                } else {
                  onNavigateToTalk('Why two people remember the same argument completely differently');
                }
              }}
              className="p-4 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-left transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-amber-400 text-xs font-semibold">
                <span>Perspectives Map</span>
                <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>
              <p className="text-xs sm:text-sm font-serif font-semibold text-white leading-snug">
                Why two people recall the same argument differently
              </p>
              <span className="text-[11px] text-slate-400 block">
                Visualized like watching a hockey game from opposite ends.
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onStartExample) {
                  onStartExample(
                    'Why does our pipeline stall even when sales feel busy?',
                    'A traffic jam forming ten miles before you see any stopped cars'
                  );
                } else {
                  onNavigateToTalk('Why does our pipeline stall even when sales feel busy?');
                }
              }}
              className="p-4 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-left transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-sky-400 text-xs font-semibold">
                <span>Shockwave Timeline</span>
                <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>
              <p className="text-xs sm:text-sm font-serif font-semibold text-white leading-snug">
                Business pipeline shockwave & delays
              </p>
              <span className="text-[11px] text-slate-400 block">
                Visualized like a highway traffic jam forming miles upstream.
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onStartExample) {
                  onStartExample(
                    'Why do my partner and I keep having the exact same fight?',
                    'A home clothes dryer running dangerously hot because the lint filter has not been cleaned'
                  );
                } else {
                  onNavigateToTalk('Why do my partner and I keep having the exact same fight?');
                }
              }}
              className="p-4 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-left transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-rose-400 text-xs font-semibold">
                <span>Thermal Trap</span>
                <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>
              <p className="text-xs sm:text-sm font-serif font-semibold text-white leading-snug">
                Repeating arguments & blocked ventilation
              </p>
              <span className="text-[11px] text-slate-400 block">
                Visualized like an appliance thermostat tripping from trapped lint.
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Detect dynamic nature of the active topic
  const topicLower = (translation.unfamiliarTopic + ' ' + translation.familiarDomain).toLowerCase();
  const isRelationshipOrConflict =
    topicLower.includes('argument') ||
    topicLower.includes('remember') ||
    topicLower.includes('relationship') ||
    topicLower.includes('boss') ||
    topicLower.includes('friend') ||
    topicLower.includes('perspective') ||
    topicLower.includes('dispute') ||
    topicLower.includes('people');

  const isHistoryOrCycle =
    topicLower.includes('history') ||
    topicLower.includes('repeat') ||
    topicLower.includes('cycle') ||
    topicLower.includes('character') ||
    topicLower.includes('generation') ||
    topicLower.includes('crisis');

  const isMechanicalSpecific =
    topicLower.includes('car engine') ||
    topicLower.includes('brake') ||
    topicLower.includes('mechanic') ||
    topicLower.includes('court vs') ||
    topicLower.includes('battery');

  const currentPrediction = translation.predictions?.[0] || {
    id: 'pred-default',
    scenario: 'If forces continue without intervention, the system will cycle into the same predictable bottleneck.',
    likelihood: 'most_likely_default' as const,
    likelihoodExplanation: 'Underlying structural constraints dictate outcomes more strongly than temporary good intentions.',
    timeframeOrTrigger: 'Over the course of the ongoing operational cycle',
    influencingFactors: ['Existing habit groove', 'Delayed feedback signal', 'Unspoken expectations'],
    whatCouldChangeIt: 'Introducing a physical friction barrier or an explicit upstream check',
    verificationTest: {
      howWeFindOut: 'Observe whether the bottleneck reoccurs under the next pressure cycle.',
      falsificationSign: 'If the outcome remains steady despite zero changes to the underlying system, the constraint was illusory.'
    }
  };

  const currentDiscovery = translation.crossFieldDiscoveries?.[0] || {
    id: 'cfd-default',
    domain: 'Systems Biology & Fluid Dynamics',
    title: 'Flow-Limiting Orifices',
    whatHappensThere: 'In closed hydraulic lines, fluid cannot flow faster than the narrowest pipe aperture. Widening downstream faucets does nothing to increase water flow if the main meter valve is half-closed.',
    connectionType: 'shared_mechanism' as const,
    whyItMattersHere: 'In human projects, teams spend energy fixing downstream tasks when the upstream approval aperture is the single choke point.',
    isAlreadyKnownOrNovel: 'well_established_mechanism' as const,
    untestedCaution: 'Hydraulic pipes obey rigid Navier-Stokes fluid equations; human workflows involve motivation and emotional safety.'
  };

  const factsFromGuesses = [
    {
      label: 'Known to be True',
      badge: 'VERIFIED FACT',
      color: 'teal',
      content: translation.section3Missing.establishedFacts[0] || 'Physical constraints, recorded timelines, and verified occurrences.',
      distinction: 'Empirically supported or directly observable without projection.'
    },
    {
      label: 'What Seems Likely',
      badge: 'HIGH PROBABILITY',
      color: 'sky',
      content: translation.headlineSummary,
      distinction: 'Supported by available signals and consistent structural precedents.'
    },
    {
      label: 'Possible Prediction',
      badge: 'TESTABLE FORECAST',
      color: 'amber',
      content: currentPrediction.scenario,
      distinction: `Measurable outcome with clear falsification test (${currentPrediction.verificationTest.falsificationSign}).`
    },
    {
      label: 'Untested Idea',
      badge: 'CROSS-FIELD HYPOTHESIS',
      color: 'indigo',
      content: `${currentDiscovery.title} (${currentDiscovery.domain})`,
      distinction: currentDiscovery.untestedCaution
    },
    {
      label: 'Completely Unknown',
      badge: 'UNRESOLVED GAP',
      color: 'rose',
      content: translation.section3Missing.missingInformation[0] || 'Missing information where guessing must pause.',
      distinction: 'Requires primary evidence before any conclusion can be reached.'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto pb-16">
      {/* 1. Header showing exactly what is being visualized */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              <Eye className="w-3.5 h-3.5" />
              <span>Show Me Visuals</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
              {translation.unfamiliarTopic}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Explained through: <span className="text-amber-300 font-medium">{translation.familiarDomain}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTalk(translation.unfamiliarTopic)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all self-start sm:self-auto"
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
            <span>Ask in Let&apos;s Talk</span>
          </button>
        </div>

        {/* Mystique Principle: Dynamically change the lens right here */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-mono text-[11px] shrink-0">Change example:</span>
          {MYSTIQUE_DOMAINS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onChangeMystiqueDomain(d.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                mystiqueDomain === d.id
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{d.icon}</span> <span className="ml-0.5">{d.label}</span>
            </button>
          ))}
        </div>

        {/* 4 Visual Sub-Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveVisualTab('outcomes')}
            className={`p-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeVisualTab === 'outcomes'
                ? 'bg-sky-500/20 text-sky-200 border border-sky-500/40 font-bold shadow-xs'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <span>What Happens Next</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveVisualTab('cross_field')}
            className={`p-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeVisualTab === 'cross_field'
                ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40 font-bold shadow-xs'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            <span>Connecting Fields</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveVisualTab('facts_vs_guesses')}
            className={`p-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeVisualTab === 'facts_vs_guesses'
                ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40 font-bold shadow-xs'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-teal-400" />
            <span>Facts vs Guesses</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveVisualTab('connections')}
            className={`p-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeVisualTab === 'connections'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold shadow-xs'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Everyday Parallel</span>
          </button>
        </div>
      </div>

      {/* 2. TAB A: WHAT HAPPENS NEXT (POTENTIAL OUTCOMES & TIMELINES) */}
      {activeVisualTab === 'outcomes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
              <GitBranch className="w-4 h-4 text-sky-400" />
              <span>Potential Outcomes & Branching Timelines</span>
            </div>
            <span className="text-[10px] font-mono text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
              {currentPrediction.timeframeOrTrigger}
            </span>
          </div>

          {/* Visual Branch Switcher */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedBranch('default')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                selectedBranch === 'default'
                  ? 'bg-sky-500/20 text-sky-200 border-sky-500/60 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[11px] font-bold text-sky-400 mb-1">
                <span>PATH 1: If Nothing Changes</span>
                <span>(Default)</span>
              </div>
              <p className="text-white font-semibold text-xs sm:text-sm line-clamp-2">
                {currentPrediction.scenario}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedBranch('intervention')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                selectedBranch === 'intervention'
                  ? 'bg-teal-500/20 text-teal-200 border-teal-500/60 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[11px] font-bold text-teal-400 mb-1">
                <span>PATH 2: If Something Changes</span>
                <span>(Intervention)</span>
              </div>
              <p className="text-white font-semibold text-xs sm:text-sm line-clamp-2">
                {currentPrediction.whatCouldChangeIt || 'A deliberate friction barrier or communication reset'}
              </p>
            </button>
          </div>

          {/* Visual Branch Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            {selectedBranch === 'default' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sky-300 font-bold text-xs uppercase font-mono">
                  <span>Likely Trajectory if System Continues on Autopilot:</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {currentPrediction.scenario}
                </p>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="text-slate-400 font-mono text-[11px] uppercase font-bold block">
                    Causal Mechanism Behind This Outcome:
                  </span>
                  <p>{currentPrediction.likelihoodExplanation}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-mono text-[11px] uppercase font-bold block">
                    Driving Forces Influencing This Result:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentPrediction.influencingFactors.map((factor, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono"
                      >
                        &bull; {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase font-mono">
                  <span>How the Outcome Changes with an Intervention:</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {currentPrediction.whatCouldChangeIt}
                </p>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="text-teal-400 font-mono text-[11px] uppercase font-bold block">
                    What Breaks the Cycle:
                  </span>
                  <p>
                    By introducing an intentional pause, physical boundary, or honest alignment conversation, the automatic compression wave stops propagating.
                  </p>
                </div>
              </div>
            )}

            {/* Testability Card (How We Find Out / What Would Prove This Wrong) */}
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-slate-300 font-bold font-mono text-[11px] uppercase block">
                  Here&apos;s how we&apos;d find out:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {currentPrediction.verificationTest.howWeFindOut}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                <span className="text-rose-400 font-bold font-mono text-[11px] uppercase block">
                  What would prove this wrong:
                </span>
                <p className="text-rose-200/90 text-[11px] leading-relaxed">
                  {currentPrediction.verificationTest.falsificationSign}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB B: CONNECTING FIELDS (WHAT HAVEN'T WE THOUGHT OF) */}
      {activeVisualTab === 'cross_field' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              <Network className="w-4 h-4 text-indigo-400" />
              <span>Connecting Lines Between Different Fields</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
              {currentDiscovery.isAlreadyKnownOrNovel.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Visual Bridge Representation */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex-1 w-full">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Current Situation:
                </span>
                <span className="font-bold text-white text-xs sm:text-sm block mt-0.5">
                  {translation.unfamiliarTopic}
                </span>
              </div>

              <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950 border border-indigo-800/80 text-indigo-300 text-xs font-mono shrink-0">
                <span>&larr;</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {crossFieldMode === 'mechanism' ? 'Shared Mechanism' : 'Surface Look'}
                </span>
                <span>&rarr;</span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 flex-1 w-full sm:text-right">
                <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider block">
                  Distant Field:
                </span>
                <span className="font-bold text-white text-xs sm:text-sm block mt-0.5">
                  {currentDiscovery.domain}
                </span>
              </div>
            </div>

            {/* Toggle Mechanism vs Surface */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCrossFieldMode('mechanism')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  crossFieldMode === 'mechanism'
                    ? 'bg-indigo-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Shared Operating Mechanism
              </button>
              <button
                type="button"
                onClick={() => setCrossFieldMode('appearance')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  crossFieldMode === 'appearance'
                    ? 'bg-indigo-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Why They Look Different
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-indigo-900/30 text-xs sm:text-sm space-y-2">
              <h4 className="font-serif font-bold text-white text-sm sm:text-base">
                {currentDiscovery.title}
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                {crossFieldMode === 'mechanism'
                  ? currentDiscovery.whatHappensThere
                  : `Even though ${currentDiscovery.domain} uses industrial or biological terminology while your question deals with daily experience, both obey the identical law of feedback and capacity limits.`}
              </p>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-indigo-900/40 text-xs text-indigo-200">
                <strong className="text-indigo-300 font-mono uppercase text-[11px] block">
                  What that reveals here:
                </strong>
                {currentDiscovery.whyItMattersHere}
              </div>

              <p className="text-[11px] text-slate-400 italic pt-1">
                Scientific boundary check: {currentDiscovery.untestedCaution}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB C: KNOWLEDGE SPECTRUM (SEPARATING FACTS FROM GUESSES) */}
      {activeVisualTab === 'facts_vs_guesses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              <Scale className="w-4 h-4 text-teal-400" />
              <span>Separating Facts from Guesses</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">5 Rigorous Tiers</span>
          </div>

          {/* 5 Tiers Horizontal / Vertical Stack */}
          <div className="space-y-2">
            {factsFromGuesses.map((tier, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedKnowledgeTier(idx)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                  selectedKnowledgeTier === idx
                    ? 'bg-slate-850 border-teal-500/60 shadow-md ring-1 ring-teal-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">
                      Tier {idx + 1}: {tier.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-slate-900 text-teal-300 border border-slate-800">
                    {tier.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-snug">
                  {tier.content}
                </p>
                {selectedKnowledgeTier === idx && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 italic">
                    Standard of proof: {tier.distinction}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB D: EVERYDAY PARALLEL & CONNECTION MAP */}
      {activeVisualTab === 'connections' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Interactive Connection Map</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Tap any node</span>
          </div>

          {/* 4 Interactive Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setActiveNode('twin')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeNode === 'twin'
                  ? 'bg-teal-500/20 text-teal-200 border-teal-500/50 shadow-xs'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-teal-400 font-bold text-xs block">&bull; Where It Fits</span>
              <span className="text-[11px] text-slate-300 block truncate mt-0.5">Everyday Parallel</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNode('boundary')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeNode === 'boundary'
                  ? 'bg-rose-500/20 text-rose-200 border-rose-500/50 shadow-xs'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-rose-400 font-bold text-xs block">&bull; Where It Stops</span>
              <span className="text-[11px] text-slate-300 block truncate mt-0.5">Crucial Difference</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNode('assumption')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeNode === 'assumption'
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 shadow-xs'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-amber-400 font-bold text-xs block">&bull; The Assumption</span>
              <span className="text-[11px] text-slate-300 block truncate mt-0.5">Unverified Belief</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNode('missing')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeNode === 'missing'
                  ? 'bg-sky-500/20 text-sky-200 border-sky-500/50 shadow-xs'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-sky-400 font-bold text-xs block">&bull; What&apos;s Missing</span>
              <span className="text-[11px] text-slate-300 block truncate mt-0.5">Unasked Question</span>
            </button>
          </div>

          {/* Selected Node Deep-Dive Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm leading-relaxed space-y-2 animate-fadeIn">
            {activeNode === 'twin' && (
              <>
                <div className="flex items-center gap-2 text-teal-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>How the Everyday Comparison Fits:</span>
                </div>
                <p className="text-slate-200">
                  {translation.section1Connects.narrative || translation.frameworkFlow.translation}
                </p>
              </>
            )}

            {activeNode === 'boundary' && (
              <>
                <div className="flex items-center gap-2 text-rose-300 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Where this Comparison Breaks Down:</span>
                </div>
                <p className="text-slate-200">
                  {translation.section2Differences.breakdowns[0]?.whereItFails ||
                    'Be careful not to assume people behave with mechanical predictability. Human situations involve personal history, emotions, and changing incentives.'}
                </p>
              </>
            )}

            {activeNode === 'assumption' && (
              <>
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>The Big Assumption Being Questioned:</span>
                </div>
                <p className="text-slate-200">
                  {translation.section3Missing.assumptionsAndInterpretations[0] ||
                    'Assuming that if a problem keeps happening, someone must be doing it on purpose—rather than a hidden bottleneck forcing that behavior.'}
                </p>
              </>
            )}

            {activeNode === 'missing' && (
              <>
                <div className="flex items-center gap-2 text-sky-300 font-bold">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  <span>The Question Nobody Seems to Have Asked:</span>
                </div>
                <p className="text-slate-200">
                  {translation.section3Missing.missingInformation[0] ||
                    translation.section3Missing.questionsToAsk[0] ||
                    'What would happen if we stopped treating the surface symptom and traced where the pressure was coming from upstream?'}
                </p>
              </>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onNavigateToTalk(translation.unfamiliarTopic)}
                className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
              >
                <span>Explore this in Let&apos;s Talk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Context-Specific Interactive Visuals (Only if relevant) */}
      {isRelationshipOrConflict && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Perspective Arena (Both Ends of the Ice)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Tap a view below</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <button
              type="button"
              onClick={() => setActivePerspective('A')}
              className={`p-2.5 rounded-xl font-semibold transition-all ${
                activePerspective === 'A'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Person A&apos;s End
            </button>
            <button
              type="button"
              onClick={() => setActivePerspective('reality')}
              className={`p-2.5 rounded-xl font-semibold transition-all ${
                activePerspective === 'reality'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              The Neutral Ice
            </button>
            <button
              type="button"
              onClick={() => setActivePerspective('B')}
              className={`p-2.5 rounded-xl font-semibold transition-all ${
                activePerspective === 'B'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Person B&apos;s End
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm leading-relaxed min-h-[90px] flex items-center">
            {activePerspective === 'A' && (
              <div className="space-y-1">
                <span className="text-amber-300 font-bold block text-xs font-mono uppercase">
                  From Person A&apos;s End of the Arena:
                </span>
                <p className="text-slate-200">
                  {translation.frameworkFlow.observation ||
                    'They saw the push, felt the impact directly, and their attention focused completely on defending their position.'}
                </p>
              </div>
            )}
            {activePerspective === 'B' && (
              <div className="space-y-1">
                <span className="text-sky-300 font-bold block text-xs font-mono uppercase">
                  From Person B&apos;s End of the Arena:
                </span>
                <p className="text-slate-200">
                  {translation.section2Differences.breakdowns[0]?.whereComparisonWorks ||
                    'From their angle, they were just turning to clear the puck. They had no idea anyone felt crowded or blindsided.'}
                </p>
              </div>
            )}
            {activePerspective === 'reality' && (
              <div className="space-y-1">
                <span className="text-teal-300 font-bold block text-xs font-mono uppercase">
                  What Actually Happened (The Documented Truth):
                </span>
                <p className="text-slate-200">
                  {translation.frameworkFlow.reality ||
                    'Both people watched the exact same 5 seconds of time, but their nervous systems recorded completely different memories based on where they stood.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {isHistoryOrCycle && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
              <History className="w-4 h-4 text-sky-400" />
              <span>Interactive Repeating Pattern Timeline</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">4-phase cycle</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {['1. The Breakdown', '2. Safeguards', '3. Amnesia', '4. Repetition'].map((label, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTimelineStep(idx)}
                className={`p-2 rounded-xl text-center text-xs font-medium transition-all ${
                  activeTimelineStep === idx
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm leading-relaxed space-y-1.5">
            {activeTimelineStep === 0 && (
              <>
                <span className="text-rose-400 font-bold block text-xs font-mono uppercase">
                  Phase 1: The Initial Breakdown
                </span>
                <p className="text-slate-200">
                  A painful failure occurs (a water pipe bursts, a marriage hits a wall, or an organization collapses). Everyone vows &ldquo;never again.&rdquo;
                </p>
              </>
            )}
            {activeTimelineStep === 1 && (
              <>
                <span className="text-teal-400 font-bold block text-xs font-mono uppercase">
                  Phase 2: Heavy Safeguards Installed
                </span>
                <p className="text-slate-200">
                  Checklists, valves, buffers, and clear boundaries are put in place. As long as the people who lived through the pain are present, the safeguards stay.
                </p>
              </>
            )}
            {activeTimelineStep === 2 && (
              <>
                <span className="text-amber-400 font-bold block text-xs font-mono uppercase">
                  Phase 3: The People Who Remember Leave (Amnesia)
                </span>
                <p className="text-slate-200">
                  New people arrive. Because the system has run smoothly for years, they see the safeguards as &ldquo;needless bureaucracy&rdquo; or &ldquo;unnecessary friction&rdquo; and cut them.
                </p>
              </>
            )}
            {activeTimelineStep === 3 && (
              <>
                <span className="text-rose-400 font-bold block text-xs font-mono uppercase">
                  Phase 4: The Pressure Trap Springs Again
                </span>
                <p className="text-slate-200">
                  The exact same failure happens again with completely new characters who wonder: &ldquo;How could nobody have seen this coming?&rdquo;
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {isMechanicalSpecific && (
        <div className="space-y-4">
          {topicLower.includes('car engine') && <VisualCarEngine />}
          {topicLower.includes('court') && <VisualCourtMechanic />}
          {topicLower.includes('battery') && <VisualBatterySystem />}
        </div>
      )}
    </div>
  );
};
