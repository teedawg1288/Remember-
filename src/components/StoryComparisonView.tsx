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
  LivingRosettaStone,
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
import { InteractiveDiscoveryMap } from './InteractiveDiscoveryMap';
import { sound } from '../audio/soundEngine';

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

  const getPlausibilityBadge = (category: string) => {
    switch (category) {
      case 'structural_isomorphism':
        return {
          label: 'Deep Structural Mechanism',
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        };
      case 'repeating_human_behavior':
        return {
          label: 'Evolved Behavioral Pattern',
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        };
      case 'shared_cultural_origin':
        return {
          label: 'Shared Cultural Root',
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

  // Fallback interactive story chain
  const storyChainData: InteractiveStoryChainData = analysis.storyChain || {
    defaultChain: {
      whatHappened: analysis.userWordsSummary || 'A stressful situation began developing.',
      whatYouThought: '"This is unfair and they are doing this intentionally."',
      whatYouDid: 'Reacted defensively, escalating the tension.',
      whatHappenedNext: 'The misunderstanding compounded and both sides pulled away.',
    },
    alternativeChain: {
      tapPrompt: 'What if there was a simple, harmless explanation?',
      whatActuallyHappened: 'A common misunderstanding or unseen situational stress.',
      whatYouThought: '"They are probably just tied up right now. Let me check."',
      whatYouDid: 'Asked a calm, curious question without an accusatory tone.',
      whatHappenedNext: 'The tension evaporated and mutual understanding was reached.',
      lesson: 'Curiosity de-escalates conflicts that pride escalates.',
    },
  };

  // Fallback scale connections
  const scaleConnectionsData: ScaleConnection[] = analysis.scaleConnections || [
    {
      level: 'personal',
      levelLabel: 'Between Two People',
      title: 'The Interpersonal Friction',
      setting: 'One-on-one personal relationship or texting',
      howItAppearsHere: analysis.userWordsSummary,
      whatIsTheSame: 'Assumptions and missing information drive defensive reactions.',
      whatIsDifferent: 'Informal emotional context with immediate feedback loops.',
      whyTheDifferenceMatters: 'A single clarifying conversation can dissolve the dispute.',
    },
    {
      level: 'group',
      levelLabel: 'In a Workplace or Family',
      title: 'The Group Dynamic Trap',
      setting: 'Department team or household group',
      howItAppearsHere: 'Multiple people experience the same friction and wait for leadership to fix it.',
      whatIsTheSame: 'Diffusion of responsibility and unexpressed expectations.',
      whatIsDifferent: 'Hierarchies and organizational stakes make direct speaking harder.',
      whyTheDifferenceMatters: 'Clear written agreements prevent collective burnout.',
    },
    {
      level: 'world',
      levelLabel: 'In Nature, Cities or History',
      title: 'The Systemic Historical Dynamic',
      setting: 'Geopolitical treaties or biological systems',
      howItAppearsHere: analysis.underneathMechanism,
      whatIsTheSame: 'Underlying systemic feedback loop operates independently of the actors.',
      whatIsDifferent: 'Scale involves thousands or millions of entities.',
      whyTheDifferenceMatters: 'Structural governors and feedback dampers are required at scale.',
    },
  ];

  // Living Rosetta Stone data
  const rosettaStoneData: LivingRosettaStone = analysis.rosettaStone || {
    primaryChord: 'Belonging',
    secondaryChords: ['Fear', 'Responsibility', 'Conflict'],
    oneQuestionThatChangesEverything: {
      question: 'If they were silently dealing with something painful right now, how would you speak to them?',
      whyItShiftsTheLens: "This question strips away wounded ego and reconnects you to the person's humanity.",
    },
    translations: [
      {
        speakerA: {
          role: 'Speaker A (You / The Reacher)',
          said: analysis.userWordsSummary,
          meant: 'I want to feel connected and know that our relationship is safe and valued.',
          hiddenNeedOrEmotion: 'Vulnerability and fear of being quietly discarded.',
        },
        speakerB: {
          role: 'Speaker B (The Other Person)',
          heard: 'You are demanding attention or compliance when my resources are already at zero.',
          understoodMeaning: 'They understood this to mean that you think they are selfish or falling short as a friend/partner, and that you are keeping score.',
          isConfirmedInterpretation: false,
          felt: 'Overwhelmed, defensive, and judged before being understood.',
          reactionTriggered: 'Defensive silence or cold avoidance.',
          consequenceOfReaction: 'A compound freeze began where both people waited for the other to apologize first, stretching days into weeks.',
        },
        meaningShiftPoint: 'The vulnerable request for reassurance was expressed as silence/distance, which the other person decoded as an unspoken attack on their adequacy.',
        whereTranslationFailed:
          'A call for reassurance was expressed as silence/withdrawal, and received as an accusation.',
        theBridge:
          'Hey, I noticed things felt distant between us. I care about you and just wanted to check in with zero pressure.',
        crossFieldTranslation: {
          scientificConcept: 'Signal Attenuation vs Signal Rejection',
          everydayExperience: 'Assuming that static on a radio line means the radio station hates you.',
        },
      },
    ],
    lifeLenses: [
      {
        stageId: 'starting_out',
        stageTitle: 'Starting Out (Pride)',
        tagline: 'When every silence feels like an insult to your dignity',
        howItAppearsHere:
          "You keep score. You think: 'If they don't reach out, I won't reach out either. I have my pride.'",
        whatYouCouldNotSeeThen: 'That keeping score in human relationships guarantees both people lose.',
        theSongMetaphor: 'Listening to furious breakup anthems feeling completely justified in burning the bridge.',
      },
      {
        stageId: 'heavy_lifting',
        stageTitle: 'Carrying The Load (Responsibility)',
        tagline: 'When life is heavy enough that you understand why people collapse',
        howItAppearsHere:
          'You look at your own unanswered texts and unwashed dishes. You realize people rarely hurt you on purpose; they are just drowning in their own exhaustion.',
        whatYouCouldNotSeeThen: 'That human bandwidth is fragile, and silence is usually fatigue, not malice.',
        theSongMetaphor: 'Hearing a quiet folk song about aging parents or tired workers and tearing up on the highway.',
      },
      {
        stageId: 'looking_back',
        stageTitle: 'Looking Back (Grace)',
        tagline: 'When pride seems completely meaningless compared to connection',
        howItAppearsHere:
          'You pick up the phone and laugh. Life is too short, friends are too rare, and holding a grudge over a missing text seems absurd.',
        whatYouCouldNotSeeThen: 'That being "right" is cold and empty compared to staying close.',
        theSongMetaphor: 'Smiling at old songs you once cried to, because you understand every character in the story now.',
      },
    ],
    vignetteCreation: {
      title: 'The Train Window',
      type: 'micro_story',
      text: 'Two friends sat on opposite ends of the same platform, each staring at their own phone, each waiting for the other to say the first word. The train pulled in, parted them, and carried them in opposite directions.',
      sensoryImage: 'The sudden blast of air as a silver train rumbles between two people.',
    },
  };

  const navTabs = [
    {
      id: 'map' as const,
      label: 'Living Discovery Map',
      icon: <Compass className="w-4 h-4" />,
      desc: 'Interactive constellation, visual transformations & simulations',
    },
    {
      id: 'story' as const,
      label: 'Your Story & Decisions',
      icon: <Eye className="w-4 h-4" />,
      desc: 'The diagnosis, decision tree & historical parallels',
    },
    {
      id: 'bridge' as const,
      label: 'Cross-Domain Discovery',
      icon: <Radio className="w-4 h-4" />,
      desc: 'Visual blueprint & real-world test',
    },
    {
      id: 'eras' as const,
      label: 'Through The Eras',
      icon: <History className="w-4 h-4" />,
      desc: '3,400-year time portal across civilizations',
    },
    {
      id: 'rosetta' as const,
      label: 'The Living Rosetta Stone',
      icon: <Disc3 className="w-4 h-4" />,
      desc: 'Life lenses & perspective translation',
    },
  ];

  const handleSelectTab = (t: typeof activeTab) => {
    setActiveTab(t);
    sound.playNodeChime(450);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 animate-fade-in space-y-10">
      {/* 1. Barbershop Conversational Hook & Diagnosis */}
      <section className="bg-gradient-to-b from-[#181d28] via-[#12151e] to-[#0d1017] rounded-3xl border border-amber-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-200 border border-amber-500/30 text-xs font-semibold">
              {persona === 'barber' ? (
                <Scissors className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Wine className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>
                {persona === 'barber'
                  ? 'The Barber Chair · Street-Smart Diagnosis'
                  : 'Late Night Counter · Deep Reflection'}
              </span>
            </div>

            {onToggleSave && (
              <button
                onClick={() => {
                  onToggleSave();
                  sound.playDiscoveryChime();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-amber-600/30 text-amber-300 border-amber-500/50'
                    : 'bg-[#181c26] text-stone-300 border-stone-700 hover:border-stone-500'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isSaved ? 'Saved to Vault' : 'Save Discovery'}</span>
              </button>
            )}
          </div>

          {/* Conversational Opener Hook */}
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight text-balance">
            "{analysis.barberOpener}"
          </h1>

          {/* User's situation in plain words */}
          <div className="bg-[#0b0e14]/80 border border-stone-800 rounded-2xl p-4 sm:p-5 text-stone-200 text-sm sm:text-base leading-relaxed">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-wider block mb-1 font-bold">
              Your Situation in Plain Words:
            </span>
            "{analysis.userWordsSummary}"
          </div>

          {/* The Underneath Mechanism (Clean all-around border) */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 sm:p-6 space-y-2">
            <span className="text-amber-300 font-semibold font-serif text-lg sm:text-xl block">
              "Different people, different places, but look at what's happening underneath:"
            </span>
            <p className="text-stone-100 text-sm sm:text-base leading-relaxed font-sans">
              {analysis.underneathMechanism}
            </p>
          </div>
        </div>
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
          <InteractiveStoryChain chainData={storyChainData} />

          {/* Scale Ladder: Two People -> Workplace/Family -> History/Nature */}
          <BiggerConnectionsLadder connections={scaleConnectionsData} />

          {/* Side-by-Side Story Parallels */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Where This Exact Story Played Out Before
                </h3>
                <p className="text-xs sm:text-sm text-stone-400">
                  Different characters and time periods, but the exact same human dynamic:
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-[#161a24] px-3 py-1 rounded-lg border border-stone-800">
                {analysis.stories.length} Parallels
              </span>
            </div>

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
          </div>

          {/* Character Swap */}
          <InteractiveCharacterSwap
            stories={analysis.stories}
            userWordsSummary={analysis.userWordsSummary}
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
                  REMEMBER's Rule: Never assume two situations are identical just because they look similar.
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
                <span className="text-xs font-mono uppercase text-stone-400">Connection Integrity:</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${plausibilityBadge.color}`}>
                  {plausibilityBadge.label}
                </span>
              </div>
              <p className="text-xs text-stone-300 sm:max-w-xl leading-relaxed">
                {analysis.plausibility.analysis}
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
                  The Borrowed Insight ({analysis.borrowedInsight.donorField} &rarr; Your Life)
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                  "Now here's something they figured out in another field that might help us understand this."
                </h3>

                <div className="bg-[#0d1017] rounded-2xl p-5 border border-amber-500/25 text-stone-200 text-sm sm:text-base leading-relaxed">
                  <p className="text-amber-200 font-semibold mb-2">
                    What was already established in {analysis.borrowedInsight.donorField}:
                  </p>
                  <p className="text-stone-300 mb-4 italic">
                    "{analysis.borrowedInsight.whatWasLearnedThere}"
                  </p>
                  <div className="pt-3 border-t border-stone-800">
                    <span className="text-amber-400 font-mono text-xs uppercase tracking-wider block mb-1 font-bold">
                      How To Apply It Right Now:
                    </span>
                    <p className="text-white font-medium">
                      {analysis.borrowedInsight.howItAppliesHere}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: THROUGH THE ERAS (Time Continuum) */}
      {activeTab === 'eras' && (
        <section className="space-y-8 animate-fade-in">
          <InteractiveDimensionSlider
            currentDilemma={analysis.userOriginalInput || analysis.userWordsSummary}
            underneathMechanism={analysis.underneathMechanism}
            eras={analysis.eras}
          />

          {/* Divergence: Case A Survived vs Case B Collapsed */}
          {analysis.differenceThatChangesEverything && (
            <DifferenceThatChangesEverythingView diff={analysis.differenceThatChangesEverything} />
          )}
        </section>
      )}

      {/* TAB 4: THE LIVING ROSETTA STONE & LIFE LENSES */}
      {activeTab === 'rosetta' && (
        <section className="space-y-8 animate-fade-in">
          {/* Life Lenses (Starting Out, Carrying the Load, Looking Back) */}
          <LifeLensViewer lenses={rosettaStoneData.lifeLenses} />

          {/* Perspective Translation (Said vs Meant vs Heard vs Felt) */}
          <RosettaStoneTranslator rosettaStone={rosettaStoneData} />

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

      {/* The Horizon Question */}
      <section className="bg-[#151924] rounded-3xl border border-cyan-500/30 p-6 sm:p-8 shadow-xl">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 shrink-0 mt-1">
            <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div className="space-y-3 max-w-4xl">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              The Horizon Question
            </span>
            <h3 className="font-serif text-xl sm:text-3xl font-bold text-white leading-snug">
              "{analysis.unresolvedQuestion.conversationalHook}"
            </h3>
            <p className="text-base sm:text-lg text-stone-200 leading-relaxed font-medium">
              {analysis.unresolvedQuestion.novelQuestion}
            </p>

            <div className="bg-[#0e111a] rounded-xl p-4 border border-cyan-500/20 text-xs sm:text-sm text-cyan-200 leading-relaxed">
              <span className="font-mono uppercase text-[10px] text-cyan-400 font-bold block mb-1">
                How We Could Actually Test This:
              </span>
              {analysis.unresolvedQuestion.testablePossibility}
            </div>
          </div>
        </div>
      </section>

      {/* Parting Barbershop Wisdom & Actions */}
      <section className="bg-[#12151d] rounded-2xl border border-stone-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 max-w-2xl">
          <div className="w-12 h-12 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-300 font-serif font-bold text-lg">
            "
          </div>
          <p className="text-stone-300 text-sm sm:text-base italic font-serif leading-relaxed">
            {analysis.barberClosingWisdom}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c212e] hover:bg-[#252c3d] text-stone-200 text-xs font-semibold border border-stone-700 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Copied Takeaway!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Share Story</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenResearchLab}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-all cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span>Research Lab</span>
          </button>

          <button
            onClick={onNewStory}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <span>Ask Another Story</span>
          </button>
        </div>
      </section>

      {/* Modal for exploring specific story history */}
      <StoryHistoryModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </div>
  );
};
