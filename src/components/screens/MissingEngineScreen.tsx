import React, { useState, useEffect } from 'react';
import {
  MissingQuestionAnalysis,
  BridgeConnection,
  RoundTableNode,
  MissingQuestionItem,
  KnownFactItem,
  AssumptionItem,
} from '../../types/translation';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  GitMerge,
  Users,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Search,
  PlusCircle,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Sliders,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Scale,
} from 'lucide-react';

interface MissingEngineScreenProps {
  initialQuery?: string;
  onNavigateToDiscover?: () => void;
  onNavigateToUnderstand?: (topic: string) => void;
  onSaveToJourney?: (item: any) => void;
}

type EngineView = 'explore' | 'bridge' | 'round_table' | 'missing' | 'final10';

const SUCCESS_TEST_QUERY = "Why does history seem to repeat itself with different characters?";

const CURATED_EXPLORATIONS = [
  {
    title: "Why does history seem to repeat itself with different characters?",
    tag: "Historical Mechanisms & Cognitive Bias",
  },
  {
    title: "Why do ambitious projects stall at the 90% completion mark?",
    tag: "System Dynamics & Friction Accumulation",
  },
  {
    title: "How do two honest observers view the exact same event and reach contradictory facts?",
    tag: "Information Asymmetry & Perceptual Filtering",
  },
];

export const MissingEngineScreen: React.FC<MissingEngineScreenProps> = ({
  initialQuery = '',
  onNavigateToDiscover,
  onNavigateToUnderstand,
  onSaveToJourney,
}) => {
  const [query, setQuery] = useState(initialQuery || SUCCESS_TEST_QUERY);
  const [currentView, setCurrentView] = useState<EngineView>(initialQuery ? 'bridge' : 'explore');
  const [analysis, setAnalysis] = useState<MissingQuestionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // View 2: Bridge state
  const [selectedBridge, setSelectedBridge] = useState<BridgeConnection | null>(null);
  const [bridgeFilter, setBridgeFilter] = useState<'all' | 'shared_mechanism' | 'shared_pattern'>('all');

  // View 3: Round Table state
  const [selectedNode, setSelectedNode] = useState<RoundTableNode | null>(null);
  const [showAddPerspectiveModal, setShowAddPerspectiveModal] = useState(false);
  const [newPerspectiveTitle, setNewPerspectiveTitle] = useState('');
  const [newPerspectiveContribution, setNewPerspectiveContribution] = useState('');

  // View 4: Missing Questions state
  const [selectedQuestion, setSelectedQuestion] = useState<MissingQuestionItem | null>(null);
  const [questionFilter, setQuestionFilter] = useState<'all' | 'transformational' | 'high'>('all');

  // Evidence update state
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [newEvidenceText, setNewEvidenceText] = useState('');
  const [isUpdatingEvidence, setIsUpdatingEvidence] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-load analysis on mount if initial query or default success test query is present
  useEffect(() => {
    handleRunAnalysis(query);
  }, []);

  const handleRunAnalysis = async (searchQuery: string) => {
    if (!searchQuery.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/missing-question-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process inquiry with Missing Question Engine.');
      }

      setAnalysis(data);
      if (data.bridges?.length > 0) setSelectedBridge(data.bridges[0]);
      if (data.roundTableNodes?.length > 0) setSelectedNode(data.roundTableNodes[0]);
      if (data.missingQuestions?.length > 0) setSelectedQuestion(data.missingQuestions[0]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Unable to complete analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidenceText.trim() || !analysis || isUpdatingEvidence) return;

    setIsUpdatingEvidence(true);
    try {
      const res = await fetch('/api/missing-question-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentAnalysis: analysis,
          newEvidence: newEvidenceText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update analysis with new evidence.');
      }

      setAnalysis(data);
      setNewEvidenceText('');
      setShowEvidenceModal(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to incorporate new evidence.');
    } finally {
      setIsUpdatingEvidence(false);
    }
  };

  const handleAddCustomPerspective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerspectiveTitle.trim() || !newPerspectiveContribution.trim() || !analysis) return;

    const newNode: RoundTableNode = {
      id: `rt-custom-${Date.now()}`,
      title: newPerspectiveTitle.trim(),
      archetype: 'Custom',
      keyContribution: newPerspectiveContribution.trim(),
      evidenceBrought: 'Introduced by user exploration during this session.',
      blindSpotOfThisView: 'Subject to localized observation bias; requires independent empirical verification.',
      competingHypothesis: 'Existing systemic and psychological models.',
      customAdded: true,
    };

    const updatedNodes = [...analysis.roundTableNodes, newNode];
    setAnalysis({
      ...analysis,
      roundTableNodes: updatedNodes,
    });
    setSelectedNode(newNode);
    setNewPerspectiveTitle('');
    setNewPerspectiveContribution('');
    setShowAddPerspectiveModal(false);
  };

  const handleSaveToJourneyLocal = () => {
    if (!analysis || !onSaveToJourney) return;
    const journeyItem = {
      id: `journey-mqe-${Date.now()}`,
      topic: analysis.topicTitle,
      domain: analysis.bridges[0]?.domain || 'Cross-Domain Systems',
      headline: analysis.summaryInsight,
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      practicalOutsideAction: {
        title: analysis.finalTenPercent.practicalNextAction.actionTitle,
        description: analysis.finalTenPercent.practicalNextAction.actionStep,
        verificationStep: analysis.finalTenPercent.practicalNextAction.outcomeTest,
      },
      userNotes: `Choice point: ${analysis.finalTenPercent.practicalNextAction.choicePoint}`,
    };
    onSaveToJourney(journeyItem);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const views: Array<{ id: EngineView; label: string; number: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'explore', label: "1. What's on your mind?", number: '01', icon: Search },
    { id: 'bridge', label: '2. This reminds me of...', number: '02', icon: GitMerge },
    { id: 'round_table', label: '3. Look at it this way', number: '03', icon: Users },
    { id: 'missing', label: "4. Hang on, what's missing?", number: '04', icon: HelpCircle },
    { id: 'final10', label: '5. So what now?', number: '05', icon: Sparkles },
  ];

  const filteredBridges = analysis?.bridges.filter((b) => {
    if (bridgeFilter === 'all') return true;
    return b.connectionType === bridgeFilter;
  }) || [];

  const filteredQuestions = analysis?.missingQuestions.filter((q) => {
    if (questionFilter === 'all') return true;
    return q.impactLevel === questionFilter;
  }) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Title & Human Intro Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-teal-400 uppercase font-semibold mb-1.5">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>The Last 10% &middot; Digging deeper</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Discover what nobody is asking
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Ever notice how the same thing keeps happening, just with different people? Let&apos;s look under the hood, check our assumptions, and ask the questions that actually change the outcome.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowEvidenceModal(true)}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-2"
            title="Notice something new or have a thought that doesn't fit? Add it here."
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
            <span>Add what you noticed</span>
          </button>

          {onSaveToJourney && analysis && (
            <button
              type="button"
              onClick={handleSaveToJourneyLocal}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors flex items-center gap-2 ${
                savedSuccess
                  ? 'bg-teal-950/70 border-teal-500 text-teal-200'
                  : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
              }`}
            >
              {savedSuccess ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>Save this</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 5-View Connected Navigation Rail */}
      <div className="bg-slate-950/90 rounded-2xl p-1.5 border border-slate-800/90 flex flex-wrap items-center justify-between gap-1">
        {views.map((v) => {
          const Icon = v.icon;
          const isActive = currentView === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setCurrentView(v.id)}
              className={`flex-1 min-w-[120px] min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-teal-500/15 border border-teal-500/40 text-teal-200 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
              <span className="font-semibold">{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-12 rounded-3xl bg-slate-850/80 border border-slate-800 text-center space-y-3 animate-fadeIn">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-white">
            Running Missing Question Engine...
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Separating empirical facts from assumptions, auditing shared mechanisms, and synthesizing perspectives.
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-white">Notice:</span>
            <span>{error}</span>
          </div>
          <button
            onClick={() => handleRunAnalysis(query)}
            className="px-3 py-1 bg-rose-900/60 hover:bg-rose-900 rounded-lg text-white font-medium text-xs transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content Area: 5 Connected Views */}
      {!isLoading && analysis && (
        <main className="space-y-6 animate-fadeIn">
          {/* ========================================================= */}
          {/* VIEW 1: EXPLORE (Question, Ground Truth & Assumptions)    */}
          {/* ========================================================= */}
          {currentView === 'explore' && (
            <div className="space-y-6">
              {/* Question Intake Console */}
              <div className="bg-slate-850/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-5">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-1">
                    Stage 01 &middot; Problem &amp; Inquiry Intake
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-white">
                    What question, observation, or situation do you want to explore?
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRunAnalysis(query)}
                      placeholder="e.g. Why does history seem to repeat itself with different characters?"
                      className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-750 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-400 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRunAnalysis(query)}
                    className="min-h-[48px] px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                  >
                    <span>Analyze In Depth</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Curated Success Test Prompts */}
                <div className="pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-medium">
                    Test high-leverage inquiries:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CURATED_EXPLORATIONS.map((c, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setQuery(c.title);
                          handleRunAnalysis(c.title);
                        }}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                          query === c.title
                            ? 'bg-teal-950/60 border-teal-500/60 text-teal-200'
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="font-semibold text-white truncate max-w-sm sm:max-w-md">
                          &ldquo;{c.title}&rdquo;
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{c.tag}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Insight Synthesis Card */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl border border-teal-500/30 p-6 sm:p-7 shadow-lg space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Core Synthesis</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {analysis.topicTitle}
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                  {analysis.summaryInsight}
                </p>
              </div>

              {/* Known Facts vs Critical Assumptions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. What is Already Known */}
                <div className="bg-slate-850/80 rounded-3xl border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 font-serif text-lg font-semibold text-white">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                      <span>What Is Already Known</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {analysis.knownFacts.length} Verified Facts
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Firmly established, documented realities separated from subjective interpretation:
                  </p>

                  <div className="space-y-3">
                    {analysis.knownFacts.map((fact) => (
                      <div
                        key={fact.id}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 font-semibold">
                            {fact.sourceCategory.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Confidence: <strong className="text-white">{fact.verificationConfidence}</strong>
                          </span>
                        </div>
                        <p className="text-slate-200 font-medium leading-relaxed">
                          {fact.fact}
                        </p>
                        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 leading-normal">
                          <strong className="text-slate-300">Distinction:</strong> {fact.distinction}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. What is Being Assumed */}
                <div className="bg-slate-850/80 rounded-3xl border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 font-serif text-lg font-semibold text-white">
                      <ShieldAlert className="w-5 h-5 text-amber-400" />
                      <span>What Is Being Assumed</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {analysis.assumptions.length} Unverified Beliefs
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Unverified premises routinely taken for granted that introduce systematic blind spots:
                  </p>

                  <div className="space-y-3">
                    {analysis.assumptions.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                              item.riskLevel === 'critical'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {item.riskLevel} Risk
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Bias: {item.commonBias}
                          </span>
                        </div>
                        <p className="text-slate-200 font-medium leading-relaxed">
                          &ldquo;{item.assumption}&rdquo;
                        </p>
                        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 leading-normal">
                          <strong className="text-slate-300">Why unverified:</strong> {item.whyUnverified}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* View 1 Footer Continue */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  Ready to map cross-domain and historical parallels?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('bridge');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Step 2: Enter The Bridge</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: THE BRIDGE (Shared Mechanisms vs Shared Patterns) */}
          {/* ========================================================= */}
          {currentView === 'bridge' && (
            <div className="space-y-6">
              {/* Bridge Header & Philosophy Callout */}
              <div className="bg-slate-850/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-1">
                      Stage 02 &middot; Starting With What You Know &middot; The Bridge
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-white">
                      The Bridge: Everyday Parallels, Mechanisms &amp; Patterns
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      We always start with an experience from ordinary life you already recognize—work, traffic, cooking, sports, fixing things, or family dynamics—before exploring how the same pattern unfolds in history or science.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto text-xs">
                    <button
                      onClick={() => setBridgeFilter('all')}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                        bridgeFilter === 'all' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All ({analysis.bridges.length})
                    </button>
                    <button
                      onClick={() => setBridgeFilter('shared_mechanism')}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                        bridgeFilter === 'shared_mechanism' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Mechanisms
                    </button>
                    <button
                      onClick={() => setBridgeFilter('shared_pattern')}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                        bridgeFilter === 'shared_pattern' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Patterns
                    </button>
                  </div>
                </div>

                {/* Non-Negotiable Intelligence Rule Banner */}
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">The Familiar-to-Unfamiliar Principle: </strong>
                    Start with an everyday experience you already live. Show what connects it to your question, explain where the comparison stops working, and only then explore how the same pattern shows up in other fields. Never confuse a symbolic resemblance with a proven causal connection.
                  </div>
                </div>
              </div>

              {/* Interactive Bridges Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {filteredBridges.map((bridge) => {
                  const isSelected = selectedBridge?.id === bridge.id;
                  const isMechanism = bridge.connectionType === 'shared_mechanism';
                  return (
                    <button
                      key={bridge.id}
                      type="button"
                      onClick={() => setSelectedBridge(bridge)}
                      className={`text-left p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                        isSelected
                          ? 'bg-teal-950/40 border-teal-500 shadow-md ring-1 ring-teal-500/40'
                          : 'bg-slate-850/80 hover:bg-slate-800/80 border-slate-800'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                              isMechanism
                                ? 'bg-teal-500/20 text-teal-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {isMechanism ? '⚙️ Shared Mechanism' : '📈 Shared Pattern'}
                          </span>
                          <span
                            className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                              bridge.connectionStatus === 'supported'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}
                          >
                            {bridge.connectionStatus}
                          </span>
                        </div>

                        <div className="font-serif text-lg font-bold text-white">
                          {bridge.title}
                        </div>
                        <div className="text-xs text-teal-400 font-mono font-medium">
                          {bridge.domain}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                          {bridge.historicalOrScientificExample}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span>Tap to inspect differences &rarr;</span>
                        {isSelected && <span className="text-teal-400 font-bold">Active</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Bridge Inspector Card */}
              {selectedBridge && (
                <div className="bg-slate-900 rounded-3xl border border-slate-750 p-6 sm:p-8 space-y-6 shadow-xl animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <div className="text-xs font-mono uppercase text-teal-400 font-semibold mb-1">
                        Comparative Bridge Deep-Dive &middot; {selectedBridge.domain}
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-white">
                        {selectedBridge.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
                        Type: {selectedBridge.connectionType.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Underlying Dynamic */}
                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                        Underlying Dynamic / Mechanism
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-850 p-4 rounded-2xl border border-slate-800">
                        {selectedBridge.mechanismOrPatternDescription}
                      </p>
                    </div>

                    {/* Historical / Scientific Evidence */}
                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                        Documented Precedent or Evidence
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-850 p-4 rounded-2xl border border-slate-800">
                        {selectedBridge.historicalOrScientificExample}
                      </p>
                    </div>
                  </div>

                  {/* Disconfirming Evidence & Crucial Differences (Preventing False Equivalence) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2 p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40">
                      <div className="text-xs font-mono uppercase text-rose-300 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Crucial Difference (Where Comparison Breaks Down)</span>
                      </div>
                      <p className="text-xs text-rose-100 leading-relaxed">
                        {selectedBridge.crucialDifference}
                      </p>
                    </div>

                    <div className="space-y-2 p-4 rounded-2xl bg-sky-950/20 border border-sky-900/40">
                      <div className="text-xs font-mono uppercase text-sky-300 font-bold flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-sky-400" />
                        <span>Disconfirming Evidence Against Causal Overlap</span>
                      </div>
                      <p className="text-xs text-sky-100 leading-relaxed">
                        {selectedBridge.disconfirmingEvidence}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* View 2 Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('explore');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Explore</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('round_table');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Step 3: Convene The Round Table</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: THE ROUND TABLE (Multi-Perspective Network Nodes) */}
          {/* ========================================================= */}
          {currentView === 'round_table' && (
            <div className="space-y-6">
              {/* Round Table Header */}
              <div className="bg-slate-850/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-1">
                      Stage 03 &middot; Multi-Perspective Network
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-white">
                      The Round Table: No Single Perspective Dominates
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddPerspectiveModal(true)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Introduce Perspective</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Every perspective below contributes essential information, but no single lens controls the conclusion. Tap any node to inspect its specific contribution, evidence base, and inherent blind spot.
                </p>
              </div>

              {/* Orbital Nodes Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {analysis.roundTableNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedNode(node)}
                      className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-teal-950/50 border-teal-400 shadow-md ring-1 ring-teal-400'
                          : 'bg-slate-850 hover:bg-slate-800 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-semibold">
                            {node.archetype}
                          </span>
                          {node.customAdded && (
                            <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                              User Added
                            </span>
                          )}
                        </div>
                        <div className="font-serif text-base font-bold text-white">
                          {node.title}
                        </div>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {node.keyContribution}
                        </p>
                      </div>

                      <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800 flex items-center justify-between">
                        <span>{isSelected ? 'Currently Selected' : 'Tap to inspect'}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Node Inspector Panel */}
              {selectedNode && (
                <div className="bg-slate-900 rounded-3xl border border-slate-750 p-6 sm:p-8 space-y-5 shadow-xl animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-teal-400" />
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                        {selectedNode.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-teal-400 font-semibold">
                      {selectedNode.archetype}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                    {/* Key Contribution */}
                    <div className="space-y-1.5 bg-slate-850 p-4 rounded-2xl border border-slate-800">
                      <div className="text-xs font-mono uppercase text-teal-300 font-bold">
                        Key Information Contributed
                      </div>
                      <p className="text-slate-200 leading-relaxed font-sans">
                        {selectedNode.keyContribution}
                      </p>
                    </div>

                    {/* Evidence Brought */}
                    <div className="space-y-1.5 bg-slate-850 p-4 rounded-2xl border border-slate-800">
                      <div className="text-xs font-mono uppercase text-sky-300 font-bold">
                        Empirical Evidence &amp; Models Cited
                      </div>
                      <p className="text-slate-200 leading-relaxed font-sans">
                        {selectedNode.evidenceBrought}
                      </p>
                    </div>

                    {/* Blind Spot of This View Alone */}
                    <div className="space-y-1.5 bg-rose-950/20 p-4 rounded-2xl border border-rose-900/40">
                      <div className="text-xs font-mono uppercase text-rose-300 font-bold flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        <span>Blind Spot of This Lens Alone</span>
                      </div>
                      <p className="text-rose-100 leading-relaxed font-sans">
                        {selectedNode.blindSpotOfThisView}
                      </p>
                    </div>

                    {/* Competing Hypothesis */}
                    <div className="space-y-1.5 bg-amber-950/20 p-4 rounded-2xl border border-amber-900/40">
                      <div className="text-xs font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-amber-400" />
                        <span>Competing Counter-Hypothesis</span>
                      </div>
                      <p className="text-amber-100 leading-relaxed font-sans">
                        {selectedNode.competingHypothesis}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* View 3 Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('bridge');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to The Bridge</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('missing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Step 4: See What&apos;s Missing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 4: WHAT'S MISSING? (Prioritized Unanswered Questions) */}
          {/* ========================================================= */}
          {currentView === 'missing' && (
            <div className="space-y-6">
              {/* Header & Filter Controls */}
              <div className="bg-slate-850/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-1">
                      Stage 04 &middot; Unanswered High-Impact Inquiries
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-white">
                      What&apos;s Missing? Questions Nobody Has Considered
                    </h2>
                  </div>

                  {/* Impact Filters */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto text-xs">
                    <button
                      onClick={() => setQuestionFilter('all')}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                        questionFilter === 'all' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All ({analysis.missingQuestions.length})
                    </button>
                    <button
                      onClick={() => setQuestionFilter('transformational')}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                        questionFilter === 'transformational' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Transformational
                    </button>
                    <button
                      onClick={() => setQuestionFilter('high')}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                        questionFilter === 'high' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      High Impact
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  These questions are not academic riddles. Answering each of these questions could fundamentally overturn or confirm the working hypothesis.
                </p>
              </div>

              {/* Questions Cards List */}
              <div className="space-y-4">
                {filteredQuestions.map((q) => {
                  const isSelected = selectedQuestion?.id === q.id;
                  return (
                    <div
                      key={q.id}
                      className={`p-6 rounded-3xl border transition-all space-y-4 ${
                        isSelected
                          ? 'bg-slate-900 border-teal-500/60 shadow-lg'
                          : 'bg-slate-850/80 border-slate-800 hover:border-slate-750'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                                q.impactLevel === 'transformational'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {q.impactLevel} Impact
                            </span>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {q.category.replace('_', ' ')}
                            </span>
                            {q.canRealisticallyBeInvestigated ? (
                              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Realistically Testable</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-slate-400">
                                Theoretical Probe
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif text-lg sm:text-xl font-bold text-white pt-1">
                            &ldquo;{q.question}&rdquo;
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setNewEvidenceText(`Investigating missing question: "${q.question}" - `);
                            setShowEvidenceModal(true);
                          }}
                          className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
                          <span>Supply Evidence</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80 text-xs">
                        {/* What Answering This Changes */}
                        <div className="p-3.5 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-1">
                          <div className="text-[10px] font-mono uppercase text-teal-300 font-bold">
                            What Answering This Could Change
                          </div>
                          <p className="text-slate-200 leading-relaxed font-sans">
                            {q.whatAnsweringCouldChange}
                          </p>
                        </div>

                        {/* Practical Investigation Method */}
                        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            Practical Investigation Method
                          </div>
                          <p className="text-slate-300 leading-relaxed font-sans">
                            {q.investigationMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View 4 Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('round_table');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Round Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('final10');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Step 5: The Final 10% Action</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 5: THE FINAL 10% (Established, Uncertain, & Choice)  */}
          {/* ========================================================= */}
          {currentView === 'final10' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-slate-850/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-1">
                  Stage 05 &middot; Independent Conclusion &amp; Action
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  The Final 10%: Beyond the Screen
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Real understanding culminates in verifiable action. Here is what is established, what remains genuinely uncertain, and the single most useful choice point.
                </p>
              </div>

              {/* 3-Column Diagnostic Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. What is Established */}
                <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 font-serif text-base font-bold text-teal-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Established Truths</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysis.finalTenPercent.establishedTruths.map((truth, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-teal-400 font-bold">&bull;</span>
                        <span>{truth}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. What Remains Uncertain */}
                <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 font-serif text-base font-bold text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>What Remains Uncertain</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysis.finalTenPercent.whatRemainsUncertain.map((unc, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-amber-400 font-bold">&bull;</span>
                        <span>{unc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. New Possibilities Emerged */}
                <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 font-serif text-base font-bold text-sky-300">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>New Possibilities</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysis.finalTenPercent.newPossibilitiesEmerged.map((poss, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-sky-400 font-bold">&bull;</span>
                        <span>{poss}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* The Practical Next Action & Choice Point Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950/40 rounded-3xl border border-teal-500/40 p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>Practical Outside Action &middot; The Choice Point</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    {analysis.finalTenPercent.practicalNextAction.actionTitle}
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Step */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                      Concrete Next Step:
                    </div>
                    <p className="text-slate-200 leading-relaxed font-sans">
                      {analysis.finalTenPercent.practicalNextAction.actionStep}
                    </p>
                  </div>

                  {/* Outcome Test */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="text-[11px] font-mono uppercase text-teal-400 font-bold">
                      Real-World Outcome Test (How to verify outside the app):
                    </div>
                    <p className="text-slate-200 leading-relaxed font-sans">
                      {analysis.finalTenPercent.practicalNextAction.outcomeTest}
                    </p>
                  </div>

                  {/* Choice Point: Changing the Outcome */}
                  <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/50 space-y-1">
                    <div className="text-[11px] font-mono uppercase text-teal-300 font-bold">
                      Choice Point: How a New Choice Changes the Recurring Outcome
                    </div>
                    <p className="text-teal-100 leading-relaxed font-sans font-medium">
                      {analysis.finalTenPercent.practicalNextAction.choicePoint}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {onSaveToJourney && (
                    <button
                      type="button"
                      onClick={handleSaveToJourneyLocal}
                      className="min-h-[44px] px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>{savedSuccess ? 'Saved to Your Journey!' : 'Save This Action to My Journey'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowEvidenceModal(true)}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4 text-teal-400" />
                    <span>Record Outcome / Add New Evidence</span>
                  </button>

                  {onNavigateToUnderstand && (
                    <button
                      type="button"
                      onClick={() => onNavigateToUnderstand(analysis.topicTitle)}
                      className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      <span>Explore Everyday Mechanical Analogy</span>
                    </button>
                  )}
                </div>
              </div>

              {/* View 5 Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('missing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to What&apos;s Missing</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('explore');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-teal-400" />
                  <span>Start New Inquiry</span>
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* MODAL 1: ADD EVIDENCE / REVISE ANALYSIS */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-750 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-serif text-lg font-bold text-white">
                <PlusCircle className="w-5 h-5 text-teal-400" />
                <span>Introduce New Evidence / Observation</span>
              </div>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              When new empirical observations or disconfirming records arise, the engine re-evaluates its working hypotheses and generates updated missing questions.
            </p>

            <form onSubmit={handleUpdateEvidence} className="space-y-4">
              <textarea
                value={newEvidenceText}
                onChange={(e) => setNewEvidenceText(e.target.value)}
                placeholder="Describe your newly observed fact, counter-example, or outcome test result..."
                rows={4}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-teal-400 transition-colors"
                required
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEvidenceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingEvidence}
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isUpdatingEvidence ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Revising Analysis...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INTRODUCE ROUND TABLE PERSPECTIVE */}
      {showAddPerspectiveModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-750 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-serif text-lg font-bold text-white">
                <Users className="w-5 h-5 text-teal-400" />
                <span>Introduce New Perspective</span>
              </div>
              <button
                onClick={() => setShowAddPerspectiveModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Add an explanatory lens (e.g. Legal Precedent, Supply Chain Architecture, Anthropology) to the Round Table.
            </p>

            <form onSubmit={handleAddCustomPerspective} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Perspective Title:</label>
                <input
                  type="text"
                  value={newPerspectiveTitle}
                  onChange={(e) => setNewPerspectiveTitle(e.target.value)}
                  placeholder="e.g. Constitutional Jurisprudence"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Key Contribution &amp; Lens:</label>
                <textarea
                  value={newPerspectiveContribution}
                  onChange={(e) => setNewPerspectiveContribution(e.target.value)}
                  placeholder="What unique structural data or principle does this perspective illuminate?"
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPerspectiveModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
                >
                  Seat at Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
