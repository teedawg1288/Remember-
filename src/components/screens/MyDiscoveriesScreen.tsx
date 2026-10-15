import React, { useState } from 'react';
import { SavedJourneyItem, TestablePredictionRecord } from '../../types/translation';
import { useAuth } from '../../context/AuthContext';
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
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'predictions'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notesBuffer, setNotesBuffer] = useState('');
  const [exported, setExported] = useState(false);

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

        {/* View Filter Tabs: All Discoveries vs Predictions & Outcomes Tracker */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'all'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>All Discoveries ({savedItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('predictions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'predictions'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Testable Predictions ({predictionItems.length})</span>
            {evaluatedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-sky-200 font-mono">
                {evaluatedCount} evaluated
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        {savedItems.length > 0 && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, everyday example, notes, or predictions..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/60"
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedItems.length === 0 ? (
        <div className="bg-slate-850 rounded-3xl border border-slate-800 p-10 sm:p-14 text-center space-y-4 max-w-lg mx-auto my-6">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">No Discoveries Saved Yet</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
            When you explore an idea in Let&apos;s Talk or Show Me, tap &ldquo;Save&rdquo; to keep the conversation, prediction, and testable criteria in your tracker.
          </p>
          <button
            type="button"
            onClick={onNavigateToTalk}
            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-teal-500/20"
          >
            Start a Conversation
          </button>
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
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : rec.outcomeMatch === 'diverged'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {rec.outcomeMatch === 'confirmed'
                          ? 'Outcome Confirmed'
                          : rec.outcomeMatch === 'partially_confirmed'
                          ? 'Partially Confirmed'
                          : rec.outcomeMatch === 'diverged'
                          ? 'Diverged / Proved Wrong'
                          : 'Pending Result'}
                      </span>
                    </div>
                  </div>

                  {/* Prediction Summary */}
                  <div className="space-y-1.5">
                    <span className="text-sky-300 font-bold block text-xs font-mono uppercase">
                      Here&apos;s what was predicted:
                    </span>
                    <p className="text-sm font-semibold text-white leading-snug">
                      {rec.predictionSummary}
                    </p>
                  </div>

                  {/* Verification Criteria */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-bold block font-mono text-[11px] uppercase">
                        How to find out:
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {rec.howToTest}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                      <span className="text-rose-400 font-bold block font-mono text-[11px] uppercase">
                        What proves this wrong:
                      </span>
                      <p className="text-rose-200/90 text-[11px] leading-relaxed">
                        {rec.falsificationCriteria}
                      </p>
                    </div>
                  </div>

                  {/* Actual Result Section */}
                  {isEvaluated && !isEvaluating ? (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-teal-400 font-bold font-mono text-[11px] uppercase">
                          Actual Result Logged ({rec.actualResultDate}):
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStartEvaluating(item)}
                          className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Result</span>
                        </button>
                      </div>
                      <p className="text-white text-sm font-medium leading-relaxed">
                        {rec.actualResult}
                      </p>
                      {rec.learningNote && (
                        <p className="text-slate-300 text-xs italic pt-1 border-t border-slate-900">
                          <strong>Learning Note:</strong> {rec.learningNote}
                        </p>
                      )}
                    </div>
                  ) : isEvaluating ? (
                    /* Inline Result Logging Form */
                    <div className="p-4 rounded-2xl bg-slate-950 border border-sky-800/80 space-y-3 text-xs animate-fadeIn">
                      <span className="font-bold text-white text-xs sm:text-sm block">
                        Record What Really Happened:
                      </span>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold block">
                          What actually occurred in reality?
                        </label>
                        <textarea
                          value={actualResultInput}
                          onChange={(e) => setActualResultInput(e.target.value)}
                          placeholder="Describe the concrete outcome that took place..."
                          rows={2}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold block">
                          Did the prediction hold?
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setOutcomeMatchInput('confirmed')}
                            className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                              outcomeMatchInput === 'confirmed'
                                ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold'
                                : 'bg-slate-900 text-slate-300 border-slate-800'
                            }`}
                          >
                            Confirmed
                          </button>
                          <button
                            type="button"
                            onClick={() => setOutcomeMatchInput('partially_confirmed')}
                            className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                              outcomeMatchInput === 'partially_confirmed'
                                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                                : 'bg-slate-900 text-slate-300 border-slate-800'
                            }`}
                          >
                            Partially Right
                          </button>
                          <button
                            type="button"
                            onClick={() => setOutcomeMatchInput('diverged')}
                            className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                              outcomeMatchInput === 'diverged'
                                ? 'bg-rose-500 text-slate-950 border-rose-400 font-bold'
                                : 'bg-slate-900 text-slate-300 border-slate-800'
                            }`}
                          >
                            Diverged / Wrong
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold block">
                          What does this teach us for future predictions?
                        </label>
                        <input
                          type="text"
                          value={learningNoteInput}
                          onChange={(e) => setLearningNoteInput(e.target.value)}
                          placeholder="e.g. Overestimated speed of delay wave; emotional safety mattered more than logic..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEvaluatingItemId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEvaluation(item)}
                          disabled={!actualResultInput.trim()}
                          className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs"
                        >
                          Save Actual Outcome
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500 font-mono">
                        Awaiting real-world verification
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStartEvaluating(item)}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/40 text-xs font-semibold transition-all"
                      >
                        Log What Really Happened
                      </button>
                    </div>
                  )}

                  {/* Bottom reopen actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenInTalk(item)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                        <span>Talk</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenInShowMe(item)}
                        className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show Me</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
