import React, { useState } from 'react';
import { ArrowLeftRight, Sparkles, Shuffle, ShieldCheck, Check } from 'lucide-react';
import { StoryParallel } from '../types/sameStory';
import { sound } from '../audio/soundEngine';

interface InteractiveCharacterSwapProps {
  stories: StoryParallel[];
  userWordsSummary: string;
}

export const InteractiveCharacterSwap: React.FC<InteractiveCharacterSwapProps> = ({
  stories,
  userWordsSummary,
}) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [swappedIndices, setSwappedIndices] = useState<number[]>([]);
  const activeStory = stories[selectedStoryIndex] || stories[0];

  const handleToggleSwap = (index: number) => {
    sound.playNodeChime(480 + index * 80);
    setSwappedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleResetSwaps = () => {
    sound.playNodeChime(400);
    setSwappedIndices([]);
  };

  return (
    <div className="bg-[#141822] rounded-3xl border border-amber-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold mb-2">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Interactive Puppet Board &bull; Swap The Costumes</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">
            Proof of Invariance: Swap The Characters
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Tap any role pair below to swap your reality with the historical or biological entity. Notice how the underlying dilemma remains identical:
          </p>
        </div>

        {/* Story Selector Pills */}
        <div className="flex items-center gap-1.5 bg-[#0f121a] p-1 rounded-xl border border-lounge-border text-xs shrink-0 self-start sm:self-auto">
          {stories.map((s, idx) => (
            <button
              key={s.id || idx}
              onClick={() => {
                setSelectedStoryIndex(idx);
                setSwappedIndices([]);
                sound.playNodeChime(500);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStoryIndex === idx
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Parallel #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Active Story Banner */}
      <div className="bg-[#0e1119] rounded-2xl p-4 border border-lounge-border/70 mb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
            Currently Swapping Against:
          </span>
          <h4 className="font-serif text-lg font-bold text-white">{activeStory.title}</h4>
          <span className="text-xs text-stone-400 font-mono">Domain: {activeStory.domainLabel}</span>
        </div>

        <button
          onClick={handleResetSwaps}
          className="px-3 py-1.5 rounded-xl bg-[#191d29] hover:bg-[#23293a] text-stone-300 text-xs font-medium border border-lounge-border/60 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Reset Roles</span>
        </button>
      </div>

      {/* Interactive Swappable Character Rows */}
      <div className="space-y-3">
        {activeStory.characterMapping.map((map, idx) => {
          const isSwapped = swappedIndices.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => handleToggleSwap(idx)}
              className={`group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSwapped
                  ? 'bg-cyan-950/25 border-cyan-500/50 shadow-md shadow-cyan-950/30'
                  : 'bg-[#181c27] border-lounge-border/80 hover:border-amber-500/40'
              }`}
            >
              {/* Left Side: Role in your story */}
              <div className="flex-1">
                <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
                  {isSwapped ? 'Costume Swapped Into Reality:' : 'Your Story Role:'}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold text-sm transition-colors ${
                      isSwapped ? 'text-cyan-300 font-mono' : 'text-white font-sans'
                    }`}
                  >
                    {isSwapped ? map.roleInParallelStory : map.roleInUserStory}
                  </span>
                  {isSwapped && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Swapped
                    </span>
                  )}
                </div>
              </div>

              {/* Middle Swap Button */}
              <div className="flex items-center justify-center">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isSwapped
                      ? 'bg-cyan-500 text-stone-950 rotate-180 shadow-lg shadow-cyan-500/20'
                      : 'bg-[#232838] text-amber-400 group-hover:scale-110'
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
              </div>

              {/* Right Side: Role in parallel universe */}
              <div className="flex-1 sm:text-right">
                <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
                  {isSwapped ? 'Your Reality Role in History:' : 'Parallel Entity:'}
                </span>
                <span
                  className={`font-semibold text-sm transition-colors ${
                    isSwapped ? 'text-amber-300 font-sans' : 'text-cyan-300 font-mono'
                  }`}
                >
                  {isSwapped ? map.roleInUserStory : map.roleInParallelStory}
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">
                  ({map.realEntity})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Invariance Takeaway */}
      <div className="mt-6 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-stone-200 leading-relaxed">
          <span className="font-bold text-amber-300 font-serif text-sm block mb-0.5">
            The Structural Invariance Law:
          </span>
          "Whether you plug in <span className="text-amber-200 font-semibold">{activeStory.characterMapping[0]?.roleInUserStory}</span> or{' '}
          <span className="text-cyan-300 font-semibold">{activeStory.characterMapping[0]?.roleInParallelStory}</span>, the mathematical equation governing the failure mode and the solution is identical. The characters are disposable; the pattern is universal."
        </div>
      </div>
    </div>
  );
};
