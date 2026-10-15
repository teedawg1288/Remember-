import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  Eye,
  RotateCcw
} from 'lucide-react';
import { VisualExploration } from '../../types/translation';

interface VisualExplanationEngineProps {
  unfamiliarTopic: string;
  familiarDomain: string;
  exploration?: VisualExploration;
}

export const VisualExplanationEngine: React.FC<VisualExplanationEngineProps> = ({
  unfamiliarTopic,
  familiarDomain,
  exploration,
}) => {
  // If exploration is not provided or empty, create robust dynamic steps from topics
  const defaultSteps = [
    {
      stepNumber: 1,
      title: 'Initial Intake & Boundary Setting',
      unfamiliarScene: `System intake: Setting boundaries and identifying incoming signals in ${unfamiliarTopic}.`,
      familiarScene: `Everyday intake: Receiving work, preparing tools, and writing down needs in ${familiarDomain}.`,
      connectionPoint: 'Both systems must define their boundaries before any intervention begins.',
      boundaryWarning: 'The physical constraints may differ even if the procedural boundaries look identical.'
    },
    {
      stepNumber: 2,
      title: 'Shared Diagnostic Inspection',
      unfamiliarScene: `Telemetry teardown: Inspecting primary indicators, logs, and evidence in ${unfamiliarTopic}.`,
      familiarScene: `Physical check: Testing components, checking pressure, and assessing wear in ${familiarDomain}.`,
      connectionPoint: 'Objective measurement precedes any conclusion; opinions do not replace telemetry.',
      boundaryWarning: 'Mechanical measurements are deterministic; human or abstract factors involve variability.'
    },
    {
      stepNumber: 3,
      title: 'Filtration & Quality Control',
      unfamiliarScene: `Excluding contaminated data, invalid inputs, or procedural noise in ${unfamiliarTopic}.`,
      familiarScene: `Filtering impurities, clearing debris, and screening contaminants in ${familiarDomain}.`,
      connectionPoint: 'Allowing poisoned or unverified inputs into the core system causes catastrophic failure.',
      boundaryWarning: 'Physical filters catch particulate matter; procedural filters require human judgment.'
    },
    {
      stepNumber: 4,
      title: 'Execution & Calibration',
      unfamiliarScene: `Verifying final outputs against required standards in ${unfamiliarTopic}.`,
      familiarScene: `Testing finished work against physical tolerances and safety specs in ${familiarDomain}.`,
      connectionPoint: 'Outcomes are judged by predefined objective thresholds, not wishful thinking.',
      boundaryWarning: 'Always confirm the legal, physical, or personal limits of the comparison.'
    }
  ];

  const steps = exploration?.steps && exploration.steps.length > 0 ? exploration.steps : defaultSteps;
  const systemAName = exploration?.systemAName || unfamiliarTopic;
  const systemBName = exploration?.systemBName || familiarDomain;

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [viewFocus, setViewFocus] = useState<'both' | 'unfamiliar' | 'familiar'>('both');

  const currentStep = steps[currentStepIndex];

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>Visual Learning Engine</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-100 mt-0.5">
            Step-by-Step Relational Demonstration
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Swipe or click stages to watch both systems operate side-by-side in real time.
          </p>
        </div>

        {/* View Focus Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-center shrink-0">
          <button
            onClick={() => setViewFocus('unfamiliar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewFocus === 'unfamiliar' ? 'bg-teal-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Unfamiliar
          </button>
          <button
            onClick={() => setViewFocus('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewFocus === 'both' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewFocus('familiar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewFocus === 'familiar' ? 'bg-sky-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lived Twin
          </button>
        </div>
      </div>

      {/* Stepper Navigation Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10">
        {steps.map((st, idx) => {
          const isSelected = idx === currentStepIndex;
          return (
            <button
              key={idx}
              onClick={() => {
                setCurrentStepIndex(idx);
                setShowWarning(false);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-800 to-slate-850 border-teal-400/80 shadow-md ring-1 ring-teal-400/40 scale-[1.01]'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-teal-400' : 'text-slate-500'}`}>
                  Stage 0{st.stepNumber || idx + 1}
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />}
              </div>
              <div className={`text-xs font-semibold mt-1 truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {st.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Visual Dual-Chamber Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Unfamiliar Subject Card */}
        {(viewFocus === 'both' || viewFocus === 'unfamiliar') && (
          <div className="bg-slate-950/90 rounded-2xl border border-teal-500/30 p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-teal-900/40 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                Unfamiliar Subject: {systemAName}
              </span>
              <span className="text-[11px] font-mono text-teal-300/80 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>

            {/* SVG Visual Dynamic Frame */}
            <div className="w-full h-32 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-center p-3 relative">
              <svg className="w-full h-full" viewBox="0 0 280 100">
                <rect x="20" y="25" width="240" height="50" rx="8" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="14" fill="#134e4a" stroke="#5eead4" strokeWidth="2" />
                <text x="50" y="54" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  S{currentStepIndex + 1}
                </text>
                <text x="150" y="46" fill="#f0fdfa" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {currentStep.title}
                </text>
                <text x="150" y="62" fill="#99f6e4" fontSize="9" textAnchor="middle">
                  Active System Dynamics
                </text>
                {/* Movement particles */}
                <circle cx="210" cy="50" r="4" fill="#5eead4" className="animate-ping" style={{ transformOrigin: '210px 50px' }} />
                <circle cx="210" cy="50" r="3" fill="#2dd4bf" />
              </svg>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {currentStep.unfamiliarScene}
            </p>
          </div>
        )}

        {/* Familiar Lived Twin Card */}
        {(viewFocus === 'both' || viewFocus === 'familiar') && (
          <div className="bg-slate-950/90 rounded-2xl border border-amber-500/30 p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                Lived Experience Twin: {systemBName}
              </span>
              <span className="text-[11px] font-mono text-amber-300/80 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                Twin Step {currentStepIndex + 1}
              </span>
            </div>

            {/* SVG Visual Dynamic Frame */}
            <div className="w-full h-32 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-center p-3 relative">
              <svg className="w-full h-full" viewBox="0 0 280 100">
                <rect x="20" y="25" width="240" height="50" rx="8" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="14" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
                <text x="50" y="54" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  T{currentStepIndex + 1}
                </text>
                <text x="150" y="46" fill="#fef3c7" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {currentStep.title}
                </text>
                <text x="150" y="62" fill="#fde68a" fontSize="9" textAnchor="middle">
                  Lived Counterpart
                </text>
                {/* Movement particles */}
                <circle cx="210" cy="50" r="4" fill="#fbbf24" className="animate-ping" style={{ transformOrigin: '210px 50px' }} />
                <circle cx="210" cy="50" r="3" fill="#f59e0b" />
              </svg>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {currentStep.familiarScene}
            </p>
          </div>
        )}
      </div>

      {/* Shared Connection Core Card */}
      <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300 uppercase tracking-wider font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>How This Directly Connects</span>
          </div>
          {currentStep.boundaryWarning && (
            <button
              onClick={() => setShowWarning(!showWarning)}
              className="text-xs font-medium text-slate-400 hover:text-amber-400 flex items-center gap-1 underline underline-offset-2"
            >
              {showWarning ? 'Hide Boundary Limit' : 'Where Does The Analogy Stop?'}
            </button>
          )}
        </div>

        <p className="text-sm text-slate-100 leading-relaxed font-medium">
          {currentStep.connectionPoint}
        </p>

        {showWarning && currentStep.boundaryWarning && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 space-y-1 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-rose-300 uppercase font-mono tracking-wider text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Boundary Warning (Never Assume Identical Mechanisms)</span>
            </div>
            <p>{currentStep.boundaryWarning}</p>
          </div>
        )}
      </div>

      {/* Interactive Controls */}
      <div className="flex items-center justify-between pt-1 relative z-10">
        <button
          onClick={() => {
            setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
            setShowWarning(false);
          }}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-medium text-slate-200 transition-colors"
        >
          ← Previous Stage
        </button>

        <span className="text-xs font-mono text-slate-400">
          Stage {currentStepIndex + 1} of {steps.length}
        </span>

        <button
          onClick={() => {
            setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
            setShowWarning(false);
          }}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-[0.98]"
        >
          {currentStepIndex === steps.length - 1 ? 'Replay Sequence ↺' : 'Next Stage →'}
        </button>
      </div>
    </div>
  );
};
