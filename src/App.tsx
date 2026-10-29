import React, { useState, useEffect } from 'react';
import { Header, BrandNameOption, MainTabOption } from './components/Header';
import { BarberInput } from './components/BarberInput';
import { PersonalLanguagePanel, PersonalPhrase } from './components/PersonalLanguagePanel';
import { StoryComparisonView } from './components/StoryComparisonView';
import { CoreDiscoveryView } from './components/CoreDiscoveryView';
import { DeepResearchLabDrawer } from './components/DeepResearchLabDrawer';
import { MyDiscoveriesScreen } from './components/screens/MyDiscoveriesScreen';
import { BridgeDictionaryPage } from './components/BridgeDictionaryPage';
import { SameStoryResult } from './types/sameStory';
import { AlertCircle, Eye, MessageSquare, Sparkles, Box } from 'lucide-react';
import { sound } from './audio/soundEngine';

/** Every /?test=isolated&case=... URL is a clean fictional user's session. */
const isIsolatedTest = typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('test') === 'isolated';

// Automatic language interpretations are provisional; old guesses expire.
const INFERRED_MEANING_MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000;
const isFreshMemory = (entry: PersonalPhrase): boolean => {
  if (entry.source !== 'inferred') return true; // User-entered meanings are controlled by the user.
  const observedAt = Date.parse(entry.updatedAt || '');
  return Number.isFinite(observedAt) &&
    observedAt <= Date.now() &&
    observedAt > Date.now() - INFERRED_MEANING_MAX_AGE_MS;
};

export const App: React.FC = () => {
  const [appName, setAppName] = useState<BrandNameOption>('REMEMBER');
  const [activeMainTab, setActiveMainTab] = useState<MainTabOption>('talk');
  const [activeAnalysis, setActiveAnalysis] = useState<SameStoryResult | null>(null);
  const [persona, setPersona] = useState<'barber' | 'bartender'>('barber');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResearchLab, setShowResearchLab] = useState(false);
  const [historyList, setHistoryList] = useState<SameStoryResult[]>([]);
  const [savedStories, setSavedStories] = useState<SameStoryResult[]>([]);
  // Local language memory: inferred from user wording, never a factual profile.
  const [personalPhrases, setPersonalPhrases] = useState<PersonalPhrase[]>(() => {
    if (isIsolatedTest) return [];
    try {
      const raw = JSON.parse(localStorage.getItem('remember_learned_language_v2') || localStorage.getItem('remember_personal_language_v1') || '[]');
      return Array.isArray(raw) ? raw.filter((p) =>
        p && typeof p.id === 'string' && typeof p.phrase === 'string' &&
        typeof p.meaning === 'string' && p.phrase.length <= 80 && p.meaning.length <= 300
      ).filter(isFreshMemory).slice(0, 50) : [];
    } catch { return []; }
  });
  const [usePersonalLanguage, setUsePersonalLanguage] = useState(() => {
    if (isIsolatedTest) return false;
    try { return localStorage.getItem('remember_personal_language_enabled_v1') !== 'false'; }
    catch { return true; }
  });

  useEffect(() => {
    if (isIsolatedTest) return;
    try { localStorage.setItem('remember_learned_language_v2', JSON.stringify(personalPhrases)); }
    catch { /* Browsing storage may be disabled. */ }
  }, [personalPhrases]);

  useEffect(() => {
    if (isIsolatedTest) return;
    try { localStorage.setItem('remember_personal_language_enabled_v1', String(usePersonalLanguage)); }
    catch { /* Browsing storage may be disabled. */ }
  }, [usePersonalLanguage]);

  // Keep only a short, expiring tail of past questions for contextual translation.
  const [recentQuestions, setRecentQuestions] = useState<{ text: string; at: number }[]>(() => {
    if (isIsolatedTest) return [];
    try {
      const raw = JSON.parse(localStorage.getItem('remember_recent_questions_v2') || '[]');
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      return Array.isArray(raw) ? raw.filter((q) =>
        q && typeof q.text === 'string' && q.text.length <= 400 &&
        typeof q.at === 'number' && q.at > cutoff
      ).slice(0, 8) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (isIsolatedTest) return;
    try { localStorage.setItem('remember_recent_questions_v2', JSON.stringify(recentQuestions)); }
    catch { /* Browsing storage may be disabled. */ }
  }, [recentQuestions]);

  const forgetLearnedLanguage = () => {
    setPersonalPhrases([]);
    setRecentQuestions([]);
    if (isIsolatedTest) return;
    try {
      localStorage.removeItem('remember_personal_language_v1');
      localStorage.removeItem('remember_learned_language_v2');
      localStorage.removeItem('remember_recent_questions_v2');
    } catch { /* Browser storage may be disabled. */ }
  };

  // Sync document title dynamically with active brand name
  useEffect(() => {
    document.title = `${appName} — Same Story, Different Characters`;
  }, [appName]);

  // Load initial history and saved stories from localStorage
  useEffect(() => {
    if (isIsolatedTest) return;
    try {
      const saved = localStorage.getItem('remember_saved_discoveries');
      if (saved) {
        setSavedStories(JSON.parse(saved));
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleAnalyze = async (userInput: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const relevantPhrases = usePersonalLanguage && !isIsolatedTest
        ? personalPhrases.filter((entry) => {
            if (!isFreshMemory(entry)) return false;
            const normalize = (value: string) =>
              ' ' + value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim() + ' ';
            const needle = normalize(entry.phrase);
            return needle.trim().length > 0 && normalize(userInput).includes(needle);
          }).slice(0, 10).map(({ phrase, meaning }) => ({ phrase, meaning }))
        : [];
      const res = await fetch('/api/discovery/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput, persona, personalDictionary: relevantPhrases,
          conversationContext: usePersonalLanguage && !isIsolatedTest
            ? recentQuestions
              .filter((q) => q.at > Date.now() - 30 * 24 * 60 * 60 * 1000)
              .slice(0, 6).reverse().map((q) => q.text)
            : [],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.result || !Array.isArray(data.result.stories)) {
        throw new Error(data.error || 'The analysis could not be completed. Please try again.');
      }

      if (usePersonalLanguage && !isIsolatedTest) {
        const signals = Array.isArray(data.languageLearnings) ? data.languageLearnings : [];
        // Only current language is new evidence; don't reinforce a guess from old prompts alone.
        const corpus = (' ' + userInput.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ') + ' ');
        setPersonalPhrases((prev) => {
          const next = prev.filter(isFreshMemory);
          for (const signal of signals.slice(0, 2)) {
            if (!signal || typeof signal.phrase !== 'string' || typeof signal.meaning !== 'string' ||
              !['explicit', 'repeated'].includes(signal.evidence) ||
              typeof signal.confidence !== 'number' || signal.confidence < 0.85) continue;
            const phrase = signal.phrase.trim().slice(0, 80);
            const meaning = signal.meaning.trim().slice(0, 200);
            const normalized = phrase.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
            if (normalized.length < 2 || !meaning || !corpus.includes(' ' + normalized + ' ')) continue;
            const existing = next.find((p) => p.phrase.toLocaleLowerCase() === phrase.toLocaleLowerCase());
            if (existing && existing.source !== 'inferred') continue;
            const entry: PersonalPhrase = {
              id: existing?.id || String(Date.now()) + '-' + normalized.slice(0, 16),
              phrase, meaning, updatedAt: new Date().toISOString(),
              source: 'inferred', confidence: signal.confidence,
            };
            const idx = next.findIndex((p) => p.id === entry.id);
            if (idx >= 0) next.splice(idx, 1);
            next.unshift(entry);
          }
          return next.slice(0, 50);
        });
        setRecentQuestions((prev) => [
          { text: userInput.trim().slice(0, 400), at: Date.now() },
          ...prev.filter((q) => q.text.trim().toLocaleLowerCase() !== userInput.trim().toLocaleLowerCase()),
        ].slice(0, 8));
      }

      setActiveAnalysis(data.result);
      setHistoryList((prev) => {
        const filtered = prev.filter((p) => p.id !== data.result.id);
        return [data.result, ...filtered];
      });

      // Switch automatically to SHOW ME to display the 3D graphics and connections
      setActiveMainTab('show');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err?.message || 'Something went wrong while connecting the dots.');
      // Keep the user's question and any earlier result intact. Never substitute an unrelated story.
      setActiveMainTab('talk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setActiveAnalysis(null);
    setShowResearchLab(false);
    setError(null);
    setActiveMainTab('talk');
  };

  const handleToggleSaveStory = (storyToSave?: SameStoryResult) => {
    const target = storyToSave || activeAnalysis;
    if (!target) return;

    setSavedStories((prev) => {
      const exists = prev.some((s) => s.id === target.id);
      let updated: SameStoryResult[];
      if (exists) {
        updated = prev.filter((s) => s.id !== target.id);
      } else {
        updated = [target, ...prev];
      }
      if (!isIsolatedTest) {
        try { localStorage.setItem('remember_saved_discoveries', JSON.stringify(updated)); }
        catch { /* Storage quota */ }
      }
      return updated;
    });
  };

  const isCurrentStorySaved = activeAnalysis
    ? savedStories.some((s) => s.id === activeAnalysis.id)
    : false;

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0e12] text-stone-100 selection:bg-amber-500/20 selection:text-amber-200">
      {isIsolatedTest && <div role="status" className="bg-cyan-950/80 border-b border-cyan-500/30 px-4 py-2 text-xs text-cyan-100 text-center">Isolated test session · No remembered language or earlier questions</div>}
      {/* Top Navigation */}
      <Header
        appName={appName}
        onAppNameChange={setAppName}
        activeMainTab={activeMainTab}
        onMainTabChange={setActiveMainTab}
        persona={persona}
        onPersonaChange={setPersona}
        onReset={handleReset}
        showResearchLab={showResearchLab}
        onToggleResearchLab={() => setShowResearchLab((prev) => !prev)}
        hasActiveStory={!!activeAnalysis && !activeAnalysis.coreDiscovery}
      />

      {/* Persistent Context Banner if exploring tabs while a story is loaded */}
      {activeAnalysis && activeMainTab !== 'show' && (
        <div className="bg-[#121622] border-b border-lounge-border/70 px-4 sm:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-stone-400">Current Dilemma:</span>
              <span className="text-white font-medium truncate">
                "{activeAnalysis.userWordsSummary}"
              </span>
            </div>
            <button
              onClick={() => {
                setActiveMainTab('show');
                sound.playNodeChime(500);
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Back to Visual Story &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {error && (
          <div className="max-w-4xl mx-auto mt-4 px-4">
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 text-xs text-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Notice: {error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-amber-300 font-bold hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* PILLAR 1: LET'S TALK */}
        {activeMainTab === 'talk' && (
          <>
            <BarberInput
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              persona={persona}
              appName={appName}
            />
          </>
        )}

        {/* PILLAR 2: SHOW ME */}
        {activeMainTab === 'show' && (
          activeAnalysis ? (
            activeAnalysis.coreDiscovery ? (
              <CoreDiscoveryView
                analysis={activeAnalysis}
                isSaved={isCurrentStorySaved}
                onToggleSave={() => handleToggleSaveStory(activeAnalysis)}
                onNewQuestion={handleReset}
              />
            ) : (
            <StoryComparisonView
              key={`${activeAnalysis.id}:${activeAnalysis.userOriginalInput}`}
              analysis={activeAnalysis}
              persona={persona}
              onOpenResearchLab={() => setShowResearchLab(true)}
              onNewStory={handleReset}
              appName={appName}
              isSaved={isCurrentStorySaved}
              onToggleSave={() => handleToggleSaveStory(activeAnalysis)}
            />
            )
          ) : (
            <div className="max-w-2xl mx-auto mt-16 rounded-3xl border border-stone-700 bg-[#141822] p-8 text-center space-y-4">
              <h2 className="font-serif text-3xl text-white">Your discovery starts with a question.</h2>
              <p className="text-stone-300 text-sm">Tell REMEMBER something you're trying to understand, or select a clearly labeled example.</p>
              <button onClick={() => setActiveMainTab('talk')} className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-stone-950">Let's Talk</button>
            </div>
          )
        )}

        {/* PILLAR 3: MY DISCOVERIES */}
        {activeMainTab === 'words' && (
          <BridgeDictionaryPage
            onExplore={(word) => handleAnalyze(
              `Explore the meanings of "${word}" across fields. Investigate both its historically documented word origins and why a culture or field associated this word with a particular concept. Distinguish linguistic ancestry from metaphor or conceptual borrowing; do not infer shared roots or original intent from resemblance. Read words in their attested historical and cultural context first, and mark original intent unknown unless evidenced. Compare a genuine shared process if there is one, show important differences, identify uncertain claims, and offer one useful question through a familiar modern example.`
            )}
            isLoading={isLoading}
            isolated={isIsolatedTest}
          />
        )}

        {/* MY DISCOVERIES */}
        {activeMainTab === 'discoveries' && (
          <>
          <MyDiscoveriesScreen
            onClearLanguageMemory={forgetLearnedLanguage}
            historyList={historyList}
            savedStories={savedStories}
            onSelectStory={(s) => {
              setActiveAnalysis(s);
              setActiveMainTab('show');
            }}
            onClearHistory={() => {
              setSavedStories([]);
              setHistoryList([]);
              setActiveAnalysis(null);
              setShowResearchLab(false);
              localStorage.removeItem('remember_saved_discoveries');
            }}
            onToggleSaveStory={handleToggleSaveStory}
            onRemoveFromSaved={(storyId) => {
              setSavedStories((prev) => {
                const updated = prev.filter((s) => s.id !== storyId);
                localStorage.setItem('remember_saved_discoveries', JSON.stringify(updated));
                return updated;
              });
            }}
            onRemoveFromHistory={(storyId) => {
              setHistoryList((prev) => prev.filter((s) => s.id !== storyId));
            }}
          />
          <PersonalLanguagePanel
            entries={personalPhrases}
            enabled={usePersonalLanguage}
            recentCount={recentQuestions.length}
            onToggleEnabled={setUsePersonalLanguage}
            onDelete={(id) => setPersonalPhrases((prev) => prev.filter((p) => p.id !== id))}
            onForgetAll={forgetLearnedLanguage}
          />
          </>
        )}
      </main>

      {/* Deep Research Lab Drawer (Hidden unless triggered) */}
      {activeAnalysis && !activeAnalysis.coreDiscovery && (
        <DeepResearchLabDrawer
          isOpen={showResearchLab}
          onClose={() => setShowResearchLab(false)}
          research={activeAnalysis.deepResearch}
          storyTitle={activeAnalysis.stories[0]?.title || 'Cross-Field Discovery'}
        />
      )}

      {/* Grounded Barbershop Footer */}
      <footer className="border-t border-lounge-border/60 py-6 text-center text-xs text-stone-400">
        <p className="font-serif italic text-stone-300">
          "Look for the connection. Check what makes it different."
        </p>
        <p className="text-[11px] font-mono mt-1 text-stone-400">
          {appName} &bull; Dimensional Pattern Architecture &bull; Powered by REMEMBER
        </p>
      </footer>
    </div>
  );
};
