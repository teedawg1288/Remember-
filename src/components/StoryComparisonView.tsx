import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  HelpCircle,
  Scissors,
  Wine,
  Scale,
  FlaskConical,
  CheckCircle2,
  Share2,
  Bookmark,
  Layers,
  Users,
  PlayCircle,
  Compass,
  GitBranch,
  Repeat,
  History,
  Languages,
  Disc3,
  Heart,
  ArrowRight,
  Eye,
  Radio,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SameStoryResult,
  StoryParallel,
  InteractiveStoryChainData,
  ScaleConnection,
} from '../types/sameStory';
import { StoryCard } from './StoryCard';
import { StoryHistoryModal } from './StoryHistoryModal';
import { InteractiveStoryChain } from './InteractiveStoryChain';
import { BiggerConnectionsLadder } from './BiggerConnectionsLadder';
import { RosettaStoneTranslator } from './RosettaStoneTranslator';
import { LifeLensViewer } from './LifeLensViewer';
import { ResonanceCheckWidget } from './ResonanceCheckWidget';
import { InteractiveCharacterSwap } from './InteractiveCharacterSwap';
import { InteractiveDimensionSlider } from './InteractiveDimensionSlider';
import { DifferenceThatChangesEverythingView } from './DifferenceThatChangesEverythingView';
import { MirrorEffectCard } from './MirrorEffectCard';
import { RoundTableView } from './RoundTableView';
import { MechanismBridgeView } from './MechanismBridgeView';
import { MeaningSynchronizationView } from './MeaningSynchronizationView';
import { WhatIfPlayground } from './WhatIfPlayground';
import { CrossDomainVisualBridge } from './CrossDomainVisualBridge';
import { CrossExaminationPanel } from './CrossExaminationPanel';
import type { CrossExaminationResult } from '../types/sameStory';
import { InteractiveDiscoveryMap } from './InteractiveDiscoveryMap';
import { sound } from '../audio/soundEngine';
import { getRosettaStoneForAnalysis } from '../data/curatedRosettaStones';

interface StoryComparisonViewProps {
  analysis: SameStoryResult;
  persona: 'barber' | 'bartender';
  onOpenResearchLab: () => void;
  onNewStory: () => void;
  appName: string;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const StoryComparisonView: React.FC<StoryComparisonViewProps> = ({
  analysis,
  persona,
  onOpenResearchLab,
  onNewStory,
  appName,
  isSaved = false,
  onToggleSave,
}) => {
  const [selectedStory, setSelectedStory] = useState<StoryParallel | null>(null);
  const [copied, setCopied] = useState(false);
  const [crossExam, setCrossExam] = useState<CrossExaminationResult | null>(null);
  const [crossExamBusy, setCrossExamBusy] = useState(false);
  const [crossExamError, setCrossExamError] = useState<string | null>(null);
  // Default to 'map' so the living, touch-responsive discovery map is the center stage!
  const [activeTab, setActiveTab] = useState<'map' | 'story' | 'bridge' | 'eras' | 'rosetta'>('map');

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${appName} — Same Story, Different Characters:\n\n"${analysis.underneathMechanism}"\n\nBorrowed Insight: ${analysis.borrowedInsight.howItAppliesHere}`
    );
    setCopied(true);
    sound.playDiscoveryChime();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.85 } });
    setTimeout(() => setCopied(false), 2500);
  };


  // One on-demand examination reused across tabs. No hidden model calls.
  const runCrossExamination = async () => {
    if (crossExamBusy) return;
    setCrossExamBusy(true);
    setCrossExamError(null);
    try {
      const response = await fetch('/api/same-story/cross-examine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: analysis.userOriginalInput || analysis.userWordsSummary,
          proposedMechanism: analysis.underneathMechanism,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success || !payload.examination) {
        throw new Error(payload.error || 'Could not cross-examine this question.');
      }
      setCrossExam(payload.examination as CrossExaminationResult);
    } catch (err: any) {
      setCrossExamError(err?.message || 'Cross-examination is unavailable right now.');
    } finally {
      setCrossExamBusy(false);
    }
  };

  const getPlausibilityBadge = (category: string) => {
    switch (category) {
      case 'structural_isomorphism':
        return {
          label: 'Possible Structural Match · Unverified',
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        };
      case 'repeating_human_behavior':
        return {
          label: 'Possible Repeating Behaviour',
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        };
      case 'shared_cultural_origin':
        return {
          label: 'Possible Shared Cultural Root',
          color: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        };
      case 'unproven_analogy':
      default:
        return {
          label: 'Exploratory Analogy (Caution)',
          color: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        };
    }
  };

  const plausibilityBadge = getPlausibilityBadge(analysis.plausibility.category);

  // Each view reads only this analysis. Never borrow unanswered-text content
  // when an AI-generated or curated scenario does not supply this section.
  const storyChainData = analysis.storyChain;
  const scaleConnectionsData = analysis.scaleConnections;
  const rosettaStoneData = analysis.isCustomGenerated && !analysis.meaningSynchronization
    ? null // Do not force a human communication story onto a question about machinery.
    : getRosettaStoneForAnalysis(analysis);

  const navTabs = [
    {
      id: 'map' as const,
      label: 'Living Discovery Map',
      icon: <Compass className="w-4 h-4" />,
      desc: 'See the connections',
    },
    {
      id: 'story' as const,
      label: 'Your Story & Decisions',
      icon: <Eye className="w-4 h-4" />,
      desc: 'Explore other explanations',
    },
    {
      id: 'bridge' as const,
      label: 'Cross-Domain Discovery',
      icon: <Radio className="w-4 h-4" />,
      desc: 'Compare mechanisms and tests',
    },
    {
      id: 'eras' as const,
      label: 'Through The Eras',
      icon: <History className="w-4 h-4" />,
      desc: 'What changed over time',
    },
    {
      id: 'rosetta' as const,
      label: 'The Living Rosetta Stone',
      icon: <Disc3 className="w-4 h-4" />,
      desc: 'Translate meaning between perspectives',
    },
  ];

  const handleSelectTab = (t: typeof activeTab) => {
    setActiveTab(t);
    sound.playNodeChime(450);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 animate-fade-in space-y-10">
      {/* The visible answer is a short evidence → hypothesis → check sequence.
          Rich explanations remain in the analysis object and optional views. */}
      <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#181d28] to-[#10141e] p-5 sm:p-8 space-y-5 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-amber-300">
            {analysis.isCustomGenerated ? 'AI analysis · not independently verified' : 'Prepared example'}
          </span>
          {onToggleSave && (
            <button onClick={onToggleSave}
              className="flex gap-2 items-center text-xs font-semibold px-3 py-2 rounded-lg border border-stone-700 text-stone-200 hover:border-amber-400 cursor-pointer">
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
              {isSaved ? 'Saved in Vault' : 'Save'}
            </button>
          )}
        </div>
        <div>
          <p className="text-[11px] text-stone-400 uppercase tracking-wide mb-1">Your question</p>
          <h1 className="font-serif text-xl sm:text-2xl text-white font-semibold leading-relaxed">
            {analysis.userOriginalInput || analysis.userWordsSummary}
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <article className="rounded-xl bg-[#0d121c] border border-stone-700 p-4">
            <p className="text-xs font-bold text-amber-300 mb-2">1 · What we know</p>
            <p className="text-sm text-stone-200">{analysis.userWordsSummary}</p>
          </article>
          <article className="rounded-xl bg-[#0d1822] border border-cyan-500/30 p-4">
            <p className="text-xs font-bold text-cyan-300 mb-2">2 · What might explain it</p>
            <p className="text-sm text-stone-100">{analysis.underneathMechanism}</p>
          </article>
          <article className="rounded-xl bg-[#101b16] border border-emerald-500/30 p-4">
            <p className="text-xs font-bold text-emerald-300 mb-2">3 · Best next check</p>
            <p className="text-sm text-stone-100">
              {analysis.roundTableSynthesis?.nextCheck || analysis.unresolvedQuestion?.testablePossibility || 'Identify what evidence would distinguish the possible explanations.'}
            </p>
          </article>
        </div>
        <p className="text-xs text-stone-400">A useful explanation is a starting hypothesis, not a verdict. Check the evidence before acting.</p>
      </section>

      {/* 2. Clean, Story-Driven Exploration Tabs */}
      <div className="relative z-20">
        <div className="flex items-center justify-between pb-3 mb-1">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-400 font-bold">
            Explore This Discovery:
          </span>
          <span className="text-xs text-amber-400 font-serif italic hidden sm:inline">
            Tap any path to reveal a new angle on your situation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {navTabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTab(t.id)}
                className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-br from-[#1a2133] to-[#121624] border-amber-400 shadow-xl shadow-amber-950/30 text-white'
                    : 'bg-[#10131d] border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-300 flex items-center gap-2">
                      <span className={isActive ? 'text-amber-400' : 'text-stone-500'}>
                        {t.icon}
                      </span>
                      <span>{t.label}</span>
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-400 leading-tight mt-1 line-clamp-2">
                  {t.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 0: LIVING DISCOVERY MAP (The Flagship Living Constellation) */}
      {activeTab === 'map' && (
        <InteractiveDiscoveryMap
          analysis={analysis}
          persona={persona}
          appName={appName}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onOpenResearchLab={onOpenResearchLab}
          onNavigateTab={(tab) => handleSelectTab(tab)}
        />
      )}

      {/* TAB 1: YOUR STORY & DECISIONS */}
      {activeTab === 'story' && (
        <section className="space-y-8 animate-fade-in">
          {/* Cause and Effect Flow with Branching Decisions */}
          {storyChainData ? (
            <InteractiveStoryChain chainData={storyChainData} />
          ) : (
            <p className="rounded-2xl border border-stone-700 bg-[#141822] p-5 text-sm text-stone-300">
              This situation has no cause-and-effect chain yet. REMEMBER will not substitute another person's story.
            </p>
          )}

          {/* Scale Ladder: Two People -> Workplace/Family -> History/Nature */}
          {scaleConnectionsData?.length ? (
            <BiggerConnectionsLadder connections={scaleConnectionsData} />
          ) : (
            <p className="rounded-2xl border border-stone-700 bg-[#141822] p-5 text-sm text-stone-300">
              No scale comparison has been supplied for this situation.
            </p>
          )}

          {/* Side-by-Side Story Parallels */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Possible Parallels to Compare
                </h3>
                <p className="text-xs sm:text-sm text-stone-400">
                  Compare the shared function, crucial differences and quality of the sources:
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-[#161a24] px-3 py-1 rounded-lg border border-stone-800">
                {analysis.stories.length} Parallels
              </span>
            </div>

            {analysis.stories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysis.stories.map((story, idx) => (
                  <StoryCard
                    key={story.id || idx}
                    story={story}
                    index={idx}
                    onExplore={(s) => setSelectedStory(s)}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-5 text-sm text-amber-100">
                No source-backed historical parallel was supplied. Cross-examination can explore possible connections and what would challenge them.
              </p>
            )}
          </div>

          {/* Character Swap */}
          {analysis.stories.length > 0 && (
            <InteractiveCharacterSwap
              stories={analysis.stories}
              userWordsSummary={analysis.userWordsSummary}
            />
          )}
          <CrossExaminationPanel
            focus="parallels"
            result={crossExam}
            busy={crossExamBusy}
            error={crossExamError}
            onRun={runCrossExamination}
          />
        </section>
      )}

      {/* TAB 2: CROSS-DOMAIN DISCOVERY (The Visual Bridge!) */}
      {activeTab === 'bridge' && (
        <section className="space-y-8 animate-fade-in">
          <CrossDomainVisualBridge
            analysis={analysis}
            onOpenResearchLab={onOpenResearchLab}
          />

          <details className="rounded-2xl border border-stone-700 bg-[#111822] p-4 sm:p-5">
            <summary className="cursor-pointer text-sm text-cyan-200 font-semibold">More: what differs and what might transfer</summary>
          {/* What's Different & Why It Matters */}
          <div className="bg-[#141822] rounded-3xl border border-stone-800 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  What's Different & Why Those Differences Matter
                </h3>
                <p className="text-xs text-stone-400 font-medium">
                  What appears similar may have different causes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {analysis.crucialDifferences.map((diff, i) => (
                <div
                  key={i}
                  className="bg-[#0e1118] rounded-2xl border border-stone-800 p-5 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-sm font-serif font-bold text-amber-300 mb-2">
                      {diff.title}
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed mb-3">
                      <span className="font-semibold text-stone-400">The Contrast: </span>
                      {diff.comparison}
                    </p>
                  </div>
                  <div className="bg-[#181c27] rounded-xl p-3 border border-rose-500/30 text-xs text-rose-200 leading-relaxed font-medium">
                    <span className="font-bold text-rose-300 block mb-0.5">Why it matters:</span>
                    {diff.whyThisDifferenceMatters}
                  </div>
                </div>
              ))}
            </div>

            {/* Plausibility Check */}
            <div className="mt-6 pt-5 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-stone-400">Connection Claim (Not Verified):</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${plausibilityBadge.color}`}>
                  {plausibilityBadge.label}
                </span>
              </div>
              <p className="text-xs text-stone-300 sm:max-w-xl leading-relaxed">
                {analysis.plausibility.analysis}
                <span className="block mt-2 text-amber-200">Model-generated assessment; no independent mechanism verification has been performed.</span>
              </p>
            </div>
          </div>

          {/* The Borrowed Insight */}
          <div className="bg-gradient-to-br from-amber-950/30 via-[#171b26] to-[#12151e] rounded-3xl border border-amber-500/40 p-6 sm:p-9 shadow-2xl relative overflow-hidden">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 shrink-0 mt-1">
                <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  The Proposed Transfer ({analysis.borrowedInsight.donorField} &rarr; Current Question)
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                  "A possible connection from another field"
                </h3>

                <div className="bg-[#0d1017] rounded-2xl p-5 border border-amber-500/25 text-stone-200 text-sm sm:text-base leading-relaxed">
                  <p className="text-amber-200 font-semibold mb-2">
                    Candidate finding from {analysis.borrowedInsight.donorField} — needs a source check:
                  </p>
                  <p className="text-stone-300 mb-4 italic">
                    "{analysis.borrowedInsight.whatWasLearnedThere}"
                  </p>
                  <div className="pt-3 border-t border-stone-800">
                    <span className="text-amber-400 font-mono text-xs uppercase tracking-wider block mb-1 font-bold">
                      Possible Application — Verify Before Acting:
                    </span>
                    <p className="text-white font-medium">
                      {analysis.borrowedInsight.howItAppliesHere}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </details>
          <CrossExaminationPanel
            focus="mechanism"
            result={crossExam}
            busy={crossExamBusy}
            error={crossExamError}
            onRun={runCrossExamination}
          />
        </section>
      )}

      {/* TAB 3: THROUGH THE ERAS (Time Continuum) */}
      {activeTab === 'eras' && (
        <section className="space-y-8 animate-fade-in">
          {analysis.isCustomGenerated && analysis.eras?.length !== 5 ? (
            <p role="status" className="rounded-2xl border border-stone-700 bg-[#141822] p-5 text-sm text-stone-300">
              No period-specific example was supplied. Cross-examination below can test whether a historically plausible functional comparison exists.
            </p>
          ) : (
            <InteractiveDimensionSlider
              currentDilemma={analysis.userOriginalInput || analysis.userWordsSummary}
              underneathMechanism={analysis.underneathMechanism}
              eras={analysis.eras}
            />
          )}

          <CrossExaminationPanel
            focus="eras"
            result={crossExam}
            busy={crossExamBusy}
            error={crossExamError}
            onRun={runCrossExamination}
          />

          {/* Hypothetical divergent paths are not historical events. */}
          {analysis.differenceThatChangesEverything && (
            <DifferenceThatChangesEverythingView diff={analysis.differenceThatChangesEverything} />
          )}
        </section>
      )}

      {/* TAB 4: THE LIVING ROSETTA STONE & LIFE LENSES */}
      {activeTab === 'rosetta' && (
        <section className="space-y-8 animate-fade-in">
          {/* Life Lenses (Starting Out, Carrying the Load, Looking Back) */}
          {rosettaStoneData ? (
            <>
              <LifeLensViewer lenses={rosettaStoneData.lifeLenses} />
              {/* Perspective Translation (Said vs Meant vs Heard vs Felt) */}
              <RosettaStoneTranslator rosettaStone={rosettaStoneData} />
            </>
          ) : (
            <p role="status" className="rounded-2xl border border-stone-700 bg-[#141822] p-5 text-sm text-stone-300">
              This situation has not been translated through the life lenses yet. REMEMBER will not display another situation's interpretation.
            </p>
          )}

          {/* Two-way interpretation, role and information-update bridge */}
          <MeaningSynchronizationView comparison={analysis.meaningSynchronization} />

          {/* Question-selected Round Table perspectives */}
          {analysis.roundTable && (
            <RoundTableView
              perspectives={analysis.roundTable}
              synthesis={analysis.roundTableSynthesis}
              routing={analysis.questionRouting}
            />
          )}

          {/* Same mechanism mapped across different systems */}
          <MechanismBridgeView key={analysis.id} bridges={analysis.mechanismBridges} />

          {/* Mirror Effect */}
          {analysis.mirrorEffect && (
            <MirrorEffectCard mirror={analysis.mirrorEffect} />
          )}

          {/* What-If Simulator */}
          {analysis.whatIfScenarios && (
            <WhatIfPlayground
              scenarios={analysis.whatIfScenarios}
              currentDilemma={analysis.userWordsSummary}
            />
          )}

          {/* Principle 7: You Own Your Meaning Widget */}
          <ResonanceCheckWidget
            initialVerdict={analysis.userResonanceVerdict || 'resonates'}
            initialNote={analysis.userPersonalTakeaway || ''}
            onSaveVerdict={(verdict, note) => {
              analysis.userResonanceVerdict = verdict;
              analysis.userPersonalTakeaway = note;
            }}
          />
        </section>
      )}

      {/* Actions are available without repeating the answer or a stock closing speech. */}
      <div className="flex flex-wrap items-center gap-3 justify-end border-t border-stone-800 pt-5">
        <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-700 text-sm text-stone-200 cursor-pointer hover:border-amber-400">
          <Share2 className="w-4 h-4" />{copied ? 'Copied!' : 'Share'}
        </button>
        <button onClick={onOpenResearchLab} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/40 text-sm text-emerald-200 cursor-pointer hover:border-emerald-400">
          <FlaskConical className="w-4 h-4" /> Research Lab
        </button>
        <button onClick={onNewStory} className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-bold cursor-pointer">New Question</button>
      </div>

      {/* Modal for exploring specific story history */}
      <StoryHistoryModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </div>
  );
};
