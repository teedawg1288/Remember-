import React, { useState } from 'react';
import {
  Languages,
  Sparkles,
  ArrowRight,
  HelpCircle,
  MessageCircle,
  Ear,
  HeartHandshake,
  CheckCircle2,
  Atom,
  RefreshCw,
} from 'lucide-react';
import { LivingRosettaStone, RosettaTranslationLayer } from '../types/sameStory';
import { sound } from '../audio/soundEngine';

interface RosettaStoneTranslatorProps {
  rosettaStone: LivingRosettaStone;
}

export const RosettaStoneTranslator: React.FC<RosettaStoneTranslatorProps> = ({ rosettaStone }) => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  const translations = rosettaStone.translations;
  const current = translations[selectedLayerIndex] || translations[0];

  const handleSelect = (idx: number) => {
    setSelectedLayerIndex(idx);
    sound.playNodeChime(420 + idx * 60);
  };

  return (
    <div className="bg-[#121620] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>The Living Rosetta Stone &bull; Translating Meaning</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Translate Experiences, Not Just Words
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            What one person means, what they say, and what the other person hears are often three completely different languages. Here is one possible interpretation of where the translation broke down; the speakers would have to confirm what they meant:
          </p>
        </div>

        {/* Translation Channel Selector */}
        {translations.length > 1 && (
          <div className="flex items-center gap-2 bg-[#0c0e14] p-1.5 rounded-2xl border border-stone-800 shrink-0">
            {translations.map((t, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  idx === selectedLayerIndex
                    ? 'bg-amber-500 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Channel {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* The Universal Human Chord Badge */}
      <div className="my-5 flex flex-wrap items-center gap-2">
        <span className="text-xs text-stone-400 font-mono">Shared Human Chord:</span>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          {rosettaStone.primaryChord}
        </span>
        {rosettaStone.secondaryChords?.map((chord) => (
          <span
            key={chord}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-800 text-stone-300 border border-stone-700"
          >
            {chord}
          </span>
        ))}
      </div>

      {/* 3-Column Rosetta Stone Translation Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6 relative z-10">
        {/* Column 1: Speaker A (What Was Said vs What Was Meant) */}
        <div className="bg-[#161a25] rounded-2xl border border-stone-800 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider pb-2 border-b border-stone-800">
            <MessageCircle className="w-4 h-4" />
            <span>{current.speakerA.role}</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
              What they actually said:
            </span>
            <p className="text-stone-100 font-serif italic text-base bg-[#0e1118] p-3 rounded-xl border border-stone-800">
              "{current.speakerA.said}"
            </p>
          </div>

          <div className="bg-cyan-950/20 border border-cyan-500/30 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block mb-1">
              What they might have meant:
            </span>
            <p className="text-cyan-100 text-sm font-medium leading-relaxed">
              "{current.speakerA.meant}"
            </p>
            <span className="text-[11px] text-cyan-300/80 mt-2 block italic">
              Possible emotion: {current.speakerA.hiddenNeedOrEmotion}
            </span>
          </div>
        </div>

        {/* Column 2: The Translation Breakdown (The Gap) */}
        <div className="bg-[#1f191b] rounded-2xl border border-rose-500/30 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider pb-2 border-b border-rose-500/20">
              <HelpCircle className="w-4 h-4" />
              <span>Where Translation Failed</span>
            </div>

            <div className="mt-4 space-y-3">
              <span className="text-xs text-rose-200/90 leading-relaxed block">
                {current.whereTranslationFailed}
              </span>

              {current.crossFieldTranslation && (
                <div className="bg-stone-900/80 rounded-xl p-3 border border-stone-800 text-xs text-stone-300 space-y-1 mt-3">
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] uppercase font-bold">
                    <Atom className="w-3.5 h-3.5" />
                    <span>Scientific Equivalent:</span>
                  </div>
                  <p className="font-semibold text-stone-200">
                    {current.crossFieldTranslation.scientificConcept}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    "{current.crossFieldTranslation.everydayExperience}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="text-center pt-3 border-t border-rose-500/20">
            <span className="text-[10px] font-mono text-rose-300 uppercase tracking-widest font-bold">
              Two People &bull; One Gap
            </span>
          </div>
        </div>

        {/* Column 3: Speaker B (What Was Heard & Felt) */}
        <div className="bg-[#161a25] rounded-2xl border border-stone-800 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider pb-2 border-b border-stone-800">
            <Ear className="w-4 h-4" />
            <span>{current.speakerB.role}</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
              What they may have heard:
            </span>
            <p className="text-stone-100 font-serif italic text-base bg-[#0e1118] p-3 rounded-xl border border-stone-800">
              "{current.speakerB.heard}"
            </p>
          </div>

          <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block mb-1">
              What it felt like:
            </span>
            <p className="text-amber-100 text-sm font-medium leading-relaxed">
              "{current.speakerB.felt}"
            </p>
            <span className="text-[11px] text-rose-300/90 mt-2 block font-medium">
              Reaction triggered: {current.speakerB.reactionTriggered}
            </span>
          </div>
        </div>
      </div>

      {/* The Translation Bridge (The Golden Key) */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[#142322] to-cyan-950/30 rounded-2xl border border-emerald-500/40 p-5 sm:p-6 my-6 relative z-10">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shrink-0 mt-0.5">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              A Possible Translation Bridge:
            </span>
            <p className="text-white text-base sm:text-lg font-serif italic leading-relaxed">
              "{current.theBridge}"
            </p>
            <p className="text-xs text-stone-300 leading-relaxed pt-1">
              A clearer translation may reduce friction. It does not guarantee that both people agree or have the same intentions.
            </p>
          </div>
        </div>
      </div>

      {/* Principle 4: The One Question That Changes Everything */}
      {rosettaStone.oneQuestionThatChangesEverything && (
        <div className="bg-[#0e111a] rounded-2xl border border-cyan-500/30 p-5 sm:p-6 text-center space-y-2 relative z-10">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
            The Lens-Shift Question
          </span>
          <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
            "{rosettaStone.oneQuestionThatChangesEverything.question}"
          </h4>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed pt-1">
            {rosettaStone.oneQuestionThatChangesEverything.whyItShiftsTheLens}
          </p>
        </div>
      )}

      {/* Principle 4: Creation Vignette (Micro-Story or Song Analogy) */}
      {rosettaStone.vignetteCreation && (
        <div className="mt-6 p-5 rounded-2xl bg-[#141824]/90 border border-stone-800 text-stone-300 text-xs sm:text-sm leading-relaxed relative z-10">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] uppercase font-bold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>{rosettaStone.vignetteCreation.title}</span>
          </div>
          <p className="italic font-serif text-stone-200 text-sm sm:text-base mb-2">
            "{rosettaStone.vignetteCreation.text}"
          </p>
          <span className="text-[11px] text-stone-400 block">
            Sensory detail: {rosettaStone.vignetteCreation.sensoryImage}
          </span>
        </div>
      )}
    </div>
  );
};
