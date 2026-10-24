import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { CrossFieldPrediction } from '../types/sameStory';
import { sound } from '../audio/soundEngine';

interface RealPredictionEngineProps {
  prediction: CrossFieldPrediction;
  currentDilemma: string;
  onPredictionUpdated?: (pred: CrossFieldPrediction) => void;
}

export const RealPredictionEngine: React.FC<RealPredictionEngineProps> = ({
  prediction,
  currentDilemma,
  onPredictionUpdated,
}) => {
  const [activePrediction, setActivePrediction] = useState<CrossFieldPrediction>(prediction);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [userInquiry, setUserInquiry] = useState('');
  const [testOutcome, setTestOutcome] = useState<'worked' | 'mixed' | 'didnt_work' | null>(() => {
    return (localStorage.getItem(`test_outcome_${prediction.id}`) as any) || null;
  });
  const [testNote, setTestNote] = useState<string>(() => {
    return localStorage.getItem(`test_note_${prediction.id}`) || '';
  });
  const [noteSaved, setNoteSaved] = useState(false);

  const handleRunFreshInvestigation = async () => {
    setIsInvestigating(true);
    sound.playNodeChime(540);
    try {
      const res = await fetch('/api/same-story/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentDilemma, userFocus: userInquiry.trim() }),
      });
      const data = await res.json();
      if (data.success && data.prediction) {
        setActivePrediction(data.prediction);
        if (onPredictionUpdated) onPredictionUpdated(data.prediction);
        sound.playDiscoveryChime();
      }
    } catch (err) {
      console.warn('Prediction run failed:', err);
    } finally {
      setIsInvestigating(false);
    }
  };

  const handleSetOutcome = (outcome: 'worked' | 'mixed' | 'didnt_work') => {
    setTestOutcome(outcome);
    localStorage.setItem(`test_outcome_${activePrediction.id}`, outcome);
    sound.playNodeChime(outcome === 'worked' ? 620 : outcome === 'mixed' ? 480 : 360);
  };

  const handleSaveNote = () => {
    localStorage.setItem(`test_note_${activePrediction.id}`, testNote);
    setNoteSaved(true);
    sound.playNodeChime(560);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  // Turn academic confidence ratings into everyday language
  const getFriendlyConfidence = (rating: string) => {
    if (rating.toLowerCase().includes('empirical') || rating.toLowerCase().includes('supported')) {
      return 'Very Strong Odds &bull; Seen It Work Hundreds of Times';
    }
    if (rating.toLowerCase().includes('plausible')) {
      return 'Solid Bet &bull; Works In Most Situations';
    }
    return 'Good Chance &bull; Well Worth Trying';
  };

  return (
    <div className="bg-[#141822] rounded-3xl border border-cyan-500/40 p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-lounge-border/60 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Cross-Action Discovery &bull; Putting It To The Test</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            What Happens If You Try This?
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
            Another field already bumped into this exact wall and figured out the answer. Here’s a simple real-world test you can try right now:
          </p>
        </div>

        {/* Live Re-Run Investigation Button */}
        <button
          onClick={handleRunFreshInvestigation}
          disabled={isInvestigating}
          className="px-4 py-2.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/45 text-cyan-200 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer shadow-md"
        >
          {isInvestigating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
              <span>Looking Across Other Fields...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Try Another Angle</span>
            </>
          )}
        </button>
      </div>

      {/* Where We Borrowed This From Banner */}
      <div className="bg-[#0e111a] rounded-2xl p-4 sm:p-5 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="font-mono uppercase bg-[#18202f] px-3 py-1.5 rounded-xl text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Borrowed From: {activePrediction.donorField}
          </span>
          <ArrowRight className="w-4 h-4 text-cyan-400 hidden sm:inline" />
          <span className="font-mono uppercase bg-[#18202f] px-3 py-1.5 rounded-xl text-cyan-300 border border-cyan-500/30 font-bold">
            For Your Situation: {activePrediction.targetField}
          </span>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
          {getFriendlyConfidence(activePrediction.confidenceRating)}
        </span>
      </div>

      {/* Main Everyday Prediction Card */}
      <div className="bg-gradient-to-br from-cyan-950/20 via-[#151925] to-[#10131d] rounded-2xl p-5 sm:p-7 border border-cyan-500/30 shadow-lg relative z-10 space-y-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
            Here Is What We Bet Will Happen:
          </span>
          <h4 className="font-serif text-lg sm:text-2xl font-bold text-white leading-snug">
            "{activePrediction.falsifiablePrediction}"
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-lounge-border/70 text-xs">
          <div className="bg-[#0f131c] p-3.5 rounded-xl border border-lounge-border/60">
            <span className="text-amber-400 font-bold font-mono text-[11px] uppercase block mb-1">
              The Question Nobody Asked Yet:
            </span>
            <p className="text-stone-200 leading-relaxed">
              {activePrediction.unansweredQuestion}
            </p>
          </div>
          <div className="bg-[#0f131c] p-3.5 rounded-xl border border-lounge-border/60">
            <span className="text-cyan-400 font-bold font-mono text-[11px] uppercase block mb-1">
              What They Figured Out Elsewhere:
            </span>
            <p className="text-stone-200 leading-relaxed">
              {activePrediction.establishedKnowledgeApplied}
            </p>
          </div>
        </div>
      </div>

      {/* How You'll Know It Worked vs Didn't Work */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        <div className="bg-[#0f1516] rounded-2xl border border-emerald-500/30 p-5 space-y-2">
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold block flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            How You Know It Worked:
          </span>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
            {activePrediction.evidenceThatWouldProve}
          </p>
        </div>

        <div className="bg-[#171114] rounded-2xl border border-rose-500/30 p-5 space-y-2">
          <span className="text-xs font-mono uppercase text-rose-400 font-bold block flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-400" />
            How You Know It Didn't Work:
          </span>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
            {activePrediction.evidenceThatWouldDisprove}
          </p>
        </div>
      </div>

      {/* Real-World Action Log: Did You Try This? */}
      <div className="bg-[#0f121a] rounded-2xl border border-lounge-border/80 p-5 space-y-3 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase text-amber-400 font-bold block">
              Did You Try This In Real Life?
            </span>
            <p className="text-xs text-stone-300">
              Tap how it turned out so your personal discoveries grow with your real experience:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSetOutcome('worked')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                testOutcome === 'worked'
                  ? 'bg-emerald-600 text-stone-950 shadow-md'
                  : 'bg-[#181d28] text-stone-300 hover:text-emerald-300 hover:bg-[#1f2636]'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>It Worked!</span>
            </button>

            <button
              onClick={() => handleSetOutcome('mixed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                testOutcome === 'mixed'
                  ? 'bg-amber-600 text-stone-950 shadow-md'
                  : 'bg-[#181d28] text-stone-300 hover:text-amber-300 hover:bg-[#1f2636]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Mixed Result</span>
            </button>

            <button
              onClick={() => handleSetOutcome('didnt_work')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                testOutcome === 'didnt_work'
                  ? 'bg-rose-600 text-stone-950 shadow-md'
                  : 'bg-[#181d28] text-stone-300 hover:text-rose-300 hover:bg-[#1f2636]'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Didn't Work</span>
            </button>
          </div>
        </div>

        {testOutcome && (
          <div className="pt-3 border-t border-lounge-border/50 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={testNote}
              onChange={(e) => setTestNote(e.target.value)}
              placeholder="What happened when you tried it? (e.g., 'Gave them a quick nod next morning, they immediately smiled back')..."
              className="w-full bg-[#090b10] border border-lounge-border rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleSaveNote}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-bold text-xs shrink-0 cursor-pointer transition-colors"
            >
              {noteSaved ? 'Saved!' : 'Save Log'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
