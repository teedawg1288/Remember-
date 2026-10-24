import React, { useState } from 'react';
import {
  Languages,
  Sparkles,
  ArrowRight,
  ArrowDown,
  HelpCircle,
  MessageCircle,
  Ear,
  HeartHandshake,
  CheckCircle2,
  Atom,
  RefreshCw,
  Edit3,
  AlertCircle,
  Check,
  RotateCcw,
  Volume2,
  Split,
  Eye,
} from 'lucide-react';
import { LivingRosettaStone, RosettaTranslationLayer } from '../types/sameStory';
import { sound } from '../audio/soundEngine';

interface RosettaStoneTranslatorProps {
  rosettaStone: LivingRosettaStone;
}

export const RosettaStoneTranslator: React.FC<RosettaStoneTranslatorProps> = ({ rosettaStone }) => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  // State to support correcting/customizing "What they understood it to mean"
  // Keyed by channel/layer index
  const [userEditedMeaning, setUserEditedMeaning] = useState<Record<number, string>>({});
  const [isEditingMeaning, setIsEditingMeaning] = useState<boolean>(false);
  const [editDraft, setEditDraft] = useState<string>('');
  const [confirmedStatus, setConfirmedStatus] = useState<Record<number, boolean>>({});

  const translations = rosettaStone.translations;
  const current = translations[selectedLayerIndex] || translations[0];

  if (!current) return null;

  // Derive the active understood meaning
  const defaultUnderstood =
    current.speakerB.understoodMeaning ||
    (current.speakerB.heard
      ? `They understood this to mean that you were judging them or demanding what they could not provide.`
      : 'They understood this to mean that you are keeping score or withdrawing your goodwill.');

  const activeUnderstood = userEditedMeaning[selectedLayerIndex] !== undefined
    ? userEditedMeaning[selectedLayerIndex]
    : defaultUnderstood;

  const isConfirmed = confirmedStatus[selectedLayerIndex] ?? (current.speakerB.isConfirmedInterpretation || false);
  const isEdited = userEditedMeaning[selectedLayerIndex] !== undefined;

  const handleSelectChannel = (idx: number) => {
    setSelectedLayerIndex(idx);
    setIsEditingMeaning(false);
    sound.playNodeChime(420 + idx * 60);
  };

  const handleStartEdit = () => {
    setEditDraft(activeUnderstood);
    setIsEditingMeaning(true);
    sound.playNodeChime(500);
  };

  const handleSaveEdit = () => {
    if (editDraft.trim()) {
      setUserEditedMeaning((prev) => ({
        ...prev,
        [selectedLayerIndex]: editDraft.trim(),
      }));
      sound.playDiscoveryChime();
    }
    setIsEditingMeaning(false);
  };

  const handleCancelEdit = () => {
    setIsEditingMeaning(false);
  };

  const handleResetDefault = () => {
    setUserEditedMeaning((prev) => {
      const copy = { ...prev };
      delete copy[selectedLayerIndex];
      return copy;
    });
    setConfirmedStatus((prev) => ({
      ...prev,
      [selectedLayerIndex]: false,
    }));
    setIsEditingMeaning(false);
    sound.playNodeChime(380);
  };

  const handleToggleConfirmed = () => {
    const next = !isConfirmed;
    setConfirmedStatus((prev) => ({
      ...prev,
      [selectedLayerIndex]: next,
    }));
    sound.playNodeChime(next ? 640 : 400);
  };

  // Derive Step 7 consequence if not directly provided
  const consequenceOfReaction =
    current.speakerB.consequenceOfReaction ||
    `A compound freeze began where both people retreated into wounded silence, each waiting for the other to reach out first.`;

  // Meaning shift point
  const meaningShiftPoint =
    current.meaningShiftPoint ||
    current.whereTranslationFailed ||
    `The words (or silence) were received through a filter of fatigue and decoded as an attack on adequacy rather than a reach for reassurance.`;

  return (
    <div className="bg-[#121620] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-8">
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header */}
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
            What one person means, what they say, what the other person hears, and what they understand those words to mean are different worlds. Follow the exact 7-stage chain where meaning transforms:
          </p>
        </div>

        {/* Translation Channel Selector */}
        {translations.length > 1 && (
          <div className="flex items-center gap-2 bg-[#0c0e14] p-1.5 rounded-2xl border border-stone-800 shrink-0">
            {translations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectChannel(idx)}
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

      {/* 2. Universal Human Chord Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-stone-400 font-mono">Universal Human Chord:</span>
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

      {/* 3. VISUAL HIGHLIGHT: The Meaning Gap (Stage 1 Intended vs Stage 4 Understood) */}
      <div className="bg-gradient-to-r from-[#171a26] via-[#1a1824] to-[#1e151b] rounded-2xl border border-amber-500/40 p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-stone-800/80">
          <div className="flex items-center gap-2">
            <Split className="w-4 h-4 text-amber-400" />
            <h4 className="font-serif text-base sm:text-lg font-bold text-white">
              The Meaning Divergence: Intended Meaning vs Understood Meaning
            </h4>
          </div>
          <span className="text-[11px] font-mono text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
            Compare Step 1 &rarr; Step 4
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative">
          {/* Left: Speaker A's Intended Meaning */}
          <div className="bg-[#0e111a] p-4 sm:p-5 rounded-xl border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-cyan-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Step 1 &bull; Speaker A Intended to Communicate:
              </span>
              <span className="text-[10px] font-mono text-stone-400">{current.speakerA.role}</span>
            </div>
            <p className="text-cyan-100 font-serif italic text-base sm:text-lg leading-snug">
              "{current.speakerA.meant}"
            </p>
            <span className="text-[11px] font-mono text-cyan-400/80 block pt-1">
              Hidden vulnerability: {current.speakerA.hiddenNeedOrEmotion}
            </span>
          </div>

          {/* Right: Speaker B's Understood Meaning */}
          <div className="bg-[#0e111a] p-4 sm:p-5 rounded-xl border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-rose-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Step 4 &bull; Speaker B Understood It to Mean:
              </span>
              <span className="text-[10px] font-mono text-stone-400">{current.speakerB.role}</span>
            </div>
            <p className="text-rose-100 font-serif italic text-base sm:text-lg leading-snug">
              "{activeUnderstood}"
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isConfirmed
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}>
                {isConfirmed ? '✓ Confirmed by listener' : isEdited ? '✎ Corrected by you' : 'Possible interpretation (Unconfirmed)'}
              </span>
              {!isEditingMeaning && (
                <button
                  onClick={handleStartEdit}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Correct</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. THE FULL 7-STAGE COMMUNICATION SEQUENCE */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
            The Full 7-Stage Communication Arc:
          </span>
          <span className="text-[11px] font-mono text-stone-400">
            Stages 1 through 7
          </span>
        </div>

        <div className="space-y-3.5">
          {/* STAGE 1 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141825] border border-cyan-500/25 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px]">1</span>
                What Speaker A intended to communicate
              </span>
              <span className="text-stone-400 font-mono text-[11px]">{current.speakerA.role}</span>
            </div>
            <p className="text-stone-100 font-serif text-sm sm:text-base leading-relaxed pl-7">
              "{current.speakerA.meant}"
            </p>
            <p className="text-[11px] font-mono text-cyan-400/80 pl-7">
              Underlying need or emotion: {current.speakerA.hiddenNeedOrEmotion}
            </p>
          </div>

          {/* STAGE 2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141825] border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px]">2</span>
                What Speaker A actually said
              </span>
              <span className="text-stone-400 font-mono text-[11px]">The Spoken / Texted Words</span>
            </div>
            <p className="text-stone-200 font-serif italic text-sm sm:text-base leading-relaxed bg-[#0c0e14] p-3 rounded-xl border border-stone-800 pl-4">
              "{current.speakerA.said}"
            </p>
          </div>

          {/* THE EXACT POINT WHERE MEANING CHANGED */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#231a18] to-rose-950/40 border border-amber-500/50 space-y-2 relative">
            <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
              <span className="flex items-center gap-2 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                The Exact Point Where the Meaning Changed
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono">The Filter Gap</span>
            </div>
            <p className="text-stone-200 text-xs sm:text-sm leading-relaxed pl-6">
              {meaningShiftPoint}
            </p>
            {current.crossFieldTranslation && (
              <div className="ml-6 mt-2 pt-2 border-t border-amber-500/20 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                  <Atom className="w-3.5 h-3.5" />
                  Scientific parallel:
                </span>
                <span className="text-stone-300 font-semibold">{current.crossFieldTranslation.scientificConcept}</span>
                <span className="text-stone-400 italic">("{current.crossFieldTranslation.everydayExperience}")</span>
              </div>
            )}
          </div>

          {/* STAGE 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141825] border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px]">3</span>
                What Speaker B heard
              </span>
              <span className="text-stone-400 font-mono text-[11px]">{current.speakerB.role}</span>
            </div>
            <p className="text-stone-200 font-serif italic text-sm sm:text-base leading-relaxed bg-[#0c0e14] p-3 rounded-xl border border-stone-800 pl-4">
              "{current.speakerB.heard}"
            </p>
          </div>

          {/* STAGE 4: WHAT THEY UNDERSTOOD IT TO MEAN (Separate from heard, felt, reacted!) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1c1622] border-2 border-amber-500/60 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-500/20">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px]">4</span>
                <span>WHAT THEY UNDERSTOOD THOSE WORDS TO MEAN</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                  isConfirmed
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {isConfirmed ? 'Confirmed by listener' : isEdited ? 'User-corrected interpretation' : 'Possible interpretation'}
                </span>
              </div>
            </div>

            {/* Non-diagnostic disclaimer */}
            <div className="flex items-start gap-2 text-[11px] text-stone-400 bg-black/40 p-2.5 rounded-xl border border-stone-800">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Epistemic Guardrail:</strong> We cannot know another person's private thoughts as a proven fact. This is a plausible interpretation based on human pattern dynamics. You can correct it below.
              </span>
            </div>

            {/* Main Stage 4 Content or Edit Form */}
            {isEditingMeaning ? (
              <div className="space-y-3 pt-1">
                <label className="text-xs font-mono text-amber-300 block">
                  Edit what Speaker B understood those words to mean:
                </label>
                <textarea
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0c0e14] border border-amber-500/50 rounded-xl p-3 text-sm text-stone-100 focus:outline-none focus:border-amber-400 font-serif leading-relaxed"
                  placeholder="Describe what you believe or confirmed they understood..."
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-500 font-mono">
                    Changes will adjust the comparison in this view.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Correction</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-amber-100 font-serif italic text-base sm:text-lg leading-snug pl-7">
                  "{activeUnderstood}"
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800 text-xs pl-7">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="px-2.5 py-1 rounded-lg bg-[#251f2e] hover:bg-[#322a3d] text-amber-300 text-xs font-mono border border-amber-500/30 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Correct this interpretation</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleConfirmed}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors cursor-pointer flex items-center gap-1 ${
                        isConfirmed
                          ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40'
                          : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{isConfirmed ? 'Listener Confirmed' : 'Mark as Confirmed'}</span>
                    </button>
                  </div>

                  {isEdited && (
                    <button
                      type="button"
                      onClick={handleResetDefault}
                      className="text-[11px] text-stone-400 hover:text-stone-200 underline font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to AI estimate</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* STAGE 5 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141825] border border-rose-500/25 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-rose-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-[10px]">5</span>
                How Speaker B felt about that meaning
              </span>
              <span className="text-stone-400 font-mono text-[11px]">The Emotional Toll</span>
            </div>
            <p className="text-rose-100 font-serif italic text-sm sm:text-base leading-relaxed pl-7">
              "{current.speakerB.felt}"
            </p>
          </div>

          {/* STAGE 6 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141825] border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px]">6</span>
                How Speaker B reacted
              </span>
              <span className="text-stone-400 font-mono text-[11px]">Immediate Behavioral Reflex</span>
            </div>
            <p className="text-stone-100 font-serif text-sm sm:text-base leading-relaxed pl-7">
              {current.speakerB.reactionTriggered}
            </p>
          </div>

          {/* STAGE 7 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#171216] border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-900/40 border border-rose-500/40 flex items-center justify-center text-[10px]">7</span>
                What happened because of the reaction
              </span>
              <span className="text-stone-400 font-mono text-[11px]">The Resulting Impasse / Consequence</span>
            </div>
            <p className="text-stone-200 font-serif text-sm sm:text-base leading-relaxed pl-7">
              {consequenceOfReaction}
            </p>
          </div>
        </div>
      </div>

      {/* 5. THE TRANSLATION BRIDGE (The Solution) */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[#142322] to-cyan-950/30 rounded-2xl border border-emerald-500/40 p-5 sm:p-6 relative z-10">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shrink-0 mt-0.5">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              The Translation Bridge &bull; How to Say It in Their Shared Language:
            </span>
            <p className="text-white text-base sm:text-lg font-serif italic leading-relaxed">
              "{current.theBridge}"
            </p>
            <p className="text-xs text-stone-300 leading-relaxed pt-1">
              When you translate from defensive words to underlying human needs, the friction dissolves because neither person has to defend their dignity.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Lens-Shift Question */}
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

      {/* 7. Creation Vignette */}
      {rosettaStone.vignetteCreation && (
        <div className="p-5 rounded-2xl bg-[#141824]/90 border border-stone-800 text-stone-300 text-xs sm:text-sm leading-relaxed relative z-10">
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
