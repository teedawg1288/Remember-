import React, { useState } from 'react';
import { BookOpen, Plus, Pencil, Trash2, X, Save } from 'lucide-react';

export interface PersonalPhrase {
  id: string;
  phrase: string;
  meaning: string;
  updatedAt: string;
}

interface PersonalLanguagePanelProps {
  entries: PersonalPhrase[];
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onSave: (entry: PersonalPhrase) => void;
  onDelete: (id: string) => void;
}

export const PersonalLanguagePanel: React.FC<PersonalLanguagePanelProps> = ({
  entries, enabled, onToggleEnabled, onSave, onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [meaning, setMeaning] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setPhrase('');
    setMeaning('');
    setEditingId(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanPhrase = phrase.trim().slice(0, 80);
    const cleanMeaning = meaning.trim().slice(0, 300);
    if (!cleanPhrase || !cleanMeaning) return;
    onSave({
      id: editingId || String(Date.now()) + '-' + String(Math.random()).slice(2, 8),
      phrase: cleanPhrase,
      meaning: cleanMeaning,
      updatedAt: new Date().toISOString(),
    });
    resetForm();
  };

  const handleEdit = (entry: PersonalPhrase) => {
    setEditingId(entry.id);
    setPhrase(entry.phrase);
    setMeaning(entry.meaning);
    setIsOpen(true);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 pb-8" aria-label="Learn My Language">
      <div className="rounded-3xl border border-cyan-500/30 bg-[#111824] p-5 sm:p-7">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 text-left"
        >
          <span className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-300 shrink-0" />
            <span>
              <strong className="block text-white font-serif text-xl">Learn My Language</strong>
              <span className="text-xs text-stone-300">
                Teach REMEMBER what your words and shorthand mean to you
              </span>
            </span>
          </span>
          <span className="rounded-lg border border-cyan-500/30 px-3 py-1.5 text-xs text-cyan-200 shrink-0">
            {isOpen ? 'Close' : 'Open'} · {entries.length}
          </span>
        </button>

        {isOpen && (
          <div className="mt-5 pt-5 border-t border-stone-700 space-y-5">
            <label className="flex items-center justify-between gap-3 text-sm text-stone-200">
              <span>Use my saved meanings in future questions</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(event) => onToggleEnabled(event.target.checked)}
                className="w-5 h-5 accent-cyan-500"
              />
            </label>
            <p className="text-xs text-stone-400 leading-relaxed">
              Only meanings you deliberately save are remembered. They stay in this browser,
              not your account or other devices. Anyone using this browser may see them,
              so do not save passwords or other secrets. You can edit or remove them anytime.
            </p>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-stone-700 bg-[#0d111b] p-4 space-y-3">
              <div>
                <label htmlFor="personal-phrase" className="block text-xs font-semibold text-cyan-200 mb-1">
                  When I say...
                </label>
                <input
                  id="personal-phrase"
                  value={phrase}
                  onChange={(event) => setPhrase(event.target.value)}
                  maxLength={80}
                  placeholder="e.g. Go"
                  className="w-full rounded-lg bg-[#161c2a] border border-stone-700 px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label htmlFor="personal-meaning" className="block text-xs font-semibold text-cyan-200 mb-1">
                  I mean...
                </label>
                <textarea
                  id="personal-meaning"
                  value={meaning}
                  onChange={(event) => setMeaning(event.target.value)}
                  maxLength={300}
                  rows={2}
                  placeholder="e.g. Continue the current task using what we already established."
                  className="w-full rounded-lg bg-[#161c2a] border border-stone-700 px-3 py-2 text-sm text-white resize-y"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!phrase.trim() || !meaning.trim()}
                  className="rounded-lg bg-cyan-600 text-white px-4 py-2 text-xs font-semibold disabled:opacity-40 flex items-center gap-2"
                >
                  {editingId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {editingId ? 'Save correction' : 'Remember this meaning'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="text-xs text-stone-300 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>
            </form>

            {entries.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-300">My saved meanings</p>
                {entries.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-stone-700 bg-[#0d111a] p-3 flex items-start gap-3 justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-white break-words">“{entry.phrase}”</p>
                      <p className="text-xs text-stone-300 mt-1 break-words">{entry.meaning}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button type="button" onClick={() => handleEdit(entry)} aria-label={'Edit ' + entry.phrase} className="p-2 text-cyan-300 rounded-lg hover:bg-cyan-950/40">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => onDelete(entry.id)} aria-label={'Forget ' + entry.phrase} className="p-2 text-rose-300 rounded-lg hover:bg-rose-950/40">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500">No meanings saved yet. REMEMBER won't guess them for you.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
