import React from 'react';
import { TranslationResult } from '../types/translation';
import { X, Trash2, ArrowRight, History, Clock } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: TranslationResult[];
  onSelect: (item: TranslationResult) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onRemove,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-amber-900" />
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Saved Translations
              </h3>
            </div>
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-16 text-stone-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-sm font-medium text-stone-600">No saved explorations yet</p>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Every translation you explore is stored on this device for quick reference.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 transition-all flex flex-col justify-between group"
                >
                  <div
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="cursor-pointer space-y-1.5"
                  >
                    <div className="text-xs font-mono text-stone-400">
                      Translated via {item.familiarDomain}
                    </div>
                    <div className="font-serif font-semibold text-stone-900 text-sm line-clamp-2 group-hover:text-amber-900 transition-colors">
                      {item.unfamiliarTopic}
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      &ldquo;{item.headlineSummary}&rdquo;
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="text-xs font-semibold text-stone-900 flex items-center gap-1 hover:text-amber-900"
                    >
                      <span>Reopen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {history.length > 0 && (
            <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-mono">
                {history.length} {history.length === 1 ? 'entry' : 'entries'} stored locally
              </span>
              <button
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete all history</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
