import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Bookmark, BookmarkCheck, Search, Sparkles, X } from 'lucide-react';
import { bridgeDictionary, BridgeWord } from '../data/bridgeDictionary';
import { getWordOrigin } from '../data/wordOrigins';

interface BridgeDictionaryPageProps {
  onExplore: (word: string) => void;
  isLoading: boolean;
  isolated: boolean;
}

const FAVORITES_KEY = 'remember_bridge_words_saved_v1';

export const BridgeDictionaryPage: React.FC<BridgeDictionaryPageProps> = ({ onExplore, isLoading, isolated }) => {
  const [search, setSearch] = useState('');
  const [selectedWord, setSelectedWord] = useState('Resistance');
  const [onlySaved, setOnlySaved] = useState(false);
  const [saved, setSaved] = useState<string[]>(() => {
    if (isolated) return [];
    try {
      const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
      return Array.isArray(value) ? value.filter((word) => typeof word === 'string').slice(0, 100) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (isolated) return;
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(saved)); }
    catch { /* Optional browser storage may be disabled. */ }
  }, [saved, isolated]);

  const results = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return bridgeDictionary.filter((entry) => {
      const origin = getWordOrigin(entry.word);
      const searchable = [
        entry.word,
        ...(entry.word === 'Hermeneutics' ? ['hermenutics'] : []),
        ...entry.senses.map((s) => s.field),
        ...entry.senses.map((s) => s.meaning),
        ...(origin ? [origin.wordHistory, origin.whyUsed] : []),
      ];
      return (!onlySaved || saved.includes(entry.word)) &&
        (!term || searchable.some((value) => value.toLocaleLowerCase().includes(term)));
    });
  }, [search, onlySaved, saved]);

  const active: BridgeWord | undefined = results.find((entry) => entry.word === selectedWord) || results[0];
  const activeOrigin = active ? getWordOrigin(active.word) : undefined;
  const canExploreUnknown = search.trim().length >= 2 && search.trim().length <= 60 && !results.length;
  const toggleSaved = (word: string) => setSaved((prior) =>
    prior.includes(word) ? prior.filter((w) => w !== word) : [...prior, word]
  );

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-8 pt-8 sm:pt-12 pb-20" aria-labelledby="words-title">
      <div className="max-w-2xl mb-8">
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-amber-400 uppercase mb-3">
          <BookOpen className="w-4 h-4" /> REMEMBER · Words
        </div>
        <h1 id="words-title" className="font-serif text-4xl sm:text-5xl font-semibold text-white leading-tight">
          Same word. <span className="text-amber-400">Different worlds.</span>
        </h1>
        <p className="mt-4 text-stone-300 text-base sm:text-lg leading-relaxed">
          Explore how words connect, where some meanings came from, and what doesn't carry across.
        </p>
      </div>

      <div className="rounded-2xl bg-[#161a23] border border-stone-700/80 p-3 sm:p-4 mb-6">
        <label htmlFor="bridge-word-search" className="block text-sm text-stone-300 mb-2">Find a word or field</label>
        <div className="relative">
          <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            id="bridge-word-search"
            type="search"
            autoComplete="off"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try resistance, mother, earth…"
            className="w-full bg-[#0c0e12] text-white placeholder:text-stone-500 border border-stone-600 rounded-xl pl-11 pr-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500/70"
          />
          {search && <button type="button" title="Clear search" aria-label="Clear search" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"><X className="w-4 h-4" /></button>}
        </div>
        <div className="flex flex-wrap gap-3 items-center justify-between mt-3 text-xs text-stone-400">
          <span aria-live="polite">{results.length} of {bridgeDictionary.length} starter words</span>
          <button
            type="button"
            onClick={() => setOnlySaved((value) => !value)}
            aria-pressed={onlySaved}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 border ${onlySaved ? 'bg-amber-500/20 text-amber-200 border-amber-500/50' : 'text-stone-300 border-stone-600 hover:border-amber-500/50'}`}
          >
            <Bookmark className="w-3.5 h-3.5" /> Saved words ({saved.length})
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[15rem_minmax(0,1fr)] gap-5 items-start">
        <nav aria-label="Dictionary entries" className="rounded-2xl border border-stone-700/80 bg-[#121620] overflow-hidden">
          <div className="max-h-[18rem] lg:max-h-[39rem] overflow-y-auto p-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1">
            {results.map((entry) => (
              <button
                key={entry.word}
                type="button"
                onClick={() => setSelectedWord(entry.word)}
                aria-current={active?.word === entry.word ? 'true' : undefined}
                className={`text-left rounded-xl px-3 py-2.5 min-w-0 text-sm flex items-center justify-between gap-1 transition-colors ${active?.word === entry.word ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800 hover:text-white'}`}
              >
                <span className="truncate">{entry.word}</span>
                {saved.includes(entry.word) && <BookmarkCheck className="w-3.5 h-3.5 shrink-0" aria-label="Saved" />}
              </button>
            ))}
            {!results.length && <p className="col-span-full p-3 text-stone-400 text-sm">No matching starter entries.</p>}
          </div>
        </nav>

        <div aria-live="polite">
          {active ? (
            <article className="rounded-3xl border border-amber-500/25 bg-[#161a23] p-5 sm:p-7 space-y-6">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-amber-400 font-mono mb-2">Explore the word</p>
                  <h2 className="font-serif text-4xl text-white">{active.word}</h2>
                  <p className="text-stone-400 text-sm mt-2">{active.senses.length} meanings · different fields</p>
                </div>
                <button
                  type="button"
                  title={saved.includes(active.word) ? 'Remove saved word' : 'Save word'}
                  aria-label={saved.includes(active.word) ? `Remove ${active.word} from saved words` : `Save ${active.word}`}
                  aria-pressed={saved.includes(active.word)}
                  onClick={() => toggleSaved(active.word)}
                  className="shrink-0 border border-stone-600 rounded-xl p-2.5 text-amber-300 hover:bg-amber-500/10"
                >
                  {saved.includes(active.word) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3" aria-label="Different meanings">
                {active.senses.map((sense) => (
                  <div key={sense.field} className="rounded-xl bg-[#0f121a] border border-stone-700 p-4 min-h-[112px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
                      <h3 className="text-amber-200 font-semibold">{sense.field}</h3>
                    </div>
                    <p className="text-stone-300 text-sm leading-relaxed">{sense.meaning}</p>
                  </div>
                ))}
              </div>

              <div className="relative pl-5 border-l-2 border-amber-500/60 space-y-5">
                <div>
                  <h3 className="text-xs text-amber-400 font-mono uppercase tracking-widest mb-2">Possible connection</h3>
                  <p className="text-white text-lg font-medium leading-relaxed">{active.connection}</p>
                </div>
                <div>
                  <h3 className="text-xs text-stone-400 font-mono uppercase tracking-widest mb-2">Where it differs</h3>
                  <p className="text-stone-300 text-sm leading-relaxed">{active.difference}</p>
                </div>
              </div>


              {activeOrigin && (
                <details className="rounded-2xl bg-[#101720] border border-amber-500/25 p-4 sm:p-5 group">
                  <summary className="cursor-pointer text-white font-semibold flex items-center justify-between gap-3">
                    <span>Where the meaning came from</span>
                    <span className="text-xs text-amber-300 font-normal text-right">{activeOrigin.kindLabel}</span>
                  </summary>
                  <div className="pt-4 space-y-4 text-sm leading-relaxed">
                    <div>
                      <h3 className="text-amber-300 font-semibold mb-1">Word history</h3>
                      <p className="text-stone-300">{activeOrigin.wordHistory}</p>
                    </div>
                    <div>
                      <h3 className="text-amber-300 font-semibold mb-1">Why was this meaning used?</h3>
                      <p className="text-stone-300">{activeOrigin.whyUsed}</p>
                    </div>
                    <div>
                      <h3 className="text-stone-300 font-semibold mb-1">What this does not prove</h3>
                      <p className="text-stone-400">{activeOrigin.caution}</p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {activeOrigin.sources.map((source) => (
                        <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="text-amber-300 underline underline-offset-2 hover:text-amber-200">
                          {source.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </details>
              )}

              <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/25 p-5">
                <p className="text-xs font-mono uppercase tracking-widest text-emerald-300 mb-2">One question worth asking</p>
                <p className="font-serif text-xl sm:text-2xl text-white leading-relaxed">{active.question}</p>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => onExplore(active.word)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold px-5 py-3.5 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> {isLoading ? 'Exploring…' : 'Explore deeper with REMEMBER'} <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-stone-400 text-center">Starter comparisons are illustrative, not proof of a shared cause. Explore deeper uses live AI and may require API availability.</p>
            </article>
          ) : canExploreUnknown ? (
            <div className="border border-stone-700 bg-[#161a23] rounded-3xl p-7 text-center space-y-4">
              <h2 className="text-xl font-serif text-white">“{search.trim()}” isn't in the starter dictionary yet.</h2>
              <p className="text-stone-300">You can still ask REMEMBER to explore its different meanings. The result will be a new analysis, not an automatically verified dictionary entry.</p>
              <button type="button" disabled={isLoading} onClick={() => onExplore(search.trim())} className="rounded-xl bg-amber-500 text-stone-950 px-5 py-3 font-bold disabled:opacity-50">Explore this word <ArrowRight className="w-4 h-4 inline" /></button>
            </div>
          ) : (
            <div className="border border-stone-700 bg-[#161a23] rounded-3xl p-7 text-center text-stone-300">
              {onlySaved ? 'Save a word to build your own collection, or switch off the saved filter.' : 'Try another search to find a word.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
