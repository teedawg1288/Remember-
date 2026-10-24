import React, { useState } from 'react';
import {
  ArrowDown,
  Sparkles,
  AlertCircle,
  Brain,
  Footprints,
  Flame,
  CheckCircle2,
  RotateCcw,
  Split,
  Columns,
  Lightbulb,
} from 'lucide-react';
import { InteractiveStoryChainData } from '../types/sameStory';
import { sound } from '../audio/soundEngine';

interface InteractiveStoryChainProps {
  chainData: InteractiveStoryChainData;
}

export const InteractiveStoryChain: React.FC<InteractiveStoryChainProps> = ({ chainData }) => {
  const [isAlternative, setIsAlternative] = useState(false);
  const [viewMode, setViewMode] = useState<'interactive' | 'sideBySide'>('interactive');

  const toggleAlternative = () => {
    const nextState = !isAlternative;
    setIsAlternative(nextState);
    if (nextState) {
      sound.playDiscoveryChime();
    } else {
      sound.playNodeChime(440);
    }
  };

  const current = isAlternative ? chainData.alternativeChain : chainData.defaultChain;

  return (
    <div className="bg-[#121620] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Cause & Effect Story Flow</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            {viewMode === 'sideBySide'
              ? 'Compare Both Realities Side-by-Side'
              : isAlternative
              ? 'Alternative Reality: Cycle Broken'
              : 'What Usually Happens: The Misunderstanding'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            See how changing just one assumption at Step 2 completely rewires the ending.
          </p>
        </div>

        {/* View Mode & Tap Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-[#0d1017] p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => {
                setViewMode('interactive');
                sound.playNodeChime(420);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Interactive</span>
            </button>
            <button
              onClick={() => {
                setViewMode('sideBySide');
                sound.playNodeChime(480);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'sideBySide'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: INTERACTIVE SINGLE CHAIN WITH INLINE BRANCHING TRIGGER */}
      {viewMode === 'interactive' && (
        <div className="py-6 sm:py-8 max-w-2xl mx-auto space-y-3 animate-fade-in">
          {/* Top Banner Alert to tap */}
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/30 to-amber-900/10 border border-amber-500/30 mb-2">
            <span className="text-xs text-amber-200 font-medium">
              Currently viewing: <strong className="text-white">{isAlternative ? 'Alternative Path' : 'Default Path'}</strong>
            </span>
            <button
              onClick={toggleAlternative}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isAlternative
                  ? 'bg-stone-800 text-amber-300 border-amber-500/40 hover:bg-stone-700'
                  : 'bg-amber-500 text-stone-950 border-amber-400 hover:bg-amber-400 shadow-md shadow-amber-500/20'
              }`}
            >
              {isAlternative ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Tap: "{chainData.alternativeChain.tapPrompt}"</span>
                </>
              )}
            </button>
          </div>

          {/* Step 1: WHAT HAPPENED */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
              isAlternative ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-[#181d28] border-stone-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-amber-400">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>WHAT HAPPENED</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800">
                The Objective Event
              </span>
            </div>
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
              {isAlternative ? chainData.alternativeChain.whatActuallyHappened : chainData.defaultChain.whatHappened}
            </p>
          </div>

          {/* Connector Arrow 1 */}
          <div className="flex justify-center -my-1 text-stone-600">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 border border-stone-800 text-amber-400/80">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Step 2: WHAT YOU THOUGHT (THE CRITICAL PIVOT POINT) */}
          <div
            className={`p-5 rounded-2xl border-2 transition-all duration-300 relative ${
              isAlternative
                ? 'bg-cyan-950/30 border-cyan-500/50 shadow-xl shadow-cyan-950/30'
                : 'bg-amber-950/20 border-amber-500/40 shadow-xl shadow-amber-950/20'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div
                className={`flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase ${
                  isAlternative ? 'text-cyan-300' : 'text-amber-400'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>WHAT YOU THOUGHT</span>
              </div>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  isAlternative
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30'
                    : 'bg-amber-500/20 text-amber-200 border-amber-500/30'
                }`}
              >
                {isAlternative ? 'New Reframe' : 'The Assumption'}
              </span>
            </div>

            <p
              className={`text-lg sm:text-xl font-serif italic mb-3 ${
                isAlternative ? 'text-cyan-100 font-semibold' : 'text-stone-100'
              }`}
            >
              "{current.whatYouThought}"
            </p>

            {/* Tap Button right inside Step 2 */}
            <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3">
              <span className="text-[11px] text-stone-400">
                {isAlternative
                  ? 'Assumption changed. See how the next steps change below:'
                  : 'Notice this assumption? What if you tried a different thought?'}
              </span>
              <button
                onClick={toggleAlternative}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  isAlternative
                    ? 'bg-stone-900 text-stone-300 border-stone-700 hover:text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-400 shadow'
                }`}
              >
                {isAlternative ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Revert</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Try Alternative</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Connector Arrow 2 */}
          <div className="flex justify-center -my-1 text-stone-600">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 border border-stone-800 text-amber-400/80">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Step 3: WHAT YOU DID */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
              isAlternative ? 'bg-emerald-950/25 border-emerald-500/40' : 'bg-[#181d28] border-stone-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-stone-400">
                <Footprints className="w-4 h-4 text-stone-400" />
                <span>WHAT YOU DID</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800">
                Your Reaction
              </span>
            </div>
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
              {current.whatYouDid}
            </p>
          </div>

          {/* Connector Arrow 3 */}
          <div className="flex justify-center -my-1 text-stone-600">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 border border-stone-800 text-amber-400/80">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Step 4: WHAT HAPPENED NEXT */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
              isAlternative
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-950/30'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div
                className={`flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase ${
                  isAlternative ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isAlternative ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Flame className="w-4 h-4 text-rose-400" />
                )}
                <span>WHAT HAPPENED NEXT</span>
              </div>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  isAlternative
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {isAlternative ? 'Cycle Broken' : 'Self-Fulfilling Trap'}
              </span>
            </div>
            <p
              className={`text-base sm:text-lg font-medium leading-relaxed ${
                isAlternative ? 'text-emerald-100 font-semibold' : 'text-stone-200'
              }`}
            >
              {current.whatHappenedNext}
            </p>
          </div>

          {/* Takeaway / Lesson */}
          {isAlternative && (
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-amber-950/30 border border-emerald-500/30 text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  The Core Principle
                </span>
              </div>
              <p className="text-stone-100 font-serif text-lg font-medium">
                "{chainData.alternativeChain.lesson}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: SIDE-BY-SIDE COMPARISON */}
      {viewMode === 'sideBySide' && (
        <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Left Column: Default Misunderstanding */}
          <div className="bg-[#151924] rounded-2xl border border-rose-500/30 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>The Misunderstanding Trap</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Default Path
              </span>
            </div>

            {/* Step 1 */}
            <div className="bg-[#0f121a] p-3.5 rounded-xl border border-stone-800">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block mb-1">
                1. What Happened
              </span>
              <p className="text-stone-200 text-sm font-medium">{chainData.defaultChain.whatHappened}</p>
            </div>

            <div className="flex justify-center text-stone-600">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Step 2 */}
            <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-500/30">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-1">
                2. What You Thought
              </span>
              <p className="text-stone-100 text-sm font-serif italic">"{chainData.defaultChain.whatYouThought}"</p>
            </div>

            <div className="flex justify-center text-stone-600">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Step 3 */}
            <div className="bg-[#0f121a] p-3.5 rounded-xl border border-stone-800">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block mb-1">
                3. What You Did
              </span>
              <p className="text-stone-200 text-sm font-medium">{chainData.defaultChain.whatYouDid}</p>
            </div>

            <div className="flex justify-center text-stone-600">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Step 4 */}
            <div className="bg-rose-950/30 p-3.5 rounded-xl border border-rose-500/40">
              <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block mb-1">
                4. What Happened Next
              </span>
              <p className="text-stone-200 text-sm font-medium">{chainData.defaultChain.whatHappenedNext}</p>
            </div>
          </div>

          {/* Right Column: Alternative Cycle Broken */}
          <div className="bg-[#121c1f] rounded-2xl border border-emerald-500/40 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>The Cycle Broken</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                Alternative Path
              </span>
            </div>

            {/* Step 1 */}
            <div className="bg-[#0e1619] p-3.5 rounded-xl border border-stone-800">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block mb-1">
                1. What Actually Happened
              </span>
              <p className="text-stone-200 text-sm font-medium">{chainData.alternativeChain.whatActuallyHappened}</p>
            </div>

            <div className="flex justify-center text-stone-600">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Step 2 */}
            <div className="bg-cyan-950/40 p-3.5 rounded-xl border border-cyan-500/40">
              <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold block mb-1">
                2. What You Thought (The Reframe)
              </span>
              <p className="text-cyan-100 text-sm font-serif italic">"{chainData.alternativeChain.whatYouThought}"</p>
            </div>

            <div className="flex justify-center text-stone-600">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Step 3 */}
            <div className="bg-[#0e1619] p-3.5 rounded-xl border border-stone-800">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block mb-1">
                3. What You Did
              </span>
              <p className="text-stone-200 text-sm font-medium">{chainData.alternativeChain.whatYouDid}</p>
            </div>

            <div className="flex justify-center text-stone-600">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Step 4 */}
            <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/50">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                4. What Happened Next
              </span>
              <p className="text-emerald-100 text-sm font-medium">{chainData.alternativeChain.whatHappenedNext}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
