import React, { useState, useEffect } from 'react';
import { SavedJourneyItem, TestablePredictionRecord, AutonomousDiscoveryJob } from '../../types/translation';
import { useAuth } from '../../context/AuthContext';
import { AutonomousDiscoveryCard } from '../AutonomousDiscoveryCard';
import {
  Bookmark,
  Trash2,
  Download,
  Edit3,
  Check,
  Eye,
  MessageSquare,
  Search,
  Sparkles,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  RefreshCw,
  Zap,
  Activity,
  Layers,
  ShieldAlert,
} from 'lucide-react';

interface MyDiscoveriesScreenProps {
  savedItems: SavedJourneyItem[];
  onOpenInTalk: (item: SavedJourneyItem) => void;
  onOpenInShowMe: (item: SavedJourneyItem) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onNavigateToTalk: () => void;
  onUpdatePredictionRecord?: (id: string, record: TestablePredictionRecord) => void;
  onSaveItem?: (item: SavedJourneyItem) => void;
  initialTab?: 'all' | 'autonomous' | 'predictions';
}

export const MyDiscoveriesScreen: React.FC<MyDiscoveriesScreenProps> = ({
  savedItems,
  onOpenInTalk,
  onOpenInShowMe,
  onUpdateNotes,
  onRemoveItem,
  onClearAll,
  onNavigateToTalk,
  onUpdatePredictionRecord,
  onSaveItem,
  initialTab = 'all',
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'autonomous' | 'predictions'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notesBuffer, setNotesBuffer] = useState('');
  const [exported, setExported] = useState(false);

  // Autonomous Discovery Engine State
  const [autonomousJobs, setAutonomousJobs] = useState<AutonomousDiscoveryJob[]>([]);
  const [discoveryStats, setDiscoveryStats] = useState<any>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchAutonomousJobs = async () => {
    try {
      setIsLoadingJobs(true);
      const res = await fetch('/api/discovery-jobs');
      if (res.ok) {
        const data = await res.json();
        setAutonomousJobs(data.jobs || []);
        setDiscoveryStats(data.stats || null);
      }
    } catch (err) {
      console.warn('Failed to fetch autonomous discovery jobs:', err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchAutonomousJobs();
    const interval = setInterval(fetchAutonomousJobs, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerAutonomous = async () => {
    try {
      setIsTriggering(true);
      const res = await fetch('/api/discovery-jobs/trigger', { method: 'POST' });
      if (res.ok) {
        await fetchAutonomousJobs();
        setActiveTab('autonomous');
      }
    } catch (err) {
      console.error('Failed to trigger autonomous discovery:', err);
    } finally {
      setIsTriggering(false);
    }
  };

  const handleApproveAutonomous = async (id: string) => {
    try {
      setApprovingId(id);
      const res = await fetch(`/api/discovery-jobs/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        await fetchAutonomousJobs();
      }
    } catch (err) {
      console.error('Failed to approve discovery:', err);
    } finally {
      setApprovingId(null);
    }
  };

  const handleDismissAutonomous = async (id: string) => {
    try {
      await fetch(`/api/discovery-jobs/${id}/dismiss`, { method: 'POST' });
      setAutonomousJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error('Failed to dismiss discovery:', err);
    }
  };

  const handleSaveAutonomousToDiscoveries = async (job: AutonomousDiscoveryJob) => {
    try {
      await fetch(`/api/discovery-jobs/${job.id}/toggle-save`, { method: 'POST' });
      const syntheticItem: SavedJourneyItem = {
        id: `auto-${job.id}`,
        topic: job.title,
        domain: `${job.primaryFieldA} & ${job.primaryFieldB}`,
        headline: job.plainEnglishSummary,
        savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        userNotes: `Autonomous Discovery: "${job.conversationalHeadline}"\n\nUnasked Question: ${job.unaskedQuestionDiscovered}\n\nComputational Verdict: ${job.calculationVerdict}`,
        autonomousJob: job,
      };
      if (onSaveItem) {
        onSaveItem(syntheticItem);
      }
      setAutonomousJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, isSavedToDiscoveries: !j.isSavedToDiscoveries } : j))
      );
    } catch (err) {
      console.error('Failed to save autonomous discovery:', err);
    }
  };

  // Modal / Form state for logging actual prediction outcome
  const [evaluatingItemId, setEvaluatingItemId] = useState<string | null>(null);
  const [actualResultInput, setActualResultInput] = useState('');
  const [outcomeMatchInput, setOutcomeMatchInput] = useState<'confirmed' | 'partially_confirmed' | 'diverged'>('confirmed');
  const [learningNoteInput, setLearningNoteInput] = useState('');

  const filteredItems = savedItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.topic.toLowerCase().includes(q) ||
      item.domain.toLowerCase().includes(q) ||
      item.headline.toLowerCase().includes(q) ||
      (item.userNotes && item.userNotes.toLowerCase().includes(q)) ||
      (item.testableRecord && item.testableRecord.predictionSummary.toLowerCase().includes(q))
    );
  });

  const filteredAutonomousJobs = autonomousJobs.filter((job) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.plainEnglishSummary.toLowerCase().includes(q) ||
      job.unansweredQuestion.toLowerCase().includes(q) ||
      job.unaskedQuestionDiscovered.toLowerCase().includes(q) ||
      job.primaryFieldA.toLowerCase().includes(q) ||
      job.primaryFieldB.toLowerCase().includes(q) ||
      job.conversationalHeadline.toLowerCase().includes(q)
    );
  });

  const predictionItems = savedItems.filter((item) =>
    Boolean(item.testableRecord || (item.predictions && item.predictions.length > 0))
  );

  const evaluatedCount = predictionItems.filter(
    (item) => item.testableRecord?.actualResult && item.testableRecord.outcomeMatch !== 'pending'
  ).length;

  const confirmedCount = predictionItems.filter(
    (item) => item.testableRecord?.outcomeMatch === 'confirmed'
  ).length;

  const handleStartEdit = (item: SavedJourneyItem) => {
    setEditingId(item.id);
    setNotesBuffer(item.userNotes || '');
  };

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, notesBuffer);
    setEditingId(null);
  };

  const handleStartEvaluating = (item: SavedJourneyItem) => {
    setEvaluatingItemId(item.id);
    setActualResultInput(item.testableRecord?.actualResult || '');
    setOutcomeMatchInput(
      item.testableRecord?.outcomeMatch && item.testableRecord.outcomeMatch !== 'pending'
        ? item.testableRecord.outcomeMatch
        : 'confirmed'
    );
    setLearningNoteInput(item.testableRecord?.learningNote || '');
  };

  const handleSaveEvaluation = (item: SavedJourneyItem) => {
    if (!actualResultInput.trim() || !onUpdatePredictionRecord) return;

    const basePred = item.predictions?.[0];
    const updatedRecord: TestablePredictionRecord = {
      id: item.testableRecord?.id || basePred?.id || `pred-${Date.now()}`,
      topic: item.topic,
      dateCreated: item.testableRecord?.dateCreated || item.savedAt,
      predictionSummary: item.testableRecord?.predictionSummary || basePred?.scenario || item.headline,
      assumptions: item.testableRecord?.assumptions || basePred?.influencingFactors || [],
      whatCouldChangeIt: item.testableRecord?.whatCouldChangeIt || basePred?.whatCouldChangeIt || '',
      howToTest: item.testableRecord?.howToTest || basePred?.verificationTest.howWeFindOut || '',
      falsificationCriteria: item.testableRecord?.falsificationCriteria || basePred?.verificationTest.falsificationSign || '',
      actualResult: actualResultInput.trim(),
      actualResultDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      outcomeMatch: outcomeMatchInput,
      learningNote: learningNoteInput.trim() || 'Logged for prediction error analysis and calibration.',
    };

    onUpdatePredictionRecord(item.id, updatedRecord);
    setEvaluatingItemId(null);
  };

  const handleExportAll = () => {
    if (savedItems.length === 0) return;
    const content = `# MY DISCOVERIES & PREDICTIONS — THE LAST 10%
Exported on ${new Date().toLocaleDateString()}

${savedItems
  .map(
    (item, idx) => `## ${idx + 1}. ${item.topic}
*Explained through: ${item.domain}*
*Date Saved: ${item.savedAt}*

> ${item.headline}

### In My Own Words:
${item.userNotes || 'No notes added yet.'}

### Testable Prediction & Outcome:
${
  item.testableRecord
    ? `**Predicted:** ${item.testableRecord.predictionSummary}
**How We'd Find Out:** ${item.testableRecord.howToTest}
**What Proves It Wrong:** ${item.testableRecord.falsificationCriteria}
**Actual Result:** ${item.testableRecord.actualResult || 'Pending verification'}
**Status:** ${item.testableRecord.outcomeMatch || 'pending'}
**Learning:** ${item.testableRecord.learningNote || 'N/A'}`
    : 'No testable prediction recorded.'
}

---`
  )
  .join('\n\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-discoveries-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              <Bookmark className="w-3.5 h-3.5" />
              <span>My Discoveries</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Saved Conversations & Predictions
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Revisit what you&apos;ve explored, track testable predictions, and log real-world results.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {savedItems.length > 0 && (
              <button
                type="button"
                onClick={handleExportAll}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
                title="Export your discoveries and predictions"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>{exported ? 'Exported!' : 'Export'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNavigateToTalk}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>New Conversation</span>
            </button>
          </div>
        </div>

        {/* View Filter Tabs: All Discoveries vs Autonomous Discoveries vs Predictions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'all'
                ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>All Discoveries ({savedItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('autonomous')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all relative ${
              activeTab === 'autonomous'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Autonomous Engine ({autonomousJobs.length})</span>
            {discoveryStats?.pendingApprovalCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-mono font-bold animate-pulse">
                {discoveryStats.pendingApprovalCount} approval
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('predictions')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'predictions'
                ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Predictions ({predictionItems.length})</span>
            {evaluatedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-sky-200 font-mono">
                {evaluatedCount} eval
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        {(savedItems.length > 0 || autonomousJobs.length > 0) && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'autonomous'
                  ? 'Search autonomous investigations, formulas, unasked questions...'
                  : 'Search by topic, everyday example, notes, or predictions...'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/60"
            />
          </div>
        )}
      </div>

      {/* Main Tab Views */}
      {activeTab === 'autonomous' ? (
        /* TAB: INDEPENDENT AUTONOMOUS DISCOVERY ENGINE */
        <div className="space-y-5 animate-fadeIn">
          {/* Engine Status & Control Bar */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    Independent Discovery Engine
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Autonomous Background Job
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Investigates unanswered questions across different fields on its own — looking for questions nobody thought to ask, testing connections through genuine calculations, and distinguishing documented facts from hypotheses.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleTriggerAutonomous}
                  disabled={isTriggering}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
                  title="Run an immediate independent discovery cycle right now"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTriggering ? 'animate-spin' : ''}`} />
                  <span>{isTriggering ? 'Investigating...' : 'Investigate Knowledge Gap'}</span>
                </button>
              </div>
            </div>

            {/* Live Telemetry Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/80 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Total Investigated</span>
                <span className="text-base font-bold text-white">{discoveryStats?.totalInvestigated || autonomousJobs.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-emerald-400 block uppercase">Survived Calculations</span>
                <span className="text-base font-bold text-emerald-300">{discoveryStats?.survivedCalculations || 0}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-amber-400 block uppercase">Refuted Metaphors</span>
                <span className="text-base font-bold text-amber-300">{discoveryStats?.refutedMetaphors || 0}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-purple-400 block uppercase">Human Approvals</span>
                <span className="text-base font-bold text-purple-300">{discoveryStats?.approvedByHuman || 0}</span>
              </div>
            </div>
          </div>

          {/* Pending Approval Gate Alert */}
          {discoveryStats?.pendingApprovalCount > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-800/60 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Spending & Safety Control: Deep Investigation Awaiting Your Approval</span>
              </div>
              <p className="text-amber-200/90 leading-relaxed text-[11px] sm:text-xs">
                To prevent uncontrolled background API calls and keep usage affordable, multi-field recursive investigations pause until you explicitly approve them. Review the flagged cards below to approve or dismiss.
              </p>
            </div>
          )}

          {/* List of Autonomous Discoveries */}
          {filteredAutonomousJobs.length > 0 ? (
            <div className="space-y-5">
              {filteredAutonomousJobs.map((job) => (
                <AutonomousDiscoveryCard
                  key={job.id}
                  job={job}
                  onOpenInTalk={onOpenInTalk}
                  onOpenInShowMe={onOpenInShowMe}
                  onSaveToDiscoveries={handleSaveAutonomousToDiscoveries}
                  onDismiss={handleDismissAutonomous}
                  onApprove={handleApproveAutonomous}
                  isSaved={job.isSavedToDiscoveries}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <Cpu className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400 font-mono">
                {searchQuery
                  ? 'No autonomous discoveries matched your search query.'
                  : 'No autonomous discoveries recorded yet.'}
              </p>
              <button
                type="button"
                onClick={handleTriggerAutonomous}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Trigger First Investigation
              </button>
            </div>
          )}
        </div>
      ) : activeTab === 'predictions' ? (
        /* TAB 2: PREDICTIONS & OUTCOMES TRACKER */
        <div className="space-y-4">
          {/* Accuracy & Calibration Banner */}
          <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-sky-200">
              <TrendingUp className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                <strong>Prediction Calibration:</strong> {evaluatedCount} of {predictionItems.length} predictions evaluated.{' '}
                {evaluatedCount > 0 && `${confirmedCount} confirmed.`}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Use actual results to refine future forecasts.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {predictionItems.map((item) => {
              const rec = item.testableRecord || {
                id: item.predictions?.[0]?.id || `pred-${item.id}`,
                topic: item.topic,
                dateCreated: item.savedAt,
                predictionSummary: item.predictions?.[0]?.scenario || item.headline,
                assumptions: item.predictions?.[0]?.influencingFactors || [],
                whatCouldChangeIt: item.predictions?.[0]?.whatCouldChangeIt || '',
                howToTest: item.predictions?.[0]?.verificationTest.howWeFindOut || '',
                falsificationCriteria: item.predictions?.[0]?.verificationTest.falsificationSign || '',
                outcomeMatch: 'pending' as const,
              };

              const isEvaluating = evaluatingItemId === item.id;
              const isEvaluated = Boolean(rec.actualResult && rec.outcomeMatch !== 'pending');

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg hover:border-sky-900/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-mono text-sky-400 uppercase tracking-wider block font-bold">
                        {item.topic}
                      </span>
                      <span className="text-xs text-slate-400">
                        Everyday Lens: <strong className="text-slate-300 font-medium">{item.domain}</strong> &bull; Saved {item.savedAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                          rec.outcomeMatch === 'confirmed'
                            ? 'bg-teal-950 text-teal-300 border-teal-800'
                            : rec.outcomeMatch === 'partially_confirmed'
                            ? 'bg-sky-950 text-sky-300 border-sky-800'
                            : rec.outcomeMatch === 'diverged'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {rec.outcomeMatch === 'confirmed'
                          ? 'Confirmed'
                          : rec.outcomeMatch === 'partially_confirmed'
                          ? 'Partially Confirmed'
                          : rec.outcomeMatch === 'diverged'
                          ? 'Diverged'
                          : 'Pending Outcome'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-mono text-[11px] uppercase block">
                        Predicted Scenario
                      </span>
                      <p className="text-slate-100 font-medium mt-0.5 leading-relaxed">
                        {rec.predictionSummary}
                      </p>
                    </div>

                    {rec.assumptions && rec.assumptions.length > 0 && (
                      <div>
                        <span className="text-slate-400 font-mono text-[11px] uppercase block">
                          Key Working Assumptions
                        </span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5 mt-0.5">
                          {rec.assumptions.map((assump, idx) => (
                            <li key={idx}>{assump}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-teal-400 font-mono text-[10px] uppercase font-bold block flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          How We Would Find Out
                        </span>
                        <p className="text-slate-300 text-[11px]">{rec.howToTest}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-amber-400 font-mono text-[10px] uppercase font-bold block flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          What Proves It Wrong
                        </span>
                        <p className="text-slate-300 text-[11px]">{rec.falsificationCriteria}</p>
                      </div>
                    </div>
                  </div>

                  {/* Outcome Evaluation Form */}
                  <div className="pt-3 border-t border-slate-800">
                    {isEvaluating ? (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700 space-y-3 animate-fadeIn">
                        <h4 className="font-bold text-xs text-white">Log Actual Real-World Outcome</h4>
                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-400 font-mono uppercase block">
                            What actually happened in the real world?
                          </label>
                          <textarea
                            value={actualResultInput}
                            onChange={(e) => setActualResultInput(e.target.value)}
                            placeholder="Describe what occurred when tested..."
                            rows={2}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-400 font-mono uppercase block">
                            Did the outcome match the prediction?
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => setOutcomeMatchInput('confirmed')}
                              className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-colors ${
                                outcomeMatchInput === 'confirmed'
                                  ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}
                            >
                              Confirmed
                            </button>
                            <button
                              type="button"
                              onClick={() => setOutcomeMatchInput('partially_confirmed')}
                              className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-colors ${
                                outcomeMatchInput === 'partially_confirmed'
                                  ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}
                            >
                              Partially
                            </button>
                            <button
                              type="button"
                              onClick={() => setOutcomeMatchInput('diverged')}
                              className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-colors ${
                                outcomeMatchInput === 'diverged'
                                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}
                            >
                              Diverged
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-400 font-mono uppercase block">
                            Calibration Note (What did we learn?)
                          </label>
                          <input
                            type="text"
                            value={learningNoteInput}
                            onChange={(e) => setLearningNoteInput(e.target.value)}
                            placeholder="What variable did we overlook?"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEvaluatingItemId(null)}
                            className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEvaluation(item)}
                            className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                          >
                            Save Outcome
                          </button>
                        </div>
                      </div>
                    ) : isEvaluated ? (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] text-slate-400 uppercase">
                            Evaluated on {rec.actualResultDate}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStartEvaluating(item)}
                            className="text-teal-400 hover:text-teal-300 font-mono text-[11px] flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                        <p className="text-slate-200">
                          <strong>Outcome:</strong> {rec.actualResult}
                        </p>
                        {rec.learningNote && (
                          <p className="text-slate-400 text-[11px] italic">
                            &ldquo;{rec.learningNote}&rdquo;
                          </p>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartEvaluating(item)}
                        className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-sky-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-sky-400" />
                        <span>Log What Actually Happened In Real Life</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : savedItems.length === 0 ? (
        /* TAB 1 EMPTY STATE */
        <div className="bg-slate-850 rounded-3xl border border-slate-800 p-10 sm:p-14 text-center space-y-4 max-w-lg mx-auto my-6">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">No Personal Discoveries Saved Yet</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
            When you explore an idea in Let&apos;s Talk or Show Me, tap &ldquo;Save&rdquo; to keep the conversation in your journal. You can also explore what the engine investigated on its own!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('autonomous')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              <Cpu className="w-4 h-4" />
              <span>Explore Autonomous Discoveries ({autonomousJobs.length})</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToTalk}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium text-xs sm:text-sm transition-all border border-slate-700"
            >
              Start a Conversation
            </button>
          </div>
        </div>
      ) : (
        /* TAB 1: ALL DISCOVERIES & CONVERSATIONS */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <span>
              Showing {filteredItems.length} of {savedItems.length} discovery
              {savedItems.length === 1 ? '' : 'ies'}
            </span>
            {savedItems.length > 1 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-slate-500 hover:text-rose-400 text-xs transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider block">
                      Explained through: {item.domain}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                      {item.topic}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  {item.headline}
                </p>

                {/* Notes Section */}
                <div className="space-y-2 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium">My Notes & Reflections:</span>
                    {editingId !== item.id && (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="text-teal-400 hover:text-teal-300 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{item.userNotes ? 'Edit' : 'Add Note'}</span>
                      </button>
                    )}
                  </div>

                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={notesBuffer}
                        onChange={(e) => setNotesBuffer(e.target.value)}
                        placeholder="Write down what clicked for you, or a situation you want to test this on..."
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(item.id)}
                          className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    item.userNotes && (
                      <p className="text-xs sm:text-sm text-amber-200/90 italic bg-amber-950/20 p-2.5 rounded-xl border border-amber-900/30">
                        &ldquo;{item.userNotes}&rdquo;
                      </p>
                    )
                  )}
                </div>

                {/* Testable Prediction Badge if present */}
                {item.testableRecord && (
                  <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-900/30 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sky-300">
                      <GitBranch className="w-3.5 h-3.5 text-sky-400" />
                      <span className="font-mono text-[11px] truncate max-w-xs sm:max-w-md">
                        Prediction: {item.testableRecord.predictionSummary}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {item.testableRecord.outcomeMatch === 'confirmed'
                        ? 'Confirmed'
                        : item.testableRecord.outcomeMatch === 'partially_confirmed'
                        ? 'Partially Right'
                        : item.testableRecord.outcomeMatch === 'diverged'
                        ? 'Diverged'
                        : 'Pending'}
                    </span>
                  </div>
                )}

                {/* Action Buttons to reopen */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">Saved {item.savedAt}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenInTalk(item)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                      <span>Talk About This</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenInShowMe(item)}
                      className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show Me Visuals</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
