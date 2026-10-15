import React, { useState } from 'react';
import {
  HistoricalComparison,
  DocumentedSource,
  ComparableRole,
  BeforeParallel,
  ChangedOutcomeAnalysis,
  ModernReflection,
} from '../../types/sameStory';
import { HISTORICAL_COMPARISONS } from '../../data/sameStoryExamples';
import { VisualSameStoryScene } from '../visuals/VisualSameStoryScene';
import {
  History,
  Users,
  Compass,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Search,
  BookOpen,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SameStoryScreenProps {
  onNavigateToDiscover?: () => void;
  onNavigateToMissingEngine?: (topic: string) => void;
  initialTopic?: string;
}

export const SameStoryScreen: React.FC<SameStoryScreenProps> = ({
  onNavigateToDiscover,
  onNavigateToMissingEngine,
  initialTopic,
}) => {
  // Active comparison demo
  const [selectedComparisonId, setSelectedComparisonId] = useState<string>(HISTORICAL_COMPARISONS[0].id);
  const [customComparison, setCustomComparison] = useState<HistoricalComparison | null>(null);

  // Active timeline phase
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  // Active selected character for inspection
  const [selectedCharacterRole, setSelectedCharacterRole] = useState<ComparableRole | null>(null);

  // Modal / Drawer states for the 3 functional buttons
  const [activeActionModal, setActiveActionModal] = useState<'before' | 'changed' | 'today' | 'personal' | null>(null);

  // Custom search / event explorer
  const [customSearchQuery, setCustomSearchQuery] = useState(initialTopic || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialTopic && !customSearchQuery) {
      setCustomSearchQuery(initialTopic);
    }
  }, [initialTopic]);

  // Personal connection tool state
  const [personalSituation, setPersonalSituation] = useState('');
  const [personalResult, setPersonalResult] = useState<string | null>(null);

  // Main 9-point discovery active tab
  const [discoverySection, setDiscoverySection] = useState<'narrative' | 'pressures' | 'evidence' | 'takeaways'>('narrative');

  // Active comparison object
  const activeComparison: HistoricalComparison =
    customComparison && customComparison.id === selectedComparisonId
      ? customComparison
      : HISTORICAL_COMPARISONS.find((c) => c.id === selectedComparisonId) || HISTORICAL_COMPARISONS[0];

  // Reset phase when comparison changes
  const handleSelectComparison = (id: string) => {
    setSelectedComparisonId(id);
    setActivePhaseIndex(0);
    setSelectedCharacterRole(null);
  };

  // Custom AI Search API call
  const handleSearchCustomEvent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customSearchQuery.trim() || isSearching) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch('/api/same-story-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: customSearchQuery.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to find historical comparison. Please try again.');
      }

      const data: HistoricalComparison = await response.json();
      setCustomComparison(data);
      setSelectedComparisonId(data.id);
      setActivePhaseIndex(0);
      setSelectedCharacterRole(null);
    } catch (err: any) {
      console.error('Custom event search error:', err);
      setSearchError(err?.message || 'Unable to connect to pattern engine. Please check your query or explore the featured comparisons.');
    } finally {
      setIsSearching(false);
    }
  };

  // Personal connection submit
  const handlePersonalConnect = () => {
    if (!personalSituation.trim()) return;

    // Synthesize structured advice using the active comparison's mechanism
    const mechanism = activeComparison.recurringPatternName;
    const advice = `
In your situation ("${personalSituation.trim()}"), the underlying dynamic reflects "${mechanism}".
1. SEPARATE FACT FROM PRESSURE: List what you have personally verified with your own eyes, separate from what other people are loudly claiming or assuming.
2. CHECK THE ASSUMPTION: What is the single biggest belief everyone is taking for granted without proof?
3. ONE SAFETY QUESTION: Ask the team or yourself: "If our primary assumption turns out to be wrong, what is our immediate fallback plan?"
`;
    setPersonalResult(advice);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 text-slate-100">
      {/* Hero Header: Distinctive, Clean, Anti-AI Slop */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-teal-400 mb-1.5 uppercase tracking-wider">
          <History className="w-3.5 h-3.5" />
          <span>The Last 10% · Pattern & History Explorer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
          Same Story. Different Characters.
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-1.5 leading-relaxed">
          Why similar situations happen repeatedly across different centuries, civilizations, and everyday life.
          Don&apos;t just read about history in paragraphs—<span className="text-teal-300 font-medium">explore how human decisions, pressures, and system bottlenecks unfold side by side</span>.
        </p>
      </div>

      {/* Feature Selector Tabs (3 Working Pre-built Demos + Custom Search) */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {HISTORICAL_COMPARISONS.map((comp) => {
            const isSelected = selectedComparisonId === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => handleSelectComparison(comp.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left flex flex-col shrink-0 ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-800'
                }`}
              >
                <span className="truncate max-w-[180px] sm:max-w-[220px]">{comp.title}</span>
                <span className={`text-[10px] font-sans font-normal truncate max-w-[180px] sm:max-w-[220px] ${
                  isSelected ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {comp.eventA.shortLabel} vs {comp.eventB.shortLabel}
                </span>
              </button>
            );
          })}

          {customComparison && (
            <button
              onClick={() => handleSelectComparison(customComparison.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left flex flex-col shrink-0 ${
                selectedComparisonId === customComparison.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-slate-850 hover:bg-slate-800 text-amber-300 border border-amber-500/30'
              }`}
            >
              <span className="truncate max-w-[180px]">{customComparison.title}</span>
              <span className="text-[10px] font-sans text-slate-400 truncate max-w-[180px]">Custom Discovery</span>
            </button>
          )}
        </div>

        {/* Custom Event Search Bar */}
        <form onSubmit={handleSearchCustomEvent} className="relative flex items-center min-w-[260px] sm:min-w-[320px]">
          <input
            type="text"
            value={customSearchQuery}
            onChange={(e) => setCustomSearchQuery(e.target.value)}
            placeholder="Explore any event (e.g. Cuban Missile Crisis, Enron)..."
            className="w-full pl-9 pr-20 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-teal-400 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            disabled={!customSearchQuery.trim() || isSearching}
            className="absolute right-1 px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1"
          >
            {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : <span>Compare</span>}
          </button>
        </form>

        {onNavigateToMissingEngine && (
          <button
            type="button"
            onClick={() => onNavigateToMissingEngine(customComparison?.title || activeComparison.title)}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors self-start md:self-auto cursor-pointer"
            title="Convene Round Table and find missing questions for this historical pattern"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Question Engine</span>
          </button>
        )}
      </div>

      {searchError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{searchError}</span>
          </div>
          <button
            onClick={() => setSearchError(null)}
            className="text-xs text-rose-400 hover:text-rose-200 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Tagline */}
      <div className="mb-4 p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider block">
            Shared Recurring Pattern: {activeComparison.recurringPatternName}
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-serif italic mt-0.5">
            &quot;{activeComparison.tagline}&quot;
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono shrink-0">
          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
          <span>Documented by primary sources & records</span>
        </div>
      </div>

      {/* Centerpiece 1: The Interactive Visual SVG Dual-Timeline Engine */}
      <VisualSameStoryScene
        comparison={activeComparison}
        activePhaseIndex={activePhaseIndex}
        onSelectPhase={setActivePhaseIndex}
        onSelectCharacter={(charId) => {
          const role = activeComparison.comparableRoles.find(
            (r) => r.characterA.id === charId || r.characterB.id === charId
          );
          if (role) setSelectedCharacterRole(role);
        }}
      />

      {/* Three Working Action Buttons (REQUIRED) */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Button 1: "Show me where this happened before." */}
        <button
          onClick={() => setActiveActionModal('before')}
          className="min-h-[52px] p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-teal-500/40 hover:border-teal-400 text-left transition-all group flex items-start gap-3 shadow-md"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-300 flex items-center justify-center shrink-0 group-hover:bg-teal-500/20 transition-colors">
            <History className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
              &quot;Show me where this happened before.&quot;
            </span>
            <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Explore older historical precedents & documented records
            </span>
          </div>
        </button>

        {/* Button 2: "What could have changed the outcome?" */}
        <button
          onClick={() => setActiveActionModal('changed')}
          className="min-h-[52px] p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/40 hover:border-amber-400 text-left transition-all group flex items-start gap-3 shadow-md"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-300 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
            <Compass className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              &quot;What could have changed the outcome?&quot;
            </span>
            <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Analyze counterfactual turning points & alternative paths
            </span>
          </div>
        </button>

        {/* Button 3: "Where do we see this today?" */}
        <button
          onClick={() => setActiveActionModal('today')}
          className="min-h-[52px] p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-sky-500/40 hover:border-sky-400 text-left transition-all group flex items-start gap-3 shadow-md"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-300 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
              &quot;Where do we see this today?&quot;
            </span>
            <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Workplace, tech, and civic parallels in modern life
            </span>
          </div>
        </button>
      </div>

      {/* Interactive People and Comparable Roles Section */}
      <div className="mt-8 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <span>Comparable Roles: Different Characters in the Same Mechanism</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tap any pair to inspect what each person knew, what they assumed, and the pressures they faced.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeComparison.comparableRoles.map((role, idx) => {
            const isSelected = selectedCharacterRole?.roleCategory === role.roleCategory;
            return (
              <div
                key={idx}
                onClick={() => setSelectedCharacterRole(role)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-850 border-teal-400 shadow-md ring-1 ring-teal-400/40'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono text-teal-400 mb-2">
                  <span>{role.roleCategory}</span>
                  <span className="text-[10px] text-slate-500">Tap to inspect</span>
                </div>

                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80">
                    <span className="text-[10px] font-mono text-teal-400 block">{activeComparison.eventA.shortLabel}</span>
                    <span className="text-xs font-bold text-white">{role.characterA.name}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{role.characterA.roleTitle}</p>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80">
                    <span className="text-[10px] font-mono text-amber-400 block">{activeComparison.eventB.shortLabel}</span>
                    <span className="text-xs font-bold text-white">{role.characterB.name}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{role.characterB.roleTitle}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 mt-2.5 line-clamp-2 italic">
                  &quot;{role.sharedRoleDynamic}&quot;
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Character Deep Dive Card */}
        {selectedCharacterRole && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-slate-900 border border-teal-500/50 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <span className="text-xs font-mono text-teal-400 uppercase tracking-wider">Role Breakdown</span>
                <h4 className="text-base font-serif font-bold text-white">{selectedCharacterRole.roleCategory}</h4>
              </div>
              <button
                onClick={() => setSelectedCharacterRole(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Character A */}
              <div className="p-3 rounded-lg bg-slate-950 border border-teal-800/40">
                <span className="text-[11px] font-mono text-teal-400 uppercase">{activeComparison.eventA.shortLabel}</span>
                <h5 className="text-sm font-bold text-white mt-0.5">{selectedCharacterRole.characterA.name}</h5>
                <span className="text-[11px] text-slate-400 block mb-2">{selectedCharacterRole.characterA.roleTitle}</span>

                <div className="space-y-2 text-slate-300">
                  <div>
                    <strong className="text-slate-100 block">What they knew:</strong>
                    <p className="text-[11px] text-slate-300">{selectedCharacterRole.characterA.whatTheyKnew}</p>
                  </div>
                  <div>
                    <strong className="text-slate-100 block">What they believed/assumed:</strong>
                    <p className="text-[11px] text-slate-300">{selectedCharacterRole.characterA.whatTheyBelievedOrAssumed}</p>
                  </div>
                  <div>
                    <strong className="text-slate-100 block">Pressures faced:</strong>
                    <p className="text-[11px] text-slate-300">{selectedCharacterRole.characterA.pressuresFaced}</p>
                  </div>
                  <div>
                    <strong className="text-slate-100 block">Key decision:</strong>
                    <p className="text-[11px] text-teal-300 font-medium">{selectedCharacterRole.characterA.keyDecision}</p>
                  </div>
                </div>
              </div>

              {/* Character B */}
              <div className="p-3 rounded-lg bg-slate-950 border border-amber-800/40">
                <span className="text-[11px] font-mono text-amber-400 uppercase">{activeComparison.eventB.shortLabel}</span>
                <h5 className="text-sm font-bold text-white mt-0.5">{selectedCharacterRole.characterB.name}</h5>
                <span className="text-[11px] text-slate-400 block mb-2">{selectedCharacterRole.characterB.roleTitle}</span>

                <div className="space-y-2 text-slate-300">
                  <div>
                    <strong className="text-slate-100 block">What they knew:</strong>
                    <p className="text-[11px] text-slate-300">{selectedCharacterRole.characterB.whatTheyKnew}</p>
                  </div>
                  <div>
                    <strong className="text-slate-100 block">What they believed/assumed:</strong>
                    <p className="text-[11px] text-slate-300">{selectedCharacterRole.characterB.whatTheyBelievedOrAssumed}</p>
                  </div>
                  <div>
                    <strong className="text-slate-100 block">Pressures faced:</strong>
                    <p className="text-[11px] text-slate-300">{selectedCharacterRole.characterB.pressuresFaced}</p>
                  </div>
                  <div>
                    <strong className="text-slate-100 block">Key decision:</strong>
                    <p className="text-[11px] text-amber-300 font-medium">{selectedCharacterRole.characterB.keyDecision}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-slate-800/80 text-[11px] text-slate-300 border border-slate-700/80 flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Crucial Difference Notice: </strong>
                {selectedCharacterRole.crucialDifferenceWarning}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* The Main Discovery: The 9 Core Historical Principles */}
      <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-white">
              The Main Discovery: 9 Questions Across Time
            </h3>
            <p className="text-xs text-slate-400">
              Examining the evidence, cognitive traps, pressures, and lessons without assuming history literally repeats.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setDiscoverySection('narrative')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                discoverySection === 'narrative' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Events & Facts
            </button>
            <button
              onClick={() => setDiscoverySection('pressures')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                discoverySection === 'pressures' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Beliefs & Pressures
            </button>
            <button
              onClick={() => setDiscoverySection('evidence')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                discoverySection === 'evidence' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Parallels & Differences
            </button>
            <button
              onClick={() => setDiscoverySection('takeaways')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                discoverySection === 'takeaways' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              4. Lessons for Today
            </button>
          </div>
        </div>

        {/* Tab 1: What Happened & What They Knew */}
        {discoverySection === 'narrative' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono text-teal-400 block mb-1">
                Question 1: What happened in each situation?
              </span>
              <p className="text-slate-300 leading-relaxed mb-2 font-sans">
                {activeComparison.mainDiscovery.whatHappened.synthesis}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/80">
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  <strong className="text-teal-400 block">{activeComparison.eventA.title}:</strong>
                  {activeComparison.mainDiscovery.whatHappened.eventA}
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  <strong className="text-amber-400 block">{activeComparison.eventB.title}:</strong>
                  {activeComparison.mainDiscovery.whatHappened.eventB}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono text-teal-400 block mb-1">
                Question 2: What did the people involved know at the time?
              </span>
              <p className="text-slate-300 mb-2">
                {activeComparison.mainDiscovery.whatTheyKnewAtTheTime.blindSpotsSummary}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="p-2 rounded bg-slate-900">
                  <strong className="text-teal-400 block mb-1">Known in {activeComparison.eventA.shortLabel}:</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    {activeComparison.mainDiscovery.whatTheyKnewAtTheTime.knownFactsA.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-2 rounded bg-slate-900">
                  <strong className="text-amber-400 block mb-1">Known in {activeComparison.eventB.shortLabel}:</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    {activeComparison.mainDiscovery.whatTheyKnewAtTheTime.knownFactsB.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: What They Believed & What Pressures Influenced Them */}
        {discoverySection === 'pressures' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono text-teal-400 block mb-1">
                Question 3: What did they believe or assume?
              </span>
              <p className="text-amber-300 font-medium mb-2">
                Shared Trap: {activeComparison.mainDiscovery.whatTheyBelievedOrAssumed.sharedCognitiveTrap}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  <strong className="text-teal-400 block mb-1">Assumptions in {activeComparison.eventA.shortLabel}:</strong>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    {activeComparison.mainDiscovery.whatTheyBelievedOrAssumed.assumptionsA.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  <strong className="text-amber-400 block mb-1">Assumptions in {activeComparison.eventB.shortLabel}:</strong>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    {activeComparison.mainDiscovery.whatTheyBelievedOrAssumed.assumptionsB.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono text-teal-400 block mb-1">
                Question 4: What pressures influenced their decisions?
              </span>
              <p className="text-slate-300 mb-2">
                {activeComparison.mainDiscovery.pressuresInfluencingDecisions.sharedStressors}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  <strong className="text-teal-400 block mb-1">Pressures in {activeComparison.eventA.shortLabel}:</strong>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    {activeComparison.mainDiscovery.pressuresInfluencingDecisions.externalPressuresA.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  <strong className="text-amber-400 block mb-1">Pressures in {activeComparison.eventB.shortLabel}:</strong>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    {activeComparison.mainDiscovery.pressuresInfluencingDecisions.externalPressuresB.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Parallels & Crucial Differences */}
        {discoverySection === 'evidence' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono text-teal-400 block mb-1">
                Question 5: Which underlying relationships appear similar?
              </span>
              <p className="text-slate-200 font-semibold mb-1">
                Mechanism: {activeComparison.mainDiscovery.underlyingRelationshipsSimilar.mechanismName}
              </p>
              <p className="text-slate-300 leading-relaxed mb-3">
                {activeComparison.mainDiscovery.underlyingRelationshipsSimilar.detailedExplanation}
              </p>
              <div className="space-y-1.5">
                {activeComparison.mainDiscovery.underlyingRelationshipsSimilar.interactionDynamics.map((dyn, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{dyn}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono text-amber-400 block mb-1">
                Question 6: What differences matter?
              </span>
              <p className="text-slate-300 mb-2 italic">
                {activeComparison.mainDiscovery.whatDifferencesMatter.whyHistoryDoesNotRepeatLiterally}
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                {activeComparison.mainDiscovery.whatDifferencesMatter.materialDifferences.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Aftermath & Modern Lessons */}
        {discoverySection === 'takeaways' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono text-teal-400 block mb-1">
                Question 7: What happened afterward?
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  <strong className="text-teal-400 block">{activeComparison.eventA.shortLabel}:</strong>
                  <p>{activeComparison.mainDiscovery.whatHappenedAfterward.immediateOutcomeA}</p>
                  <p className="mt-1 text-slate-400">{activeComparison.mainDiscovery.whatHappenedAfterward.longTermConsequenceA}</p>
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  <strong className="text-amber-400 block">{activeComparison.eventB.shortLabel}:</strong>
                  <p>{activeComparison.mainDiscovery.whatHappenedAfterward.immediateOutcomeB}</p>
                  <p className="mt-1 text-slate-400">{activeComparison.mainDiscovery.whatHappenedAfterward.longTermConsequenceB}</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-800/40 text-teal-200">
              <span className="text-[11px] font-mono text-teal-400 block mb-1">
                Question 8 & 9: Critical information & What to learn today
              </span>
              <p className="text-sm font-serif font-bold text-white mb-2">
                &quot;{activeComparison.mainDiscovery.whatToRecognizeToday.coreInsight}&quot;
              </p>
              <div className="space-y-1.5 mt-2 pt-2 border-t border-teal-800/40">
                <strong className="text-teal-300 block">Questions to ask before proceeding:</strong>
                {activeComparison.mainDiscovery.whatToRecognizeToday.actionableQuestionsToAsk.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connect to Your Own Experience (Personal Connector Tool) */}
      <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-teal-500/30 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-serif font-bold text-white">
              Connect this pattern to something you personally experience
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {activeComparison.personalConnectionPrompt.question}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {activeComparison.personalConnectionPrompt.commonSituations.map((sit, i) => (
                <button
                  key={i}
                  onClick={() => setPersonalSituation(sit)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors text-left"
                >
                  &quot;{sit}&quot;
                </button>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={personalSituation}
                onChange={(e) => setPersonalSituation(e.target.value)}
                placeholder="Or type your own experience or dilemma here..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-teal-400"
              />
              <button
                onClick={handlePersonalConnect}
                disabled={!personalSituation.trim()}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>Diagnose</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {personalResult && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-teal-500/40 text-xs text-slate-200"
              >
                <div className="flex items-center gap-2 text-teal-400 font-bold mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Pattern Diagnostic Feedback</span>
                </div>
                <div className="whitespace-pre-line text-slate-300 leading-relaxed font-sans">
                  {personalResult}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Historical Citations & Sources (Verifiable Grounding) */}
      <div className="mt-8 p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-mono text-slate-300 text-[11px] mb-2 uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
          <span>Documented Historical Sources & Records</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          <div>
            <strong className="text-teal-400 block mb-1">{activeComparison.eventA.title}:</strong>
            <ul className="space-y-1">
              {activeComparison.eventA.documentedSources.map((s, idx) => (
                <li key={idx} className="border-l-2 border-teal-500/40 pl-2">
                  <span className="text-slate-200 font-semibold">{s.title}</span> ({s.year}) · {s.authorOrEntity}
                  <span className="block text-slate-400 text-[10px]">{s.notes}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <strong className="text-amber-400 block mb-1">{activeComparison.eventB.title}:</strong>
            <ul className="space-y-1">
              {activeComparison.eventB.documentedSources.map((s, idx) => (
                <li key={idx} className="border-l-2 border-amber-500/40 pl-2">
                  <span className="text-slate-200 font-semibold">{s.title}</span> ({s.year}) · {s.authorOrEntity}
                  <span className="block text-slate-400 text-[10px]">{s.notes}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* MODAL / DRAWER 1: "Show me where this happened before." */}
      <AnimatePresence>
        {activeActionModal === 'before' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-2xl bg-slate-900 border border-teal-500/40 rounded-2xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-teal-400" />
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                    Where This Happened Before
                  </h3>
                </div>
                <button
                  onClick={() => setActiveActionModal(null)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Close
                </button>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Documented historical antecedents exhibiting the exact same mechanism of{' '}
                <strong className="text-teal-300">{activeComparison.recurringPatternName}</strong>.
              </p>

              <div className="space-y-3">
                {activeComparison.beforeParallels.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-mono text-teal-400 mb-1">
                      <span>{item.era}</span>
                      <span className="text-slate-400">{item.setting}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-slate-300 leading-relaxed mb-2">{item.sharedMechanism}</p>
                    <div className="pt-2 border-t border-slate-850 flex items-center gap-2 text-[10px] text-slate-400">
                      <BookOpen className="w-3 h-3 text-teal-400" />
                      <span><strong>Documented Record: </strong>{item.documentedSource}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL / DRAWER 2: "What could have changed the outcome?" */}
      <AnimatePresence>
        {activeActionModal === 'changed' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-2xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                    What Could Have Changed the Outcome?
                  </h3>
                </div>
                <button
                  onClick={() => setActiveActionModal(null)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Close
                </button>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Evidence-grounded counterfactual analysis: Where a specific verification or decision shift would have prevented catastrophic failure.
              </p>

              <div className="space-y-3">
                {activeComparison.whatCouldHaveChangedOutcome.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-[11px] font-mono text-amber-400 block mb-1">
                      Pivot Point: {item.pivotPoint}
                    </span>
                    <h4 className="text-sm font-bold text-white mb-1">Alternative Action:</h4>
                    <p className="text-slate-300 mb-2">{item.alternateAction}</p>

                    <div className="p-2.5 rounded-lg bg-teal-950/20 border border-teal-800/40 text-teal-200 mb-2">
                      <strong className="text-teal-300 block mb-0.5">Plausible Historical Divergence:</strong>
                      {item.plausibleOutcome}
                    </div>

                    <div className="text-[10px] text-slate-400">
                      <strong>Historical Basis: </strong>{item.historicalPrecedentOrData}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL / DRAWER 3: "Where do we see this today?" */}
      <AnimatePresence>
        {activeActionModal === 'today' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-2xl bg-slate-900 border border-sky-500/40 rounded-2xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                    Where Do We See This Today?
                  </h3>
                </div>
                <button
                  onClick={() => setActiveActionModal(null)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Close
                </button>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Modern workplace, engineering, and civic situations that obey this exact structural mechanism.
              </p>

              <div className="space-y-3">
                {activeComparison.whereWeSeeThisToday.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-[11px] font-mono text-sky-400 block mb-1">{item.modernDomain}</span>
                    <h4 className="text-sm font-bold text-white mb-1">{item.everydayScenario}</h4>
                    <p className="text-slate-300 mb-2 leading-relaxed">{item.sharedMechanism}</p>

                    <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-800/40 text-rose-200 text-[11px] mb-2">
                      <strong className="text-rose-300">Early Warning Signal: </strong>{item.earlyWarningSignal}
                    </div>

                    <div className="text-[10px] text-slate-400">
                      <strong>Difference to remember: </strong>{item.keyDifferenceToRemember}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
