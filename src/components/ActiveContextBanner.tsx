import React, { useState } from 'react';
import {
  ActiveProblemContext,
  ScreenId,
} from '../types/translation';
import {
  Sparkles,
  Compass,
  Lightbulb,
  FileSearch,
  Scale,
  Footprints,
  History,
  Bookmark,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Milestone,
} from 'lucide-react';

interface ActiveContextBannerProps {
  context: ActiveProblemContext | null;
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  onClearContext: () => void;
  onSwitchAnalogy?: (analogy: string) => void;
  hasActiveTranslation?: boolean;
  isCurrentSaved?: boolean;
}

const SCREEN_META: Record<
  ScreenId,
  { label: string; icon: React.FC<{ className?: string }>; tone: string }
> = {
  talk: { label: "Let's Talk", icon: Compass, tone: 'text-teal-400' },
  visual: { label: 'Show Me', icon: Sparkles, tone: 'text-amber-400' },
  discoveries: { label: 'My Discoveries', icon: Bookmark, tone: 'text-indigo-400' },
  discover: { label: 'Discover & Triage', icon: Compass, tone: 'text-teal-400' },
  understand: { label: 'Analogy & Dynamics', icon: Lightbulb, tone: 'text-amber-400' },
  uncover: { label: 'Blind Spots', icon: FileSearch, tone: 'text-sky-400' },
  reality: { label: 'Reality Check', icon: Scale, tone: 'text-emerald-400' },
  move_forward: { label: 'Get Unstuck', icon: Footprints, tone: 'text-rose-400' },
  same_story: { label: 'Historical Patterns', icon: History, tone: 'text-purple-400' },
  missing_engine: { label: 'Question Engine', icon: Sparkles, tone: 'text-teal-400' },
  journey: { label: 'My Journey', icon: Bookmark, tone: 'text-indigo-400' },
};

export const ActiveContextBanner: React.FC<ActiveContextBannerProps> = ({
  context,
  currentScreen,
  onSelectScreen,
  onClearContext,
  onSwitchAnalogy,
  hasActiveTranslation = false,
  isCurrentSaved = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!context) {
    return null;
  }

  const currentMeta = SCREEN_META[currentScreen] || SCREEN_META.discover;
  const CurrentIcon = currentMeta.icon;

  // 5 Discovery Stages of The Last 10%
  const isRealityCompleted = true; // Context exists
  const isObservationCompleted = Boolean(
    context.completedStages?.includes('observation') ||
    currentScreen === 'uncover' ||
    currentScreen === 'reality' ||
    currentScreen === 'same_story' ||
    (context.alternativeScreens && context.alternativeScreens.length > 0)
  );
  const isTranslationCompleted = Boolean(
    context.completedStages?.includes('translation') ||
    hasActiveTranslation ||
    currentScreen === 'understand'
  );
  const isUnderstandingCompleted = Boolean(
    context.completedStages?.includes('understanding') ||
    context.understandingState === 'understood' ||
    Boolean(context.evaluationFeedback?.isAccurate) ||
    Boolean(context.userExplanation)
  );
  const isActionCompleted = Boolean(
    context.completedStages?.includes('action') ||
    Boolean(context.practicalOutsideAction) ||
    isCurrentSaved
  );

  const stages: Array<{
    index: number;
    key: 'reality' | 'observation' | 'translation' | 'understanding' | 'action';
    title: string;
    shortDesc: string;
    screen: ScreenId;
    isCompleted: boolean;
    isCurrent: boolean;
  }> = [
    {
      index: 1,
      key: 'reality',
      title: 'Reality',
      shortDesc: 'Ground truth & intake',
      screen: 'reality',
      isCompleted: isRealityCompleted,
      isCurrent: currentScreen === 'reality' || currentScreen === 'discover',
    },
    {
      index: 2,
      key: 'observation',
      title: 'Observation',
      shortDesc: 'Blind spots & patterns',
      screen: 'uncover',
      isCompleted: isObservationCompleted,
      isCurrent: currentScreen === 'uncover' || currentScreen === 'same_story',
    },
    {
      index: 3,
      key: 'translation',
      title: 'Translation',
      shortDesc: 'Physical analogy bridge',
      screen: 'understand',
      isCompleted: isTranslationCompleted,
      isCurrent: currentScreen === 'understand' && !isUnderstandingCompleted,
    },
    {
      index: 4,
      key: 'understanding',
      title: 'Understanding',
      shortDesc: 'Articulate in own words',
      screen: 'understand',
      isCompleted: isUnderstandingCompleted,
      isCurrent: currentScreen === 'understand' && isTranslationCompleted && !isUnderstandingCompleted,
    },
    {
      index: 5,
      key: 'action',
      title: 'Action',
      shortDesc: 'Outside application',
      screen: 'journey',
      isCompleted: isActionCompleted,
      isCurrent: currentScreen === 'journey' || currentScreen === 'move_forward',
    },
  ];

  const completedCount = stages.filter((s) => s.isCompleted).length;

  // Available transfer targets (excluding current screen and discover/journey)
  const transferScreens: ScreenId[] = [
    'missing_engine',
    'understand',
    'reality',
    'uncover',
    'move_forward',
    'same_story',
  ].filter((s) => s !== currentScreen) as ScreenId[];

  return (
    <aside
      aria-label="Active problem context and quick tool transfers"
      className="w-full bg-slate-950/90 border-b border-slate-800 backdrop-blur-md sticky top-16 z-30 transition-all shadow-md"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5">
        {/* Main Ribbon */}
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Active Context Label & Query */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-750 text-slate-300 font-medium shrink-0">
              <CurrentIcon className={`w-3.5 h-3.5 ${currentMeta.tone}`} />
              <span className="hidden sm:inline text-slate-400 text-xs">Active Lens:</span>
              <span className="text-white text-xs">{currentMeta.label}</span>
            </div>

            <div className="min-w-0 flex-1 flex items-center gap-2">
              <span className="text-slate-400 text-xs hidden md:inline shrink-0">Working on:</span>
              <p className="text-slate-200 font-medium truncate text-xs sm:text-sm">
                &ldquo;{context.originalQuery}&rdquo;
              </p>
            </div>
          </div>

          {/* Segmented Progress Bar: 5 Discovery Stages */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              role="progressbar"
              aria-valuenow={completedCount}
              aria-valuemin={0}
              aria-valuemax={5}
              aria-label={`Discovery progress: ${completedCount} of 5 stages completed for "${context.originalQuery}". Click to view details.`}
              className="group flex items-center gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-850 border border-slate-750 hover:border-slate-700 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              title={`${completedCount} of 5 Discovery Stages completed. Click to explore your journey progress.`}
            >
              {/* Segmented track bars */}
              <div className="flex items-center gap-1 sm:gap-1.5 py-0.5" aria-hidden="true">
                {stages.map((stage) => (
                  <div
                    key={stage.key}
                    className="relative flex flex-col items-center"
                    title={`Stage ${stage.index}: ${stage.title} (${
                      stage.isCompleted ? 'Completed' : stage.isCurrent ? 'Current' : 'Upcoming'
                    })`}
                  >
                    <span
                      className={`h-2 sm:h-2.5 w-2.5 sm:w-4 rounded-[3px] transition-all duration-300 block ${
                        stage.isCompleted
                          ? 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)] ring-1 ring-teal-300/40'
                          : stage.isCurrent
                          ? 'bg-teal-500/60 ring-1 ring-teal-400 animate-pulse'
                          : 'bg-slate-800/90 border border-slate-700/60'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Progress Count Badge */}
              <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
                <span className="text-[11px] font-mono font-bold text-teal-300 whitespace-nowrap">
                  {completedCount}/5
                </span>
                <span className="hidden md:inline text-[11px] text-slate-400 font-medium">
                  {completedCount === 5 ? 'Done' : 'Stages'}
                </span>
              </div>

              {/* Toggle chevron */}
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180 text-teal-400' : 'group-hover:text-slate-300'
                }`}
              />
            </button>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="min-h-[38px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1 text-xs"
              title={isExpanded ? 'Collapse problem transfer details' : 'Show problem routing and transfer options'}
              aria-expanded={isExpanded}
            >
              <span className="hidden sm:inline">Transfer Lenses</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            <button
              onClick={onClearContext}
              className="min-h-[38px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors flex items-center gap-1 text-xs"
              title="Start a new problem inquiry"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">New Inquiry</span>
            </button>
          </div>
        </div>

        {/* Collapsible Transfer Deck */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3 pb-1 animate-fadeIn">
            {/* 5 Discovery Stages Interactive Pathway */}
            <div className="bg-slate-900/90 rounded-2xl p-3 sm:p-4 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>5 Discovery Stages Progress ({completedCount} of 5 Completed)</span>
                </div>
                <span className="text-[11px] font-mono text-teal-400 font-medium">
                  {Math.round((completedCount / 5) * 100)}% Complete
                </span>
              </div>

              {/* 5 Segmented Cards with 1-Tap Stage Jump */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-0.5">
                {stages.map((stage) => (
                  <button
                    key={stage.key}
                    type="button"
                    onClick={() => {
                      onSelectScreen(stage.screen);
                      setIsExpanded(false);
                    }}
                    className={`text-left p-2 rounded-xl border transition-all ${
                      stage.isCompleted
                        ? 'bg-teal-950/40 border-teal-500/50 text-teal-200 hover:bg-teal-950/60'
                        : stage.isCurrent
                        ? 'bg-slate-800 border-teal-400/60 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                        0{stage.index}
                      </span>
                      {stage.isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                      ) : stage.isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      )}
                    </div>
                    <div className="font-semibold text-xs text-white truncate">
                      {stage.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {stage.shortDesc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Triage reason note */}
            {context.triageReason && (
              <div className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-teal-300">Intelligent Routing Guide: </span>
                  {context.triageReason}
                </div>
              </div>
            )}

            {/* Quick 1-Tap Transfer Chips */}
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Apply a different analytical lens to this exact question:
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {transferScreens.map((screen) => {
                  const meta = SCREEN_META[screen];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={screen}
                      onClick={() => {
                        onSelectScreen(screen);
                        setIsExpanded(false);
                      }}
                      className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 hover:border-slate-700 text-slate-200 border border-slate-800 transition-all flex items-center gap-2 text-xs font-medium active:scale-95"
                    >
                      <Icon className={`w-3.5 h-3.5 ${meta.tone}`} />
                      <span>{meta.label}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* If on Understand screen, offer physical analogy quick switchers */}
            {currentScreen === 'understand' && onSwitchAnalogy && (
              <div className="pt-2 border-t border-slate-800/60">
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Sliders className="w-3 h-3 text-amber-400" />
                  <span>Switch Everyday Physical Analogy:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    onClick={() => onSwitchAnalogy('Automobile Hydraulic Brakes & Fluid Pressure')}
                    className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  >
                    🚗 Hydraulic Car Brakes
                  </button>
                  <button
                    onClick={() => onSwitchAnalogy('Workshop Water Piping, Pressure Regulators & Valves')}
                    className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  >
                    🚰 Plumbing Pressure Valves
                  </button>
                  <button
                    onClick={() => onSwitchAnalogy('Mechanical Levers, Fulcrums & Counterweights')}
                    className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  >
                    ⚖️ Counterweight Levers
                  </button>
                  <button
                    onClick={() => onSwitchAnalogy('Home Kitchen Pressure Cooker & Steam Release Valves')}
                    className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  >
                    🍲 Kitchen Pressure Vessel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
