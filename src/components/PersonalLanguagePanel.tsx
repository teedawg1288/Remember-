import React, { useState } from 'react';
import { Brain, ChevronDown, Trash2 } from 'lucide-react';

export interface PersonalPhrase {
  id: string;
  phrase: string;
  meaning: string;
  updatedAt: string;
  source?: 'user' | 'inferred';
  confidence?: number;
}

interface PersonalLanguagePanelProps {
  entries: PersonalPhrase[];
  recentCount: number;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onDelete: (id: string) => void;
  onForgetAll: () => void;
}

// Deliberately lives inside VAULT, not in the conversation flow.
// Nobody has to define their vocabulary in a form.
export const PersonalLanguagePanel: React.FC<PersonalLanguagePanelProps> = ({
  entries, recentCount, enabled, onToggleEnabled, onDelete, onForgetAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 pb-8" aria-label="Memory controls">
      <div className="rounded-2xl border border-stone-700/70 bg-[#111824] p-4 sm:p-5">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 text-left text-stone-300"
        >
          <span className="flex items-center gap-2 text-sm">
            <Brain className="h-4 w-4 text-cyan-300" />
            Memory & privacy
          </span>
          <ChevronDown className={'h-4 w-4 transition-transform ' + (isOpen ? 'rotate-180' : '')} />
        </button>

        {isOpen && (
          <div className="mt-4 space-y-4 border-t border-stone-700 pt-4">
            <p className="text-sm leading-relaxed text-stone-300">
              REMEMBER uses your wording to learn shorthand, not to decide who you are.
              A similar action today may have a completely different cause than it did before.
              Current evidence takes priority over old guesses. No form is needed.
            </p>
            <label className="flex items-center justify-between gap-4 text-sm text-stone-200">
              <span>Remember language from our conversations</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(event) => onToggleEnabled(event.target.checked)}
                className="h-5 w-5 accent-cyan-500"
              />
            </label>
            <p className="text-xs leading-relaxed text-stone-400">
              Up to 8 recent questions (30 days) and learned word meanings are stored on
              this browser only, not synced to an account. AI-inferred meanings expire after
              60 days unless fresh evidence updates them; earlier user-saved meanings remain until removed.
              When enabled, relevant recent context is sent to the AI with new questions.
              Disabling stops future use; Forget All deletes these saved copies on this device.
              Don't use this on a shared device if your questions are private.
            </p>
            <p className="text-xs text-stone-400">
              {recentCount} recent questions · {entries.length} learned meanings
            </p>
            {entries.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-300">What REMEMBER currently remembers</p>
                {entries.map((entry) => (
                  <div key={entry.id} className="flex items-start justify-between gap-3 rounded-lg border border-stone-700 p-3">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-white">“{entry.phrase}”</p>
                      <p className="mt-1 break-words text-xs text-stone-300">{entry.meaning}</p>
                      {entry.source === 'inferred' && <p className="mt-1 text-[10px] text-amber-300">AI interpretation · May be wrong</p>}
                    </div>
                    <button
                      type="button"
                      className="rounded-md p-2 text-rose-300 hover:bg-rose-950/40"
                      aria-label={'Forget ' + entry.phrase}
                      onClick={() => onDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {confirmClear ? (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-rose-200">Erase all learned words and recent questions on this device?</span>
                <button type="button" className="rounded-lg bg-rose-700 px-3 py-2 text-white" onClick={() => { onForgetAll(); setConfirmClear(false); }}>Yes, forget everything</button>
                <button type="button" className="rounded-lg border border-stone-600 px-3 py-2 text-stone-300" onClick={() => setConfirmClear(false)}>Cancel</button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmClear(true)} className="text-xs text-rose-300 underline underline-offset-4">
                Forget all language memory
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
