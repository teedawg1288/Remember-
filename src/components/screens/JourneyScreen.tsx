import React, { useState } from 'react';
import { TranslationResult, SavedJourneyItem } from '../../types/translation';
import { useAuth } from '../../context/AuthContext';
import {
  Bookmark,
  Trash2,
  Download,
  Share2,
  ArrowRight,
  Clock,
  BookOpen,
  Edit3,
  Check,
  HelpCircle,
  Shield,
  Cloud,
  Layers,
  Sparkles
} from 'lucide-react';

interface JourneyScreenProps {
  savedItems: SavedJourneyItem[];
  onSelectTranslation: (item: TranslationResult) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onNavigateToDiscover: () => void;
}

export const JourneyScreen: React.FC<JourneyScreenProps> = ({
  savedItems,
  onSelectTranslation,
  onUpdateNotes,
  onRemoveItem,
  onClearAll,
  onNavigateToDiscover,
}) => {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notesBuffer, setNotesBuffer] = useState('');
  const [exported, setExported] = useState(false);

  const handleStartEdit = (item: SavedJourneyItem) => {
    setEditingId(item.id);
    setNotesBuffer(item.userNotes || '');
  };

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, notesBuffer);
    setEditingId(null);
  };

  const handleExportAll = () => {
    if (savedItems.length === 0) return;
    const content = `# MY LEARNING JOURNEY — THE LAST 10%
Exported on ${new Date().toLocaleDateString()}

${savedItems
  .map(
    (item, idx) => `## ${idx + 1}. ${item.topic}
*Translated through: ${item.domain}*
*Date: ${item.savedAt}*

> ${item.headline}

### In My Own Words:
${item.userNotes || 'No notes added yet.'}

### Unresolved Questions:
${(item.unresolvedQuestions || []).map((q) => `- ${q}`).join('\n') || 'None recorded.'}

---`
  )
  .join('\n\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `the-last-10-percent-journey-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-8">
      {/* Editorial Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-6 sm:p-9 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
            <span>Screen 06</span>
            <span>·</span>
            <span>My Journey</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Your Personal Knowledge Library
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Record what clicked in your own words, keep track of remaining open questions, 
            and revisit insights whenever you need them.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-teal-300">
            <Cloud className="w-3.5 h-3.5" />
            <span>
              {user
                ? `Synced to cloud account (${user.email})`
                : 'Stored privately in local browser'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Toolbar */}
      {savedItems.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-mono text-slate-500 font-medium">
            {savedItems.length} {savedItems.length === 1 ? 'saved inquiry' : 'saved inquiries'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAll}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exported ? 'Exported!' : 'Export Markdown'}</span>
            </button>

            <button
              onClick={onClearAll}
              className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      )}

      {/* Saved Inquiries List */}
      {savedItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-slate-800">
            No Saved Discoveries Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            When you explore a translation, tap the &ldquo;Save&rdquo; bookmark to capture your understanding and record notes here.
          </p>
          <button
            onClick={onNavigateToDiscover}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            Start an Inquiry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-teal-800 font-semibold">
                    Through: {item.domain} · {item.savedAt}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-slate-900">
                    {item.topic}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 italic">
                    &ldquo;{item.headline}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.translation && (
                    <button
                      onClick={() => onSelectTranslation(item.translation!)}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>Reopen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* In My Own Words editable notes */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-teal-700" />
                    <span>In My Own Words:</span>
                  </span>

                  {editingId !== item.id && (
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="text-[11px] text-teal-800 hover:underline font-medium"
                    >
                      {item.userNotes ? 'Edit Notes' : '+ Add your explanation'}
                    </button>
                  )}
                </div>

                {editingId === item.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={notesBuffer}
                      onChange={(e) => setNotesBuffer(e.target.value)}
                      placeholder="Write your explanation or takeaways in your own words..."
                      className="w-full p-3 rounded-xl border border-slate-300 focus:border-slate-900 text-xs text-slate-900 bg-white"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 rounded-lg text-xs text-slate-600 hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(item.id)}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {item.userNotes || (
                      <span className="text-slate-400 italic">
                        No personal notes recorded yet. Putting it in your own words locks in comprehension.
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Outside-App Practical Action (if saved) */}
              {item.practicalOutsideAction && (
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-teal-900">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    <span>Practical Outside Action: {item.practicalOutsideAction.title}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{item.practicalOutsideAction.description}</p>
                  <div className="text-[11px] text-teal-850 font-medium bg-white/70 p-2 rounded-xl border border-teal-200/60">
                    <span className="font-semibold text-teal-950">How to verify it worked: </span>
                    {item.practicalOutsideAction.verificationStep}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Privacy Guarantee Note */}
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Shield className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-slate-900 block">
            Private & User-Controlled Knowledge
          </span>
          <p>
            Your journey notes belong solely to you. We do not use your private personal reflections 
            to train models or share them with third parties. You can export or delete your history at any time.
          </p>
        </div>
      </div>
    </div>
  );
};
