import React, { useState } from 'react';
import {
  Bookmark,
  History,
  Compass,
  FileDown,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Edit3,
  HeartHandshake,
  Layers,
  Music,
  Check,
} from 'lucide-react';
import { SameStoryResult } from '../../types/sameStory';
import { sound } from '../../audio/soundEngine';

interface MyDiscoveriesScreenProps {
  historyList: SameStoryResult[];
  savedStories: SameStoryResult[];
  onSelectStory: (story: SameStoryResult) => void;
  onClearHistory: () => void;
  onClearLanguageMemory: () => void;
  onToggleSaveStory: (story: SameStoryResult) => void;
  onRemoveFromSaved?: (storyId: string) => void;
  onRemoveFromHistory?: (storyId: string) => void;
}

export const MyDiscoveriesScreen: React.FC<MyDiscoveriesScreenProps> = ({
  historyList,
  savedStories,
  onSelectStory,
  onClearHistory,
  onClearLanguageMemory,
  onToggleSaveStory,
  onRemoveFromSaved,
  onRemoveFromHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'recent' | 'predictions' | 'principles'>('saved');
  const [exported, setExported] = useState(false);
  const [personalNotes, setPersonalNotes] = useState<string>(() => {
    return localStorage.getItem('remember_personal_notes') || '';
  });
  const [savedNotesMessage, setSavedNotesMessage] = useState(false);

  const handleExportAll = () => {
    sound.playDiscoveryChime();
    const all = savedStories.length > 0 ? savedStories : historyList;
    const content = all
      .map(
        (s, i) => `=== DISCOVERY #${i + 1}: ${s.stories[0]?.title || 'Universal Parallel'} ===
Date: ${new Date(s.timestamp).toLocaleDateString()}
Your Dilemma: "${s.userOriginalInput}"
The Underneath Pattern: "${s.underneathMechanism}"

Parallels:
${s.stories.map((p) => `- [${p.domainLabel}] ${p.title}: ${p.narrative}`).join('\n')}

Borrowed Insight (${s.borrowedInsight.donorField} -> Your Life):
${s.borrowedInsight.howItAppliesHere}

The Unresolved Question:
"${s.unresolvedQuestion.novelQuestion}"
How to test: ${s.unresolvedQuestion.testablePossibility}

Barbershop Closing:
"${s.barberClosingWisdom}"
--------------------------------------------------\n\n`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `REMEMBER_Discoveries_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const handleSaveNotes = () => {
    localStorage.setItem('remember_personal_notes', personalNotes);
    setSavedNotesMessage(true);
    sound.playNodeChime(560);
    setTimeout(() => setSavedNotesMessage(false), 2000);
  };

  const handleClearMemory = () => {
    if (window.confirm('Clear all local saved conversation memory and notes?')) {
      localStorage.removeItem('remember_personal_notes');
      setPersonalNotes('');
      onClearHistory();
      onClearLanguageMemory();
      sound.playNodeChime(320);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-lounge-border/70">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Pillar 3 &bull; Personal Memory Vault</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            My Discoveries
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Revisit your previous conversations, saved discoveries, cross-field predictions, and unanswered questions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c2230] hover:bg-[#252d40] text-stone-200 text-xs font-semibold border border-lounge-border transition-all cursor-pointer"
          >
            {exported ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-amber-400" />
                <span>Export Discoveries</span>
              </>
            )}
          </button>

          <button
            onClick={handleClearMemory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 text-xs border border-rose-500/30 transition-all cursor-pointer"
            title="Wipe saved memory and personal reflections"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear All Memory</span>
          </button>
        </div>
      </div>

      {/* Philosophy Banner: Dignity & The Song Didn't Change, You Did */}
      <div className="bg-gradient-to-r from-amber-950/25 via-[#161a25] to-[#121622] rounded-2xl border border-amber-500/30 p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 shrink-0 mt-0.5 sm:mt-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span>The Fresh Evidence Rule: Memory Is Not A Verdict</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-normal">
                  Historical snapshots · Recheck current facts
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed max-w-3xl">
                Saved discoveries describe what was considered then, not who you permanently are. A familiar outcome is not proof of the same cause. A fresh situation deserves fresh evidence: what happened now, what was known, what options existed, and what changed. Previous harm can still need repair, but past labels cannot replace a present explanation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-lounge-border/60 pb-3 text-xs font-medium">
        <button
          onClick={() => {
            setActiveTab('saved');
            sound.playNodeChime(420);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-amber-600 text-stone-950 font-bold shadow-md shadow-amber-950/40'
              : 'text-stone-400 hover:text-white bg-[#12151e]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Discoveries ({savedStories.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('recent');
            sound.playNodeChime(460);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'recent'
              ? 'bg-amber-600 text-stone-950 font-bold shadow-md shadow-amber-950/40'
              : 'text-stone-400 hover:text-white bg-[#12151e]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Recent Sessions ({historyList.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('predictions');
            sound.playNodeChime(500);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'predictions'
              ? 'bg-amber-600 text-stone-950 font-bold shadow-md shadow-amber-950/40'
              : 'text-stone-400 hover:text-white bg-[#12151e]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Real-World Tests ({historyList.filter((h) => !!h.prediction).length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('principles');
            sound.playNodeChime(540);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'principles'
              ? 'bg-amber-600 text-stone-950 font-bold shadow-md shadow-amber-950/40'
              : 'text-stone-400 hover:text-white bg-[#12151e]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Fresh Slate & Principles</span>
        </button>
      </div>

      {/* Tab Content 1: Saved Stories */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedStories.length === 0 ? (
            <div className="bg-[#12151f] rounded-2xl border border-lounge-border/70 p-8 text-center">
              <Bookmark className="w-8 h-8 text-stone-500 mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-white mb-1">
                No Saved Discoveries Yet
              </h4>
              <p className="text-xs text-stone-400 max-w-md mx-auto mb-4">
                When you're exploring in "SHOW ME", tap the bookmark button on any discovery card to keep it here permanently.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedStories.map((story) => (
                <div
                  key={story.id}
                  className="group bg-[#141822] hover:bg-[#1a1f2d] border border-lounge-border/80 hover:border-amber-500/50 rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between relative"
                >
                  <div
                    onClick={() => onSelectStory(story)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pr-6">
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                        {story.stories[0]?.domainLabel || 'Parallel Match'}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(story.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-white group-hover:text-amber-200 transition-colors mb-1.5">
                      {story.stories[0]?.title || 'Universal Pattern'}
                    </h4>
                    <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed mb-3">
                      "{story.underneathMechanism}"
                    </p>
                  </div>

                  {/* Individual Delete from Saved */}
                  {onRemoveFromSaved && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromSaved(story.id);
                        sound.playNodeChime(300);
                      }}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Remove this saved discovery"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div
                    onClick={() => onSelectStory(story)}
                    className="pt-3 border-t border-lounge-border/50 flex items-center justify-between text-xs cursor-pointer"
                  >
                    <span className="text-stone-400 text-[11px] truncate max-w-[200px]">
                      Your words: "{story.userOriginalInput.slice(0, 30)}..."
                    </span>
                    <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Recent Sessions */}
      {activeTab === 'recent' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historyList.map((story) => (
              <div
                key={story.id}
                className="group bg-[#141822] hover:bg-[#1a1f2d] border border-lounge-border/80 hover:border-amber-500/50 rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between relative"
              >
                <div
                  onClick={() => onSelectStory(story)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-2 pr-6">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                      {story.stories[0]?.domainLabel || 'Cross-Domain'}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(story.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-white group-hover:text-amber-200 transition-colors mb-1.5">
                    {story.stories[0]?.title || 'Universal Parallel'}
                  </h4>
                  <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed mb-3">
                    {story.userWordsSummary}
                  </p>
                </div>

                {/* Individual Delete from History */}
                {onRemoveFromHistory && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromHistory(story.id);
                      sound.playNodeChime(300);
                    }}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div
                  onClick={() => onSelectStory(story)}
                  className="pt-3 border-t border-lounge-border/50 flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="text-[11px] text-amber-400 font-mono">
                    {story.stories.length} Parallel Stories Linked
                  </span>
                  <span className="text-stone-300 font-semibold group-hover:text-amber-300 transition-colors flex items-center gap-1">
                    <span>Reopen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Real-World Tests (Predictions) */}
      {activeTab === 'predictions' && (
        <div className="space-y-4">
          {historyList
            .filter((h) => !!h.prediction)
            .map((h) => {
              const p = h.prediction!;
              return (
                <div
                  key={p.id}
                  className="bg-[#141822] border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-md space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-mono uppercase bg-[#18202e] px-2.5 py-1 rounded-lg text-amber-300 font-bold">
                      Borrowed From: {p.donorField} &rarr; Your Life: {p.targetField}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Strong Real-World Test
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
                      What We Bet Will Happen If You Try This:
                    </span>
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-white">
                      "{p.falsifiablePrediction}"
                    </h4>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed bg-[#0e111a] p-3 rounded-xl border border-lounge-border/50">
                    <strong className="text-amber-400 font-mono text-[11px] uppercase block mb-0.5">
                      What They Learned Over There:
                    </strong>
                    {p.establishedKnowledgeApplied}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-lounge-border/60 text-xs">
                    <div className="bg-[#0f1418] p-3 rounded-xl border border-emerald-500/20 text-emerald-200">
                      <strong className="block text-[11px] font-mono uppercase text-emerald-400 mb-0.5">
                        How You Know It Worked:
                      </strong>
                      {p.evidenceThatWouldProve}
                    </div>
                    <div className="bg-[#181115] p-3 rounded-xl border border-rose-500/20 text-rose-200">
                      <strong className="block text-[11px] font-mono uppercase text-rose-400 mb-0.5">
                        How You Know It Didn't Work:
                      </strong>
                      {p.evidenceThatWouldDisprove}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Tab Content 4: Fresh Slate & Principles */}
      {activeTab === 'principles' && (
        <div className="bg-[#141822] rounded-3xl border border-lounge-border/80 p-6 sm:p-8 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                How REMEMBER Respects Who You Are
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              Memory should be a library of light you've gathered, never a cage that traps who you are allowed to be.
            </p>
          </div>

          {/* Three Immutable Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0f121a] border border-emerald-500/25 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider font-mono">
                <HeartHandshake className="w-4 h-4" />
                <span>1. Never Weaponized</span>
              </div>
              <h4 className="font-serif text-white font-bold text-base">No History Thrown At You</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                The system will never bring up your past mistakes, old arguments, or prior stress to shame you, prove you wrong, or say "you always do this."
              </p>
            </div>

            <div className="bg-[#0f121a] border border-amber-500/25 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider font-mono">
                <Layers className="w-4 h-4" />
                <span>2. No Personality Boxes</span>
              </div>
              <h4 className="font-serif text-white font-bold text-base">You Are Not A Label</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                We never assign you a permanent psychological profile, archetype, or fixed score. What happened yesterday was a circumstance you passed through, not who you are in the now.
              </p>
            </div>

            <div className="bg-[#0f121a] border border-cyan-500/25 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider font-mono">
                <Music className="w-4 h-4" />
                <span>3. Fresh Eyes Every Time</span>
              </div>
              <h4 className="font-serif text-white font-bold text-base">The Song & The Person</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                The song doesn't change—the person does. Every conversation in LET'S TALK begins with a completely clean slate, ready to hear you as you are today.
              </p>
            </div>
          </div>

          {/* Personal Notebook (Private Local Sandbox) */}
          <div className="pt-4 border-t border-lounge-border/60">
            <label className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Your Sovereign Reflections & Notes:
              </span>
              <span className="text-[11px] font-normal text-stone-400">
                100% private to your browser
              </span>
            </label>
            <textarea
              rows={5}
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              placeholder="Record your personal reflections, things that clicked for you, or reminders for your own growth. REMEMBER will never analyze or grade these notes..."
              className="w-full bg-[#0d1017] border border-lounge-border rounded-xl p-3.5 text-xs sm:text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-stone-400 font-mono">
                Stored strictly in your local device.
              </span>
              <div className="flex items-center gap-2">
                {personalNotes && (
                  <button
                    onClick={() => {
                      if (window.confirm('Clear your private reflections?')) {
                        localStorage.removeItem('remember_personal_notes');
                        setPersonalNotes('');
                        sound.playNodeChime(320);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl text-stone-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                  >
                    Clear Notes
                  </button>
                )}
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  {savedNotesMessage ? 'Saved!' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
