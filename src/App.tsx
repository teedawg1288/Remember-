import React, { useState, useEffect } from 'react';
import { Header, BrandNameOption, MainTabOption } from './components/Header';
import { BarberInput } from './components/BarberInput';
import { StoryComparisonView } from './components/StoryComparisonView';
import { DeepResearchLabDrawer } from './components/DeepResearchLabDrawer';
import { MyDiscoveriesScreen } from './components/screens/MyDiscoveriesScreen';
import { SameStoryResult } from './types/sameStory';
import { AlertCircle, Eye, MessageSquare, Sparkles, Box } from 'lucide-react';
import { sound } from './audio/soundEngine';

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

  // Sync document title dynamically with active brand name
  useEffect(() => {
    document.title = `${appName} — Same Story, Different Characters`;
  }, [appName]);

  // Load initial history and saved stories from localStorage
  useEffect(() => {
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
      const res = await fetch('/api/same-story/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput, persona }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.result || !Array.isArray(data.result.stories)) {
        throw new Error(data.error || 'The analysis could not be completed. Please try again.');
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

  const handleSelectCurated = (story: SameStoryResult) => {
    setActiveAnalysis(story);
    setError(null);
    setActiveMainTab('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      try {
        localStorage.setItem('remember_saved_discoveries', JSON.stringify(updated));
      } catch {
        // Storage quota
      }
      return updated;
    });
  };

  const isCurrentStorySaved = activeAnalysis
    ? savedStories.some((s) => s.id === activeAnalysis.id)
    : false;

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0e12] text-stone-100 selection:bg-amber-500/20 selection:text-amber-200">
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
        hasActiveStory={!!activeAnalysis}
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
          <BarberInput
            onAnalyze={handleAnalyze}
            onSelectCurated={handleSelectCurated}
            isLoading={isLoading}
            persona={persona}
            appName={appName}
          />
        )}

        {/* PILLAR 2: SHOW ME */}
        {activeMainTab === 'show' && (
          activeAnalysis ? (
            <StoryComparisonView
              analysis={activeAnalysis}
              persona={persona}
              onOpenResearchLab={() => setShowResearchLab(true)}
              onNewStory={handleReset}
              appName={appName}
              isSaved={isCurrentStorySaved}
              onToggleSave={() => handleToggleSaveStory(activeAnalysis)}
            />
          ) : (
            <div className="max-w-2xl mx-auto mt-16 rounded-3xl border border-stone-700 bg-[#141822] p-8 text-center space-y-4">
              <h2 className="font-serif text-3xl text-white">Your discovery starts with a question.</h2>
              <p className="text-stone-300 text-sm">Tell REMEMBER something you're trying to understand, or select a clearly labeled example.</p>
              <button onClick={() => setActiveMainTab('talk')} className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-stone-950">Let's Talk</button>
            </div>
          )
        )}

        {/* PILLAR 3: MY DISCOVERIES */}
        {activeMainTab === 'discoveries' && (
          <MyDiscoveriesScreen
            historyList={historyList}
            savedStories={savedStories}
            onSelectStory={(s) => {
              setActiveAnalysis(s);
              setActiveMainTab('show');
            }}
            onClearHistory={() => {
              setSavedStories([]);
              setHistoryList([]);
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
        )}
      </main>

      {/* Deep Research Lab Drawer (Hidden unless triggered) */}
      {activeAnalysis && (
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
          "The characters change, the costumes change, the technology changes. The human drama remains."
        </p>
        <p className="text-[11px] font-mono mt-1 text-stone-400">
          {appName} &bull; Dimensional Pattern Architecture &bull; Powered by REMEMBER
        </p>
      </footer>
    </div>
  );
};
