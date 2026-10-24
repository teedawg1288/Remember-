import React, { useState } from 'react';
import { ThumbsUp, HelpCircle, XCircle, CheckCircle2, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface ResonanceCheckWidgetProps {
  initialVerdict?: 'resonates' | 'partially_resonates' | 'not_my_story';
  initialNote?: string;
  onSaveVerdict?: (verdict: 'resonates' | 'partially_resonates' | 'not_my_story', note: string) => void;
}

export const ResonanceCheckWidget: React.FC<ResonanceCheckWidgetProps> = ({
  initialVerdict = 'resonates',
  initialNote = '',
  onSaveVerdict,
}) => {
  const [verdict, setVerdict] = useState<'resonates' | 'partially_resonates' | 'not_my_story'>(initialVerdict);
  const [note, setNote] = useState(initialNote);
  const [saved, setSaved] = useState(false);

  const handleSelect = (v: typeof verdict) => {
    setVerdict(v);
    sound.playNodeChime(480);
  };

  const handleSave = () => {
    if (onSaveVerdict) {
      onSaveVerdict(verdict, note);
    }
    setSaved(true);
    sound.playDiscoveryChime();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-[#121620] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
            You Own Your Meaning &bull; Does This Resonate?
          </h3>
          <p className="text-xs text-stone-400">
            REMEMBER offers mirrors and translations, but never tells you who you are or what your life means.
          </p>
        </div>
      </div>

      {/* 3 Verdict Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
        <button
          onClick={() => handleSelect('resonates')}
          className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
            verdict === 'resonates'
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-950/40'
              : 'bg-[#161a24] border-stone-800 text-stone-300 hover:border-stone-700'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs mb-1">
            <ThumbsUp className="w-4 h-4 text-emerald-400" />
            <span>This Hits Home</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            The underlying human pattern and translation match what I went through.
          </p>
        </button>

        <button
          onClick={() => handleSelect('partially_resonates')}
          className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
            verdict === 'partially_resonates'
              ? 'bg-amber-950/40 border-amber-500/60 text-amber-200 shadow-md shadow-amber-950/40'
              : 'bg-[#161a24] border-stone-800 text-stone-300 hover:border-stone-700'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs mb-1">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Partially Fits</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            Some elements ring true, but my situation has important differences.
          </p>
        </button>

        <button
          onClick={() => handleSelect('not_my_story')}
          className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
            verdict === 'not_my_story'
              ? 'bg-rose-950/40 border-rose-500/60 text-rose-200 shadow-md shadow-rose-950/40'
              : 'bg-[#161a24] border-stone-800 text-stone-300 hover:border-stone-700'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs mb-1">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Not My Story</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            This comparison misses what actually took place.
          </p>
        </button>
      </div>

      {/* User's Own Meaning (Personal Notes) */}
      <div className="space-y-2 mt-4 pt-4 border-t border-stone-800">
        <label className="text-xs font-mono uppercase tracking-wider text-stone-400 flex items-center justify-between">
          <span>In your own words: What does this mean to you?</span>
          <span className="text-[10px] text-stone-500">Private to your device</span>
        </label>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. 'I realized my anger wasn't about the text, it was about feeling invisible all week...'"
          className="w-full bg-[#0d1017] border border-stone-800 rounded-xl p-3 text-stone-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500/80 transition-all resize-none"
        />
        <div className="flex justify-end pt-1">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all cursor-pointer shadow"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-stone-950" />
                <span>Meaning Saved</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save My Takeaway</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
