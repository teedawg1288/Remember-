import React, { useState } from 'react';
import {
  Wrench,
  Scale,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  FileText,
  AlertCircle,
  Eye,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface StageData {
  id: number;
  name: string;
  sub: string;
  courtAction: string;
  courtElement: string;
  courtDetails: string;
  mechanicAction: string;
  mechanicElement: string;
  mechanicDetails: string;
  sharedDynamic: string;
  divergenceRisk: string;
}

const STAGES: StageData[] = [
  {
    id: 1,
    name: 'Intake & Scope',
    sub: 'Defining what can and cannot be touched',
    courtAction: 'Filing Complaint & Service of Process',
    courtElement: 'Formal legal claim defines the boundary of the lawsuit',
    courtDetails: 'A plaintiff cannot sue for breach of contract and suddenly claim medical injury at trial without amending the complaint. The claim bounds the entire dispute.',
    mechanicAction: 'Work Order & Intake Symptoms',
    mechanicElement: 'Customer writes exact symptoms on the ticket',
    mechanicDetails: 'If a customer brought in a car for a squeaking brake rotor, the technician cannot tear apart the transmission without written authorization.',
    sharedDynamic: 'Boundary Setting: Systems cannot act arbitrarily; scope must be formally recorded before teardown begins.',
    divergenceRisk: 'A car is an inanimate physical object. In court, the defendant can file an affirmative counterclaim, changing the shape of the dispute.'
  },
  {
    id: 2,
    name: 'Diagnostic Teardown',
    sub: 'Shared inspection of reality',
    courtAction: 'Discovery Phase (Subpoenas, Depositions, Logs)',
    courtElement: 'Mandatory exchange of all evidence and witness testimony',
    courtDetails: 'Surprise witnesses from movie dramas are strictly banned. Both sides must disclose every email, invoice, and recorded statement in advance.',
    mechanicAction: 'OBD-II Scan Tool & Compression Check',
    mechanicElement: 'Computer trouble codes (DTCs) and physical pressure gauges',
    mechanicDetails: 'Technicians do not guess by ear. They hook up the scan tool to read sensor voltages, freeze-frame data, and live misfire counts.',
    sharedDynamic: 'Shared Foundation: You do not argue opinions about what broke until both parties inspect the raw telemetry together.',
    divergenceRisk: 'Scan tools read voltage accurately. Witnesses in depositions may suffer memory decay, confirmation bias, or subtle coaching.'
  },
  {
    id: 3,
    name: 'Contaminant Filtration',
    sub: 'Preventing corrupted inputs from ruining the machine',
    courtAction: 'Evidentiary Hearings & Objections (Hearsay)',
    courtElement: 'Judge excludes unverified rumors and tainted exhibits',
    courtDetails: 'If someone testifies "My neighbor heard on Facebook that the driver was texting," the judge sustains an objection. Unverified rumor is kept out.',
    mechanicAction: 'Fuel/Oil Filters & Magnetic Drain Plugs',
    mechanicElement: 'Screening out metal shavings before engine restart',
    mechanicDetails: 'Pouring oil with metal grit into an aluminum cylinder block will seize the engine. Filters ensure only pure lubricant enters the bearings.',
    sharedDynamic: 'Inlet Quality Control: A single contaminated input will poison the final output.',
    divergenceRisk: 'Oil filters catch physical particles mechanically. Legal objections rely on human discretion and precedent.'
  },
  {
    id: 4,
    name: 'The Inspection Decision',
    sub: 'Applying rigorous tolerance thresholds',
    courtAction: 'Verdict / Judgment based on Standard of Proof',
    courtElement: 'Preponderance (>51%) in civil; Beyond Reasonable Doubt in criminal',
    courtDetails: 'The jury does not need cosmic omniscience; they determine if the evidence clears the specific statutory standard.',
    mechanicAction: 'Passing State Inspection & Calibrated Road Test',
    mechanicElement: 'Clearance tolerances (e.g. Brake pad > 3mm, rotor runout < 0.002")',
    mechanicDetails: 'The inspector measures exact millimeter specs. If the rotor meets the threshold, it receives the safety certificate; if not, it fails.',
    sharedDynamic: 'Predefined Thresholds: Outcomes are determined by strict measurement criteria, not intuition.',
    divergenceRisk: 'Brake pads either measure 4mm or they don\'t. Legal verdicts require human judgment on credibility and equity.'
  }
];

export const VisualCourtMechanic: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [activeSide, setActiveSide] = useState<'both' | 'court' | 'mechanic'>('both');
  const [showBoundary, setShowBoundary] = useState<boolean>(false);

  const stage = STAGES[activeStage];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-6 overflow-hidden">
      {/* Visual Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Visual System Comparison</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-100 mt-0.5">
            Court Proceedings vs. Car Diagnostics
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Step through the diagnostic lifecycle to see why legal trials follow the exact discipline of an auto repair shop.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-center shrink-0">
          <button
            onClick={() => setActiveSide('court')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSide === 'court' ? 'bg-teal-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Court
          </button>
          <button
            onClick={() => setActiveSide('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSide === 'both' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dual View
          </button>
          <button
            onClick={() => setActiveSide('mechanic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSide === 'mechanic' ? 'bg-sky-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mechanic
          </button>
        </div>
      </div>

      {/* Stage Progression Steps Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STAGES.map((s, idx) => {
          const isCurrent = idx === activeStage;
          return (
            <button
              key={s.id}
              onClick={() => {
                setActiveStage(idx);
                setShowBoundary(false);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isCurrent
                  ? 'bg-gradient-to-br from-slate-800 to-slate-850 border-amber-400/80 shadow-md ring-1 ring-amber-400/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold uppercase ${isCurrent ? 'text-amber-400' : 'text-slate-500'}`}>
                  Stage 0{s.id}
                </span>
                {isCurrent && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
              </div>
              <div className={`text-xs font-semibold mt-1 truncate ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                {s.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dual Interactive Visual Stage Scenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Scene: Courtroom */}
        {(activeSide === 'both' || activeSide === 'court') && (
          <div className="bg-slate-950/90 rounded-2xl border border-teal-500/30 p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-teal-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                    Target Concept
                  </div>
                  <div className="font-semibold text-sm text-slate-100">
                    Courtroom Legal Process
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-teal-400/90 font-medium bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
                Stage {activeStage + 1} of 4
              </span>
            </div>

            {/* Visual SVG Scene for Court */}
            <div className="w-full h-36 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-center p-3 relative">
              <svg className="w-full h-full" viewBox="0 0 320 120">
                {/* Court Bench */}
                <rect x="110" y="20" width="100" height="24" rx="4" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1.5" />
                <text x="160" y="36" fill="#ccfbf1" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  JUDICIAL BENCH
                </text>

                {/* Left Counsel / Plaintiff */}
                <rect x="25" y="70" width="75" height="35" rx="5" fill="#134e4a" stroke="#14b8a6" strokeWidth="1" />
                <text x="62" y="85" fill="#99f6e4" fontSize="9" fontWeight="bold" textAnchor="middle">
                  PLAINTIFF
                </text>
                <text x="62" y="98" fill="#5eead4" fontSize="8" textAnchor="middle">
                  {activeStage === 0 ? 'Claims Filed' : activeStage === 1 ? 'Discovery Docs' : activeStage === 2 ? 'Witness Direct' : 'Final Burden'}
                </text>

                {/* Right Counsel / Defense */}
                <rect x="220" y="70" width="75" height="35" rx="5" fill="#134e4a" stroke="#14b8a6" strokeWidth="1" />
                <text x="257" y="85" fill="#99f6e4" fontSize="9" fontWeight="bold" textAnchor="middle">
                  DEFENSE
                </text>
                <text x="257" y="98" fill="#5eead4" fontSize="8" textAnchor="middle">
                  {activeStage === 0 ? 'Answer & Plea' : activeStage === 1 ? 'Cross Expose' : activeStage === 2 ? 'Obj: Hearsay!' : 'Reasonable Doubt'}
                </text>

                {/* Dynamic Evidence/Flow Particle */}
                <path d="M 100 85 Q 160 55 220 85" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="160" cy="55" r="4" fill="#5eead4" className="animate-ping" style={{ transformOrigin: '160px 55px' }} />
                <circle cx="160" cy="55" r="3" fill="#2dd4bf" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <div className="font-semibold text-slate-100 text-sm flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>{stage.courtAction}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {stage.courtDetails}
              </p>
            </div>
          </div>
        )}

        {/* Right Scene: Auto Repair Shop */}
        {(activeSide === 'both' || activeSide === 'mechanic') && (
          <div className="bg-slate-950/90 rounded-2xl border border-amber-500/30 p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Lived Experience Twin
                  </div>
                  <div className="font-semibold text-sm text-slate-100">
                    Auto Shop Diagnostics
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400/90 font-medium bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                Twin Stage {activeStage + 1}
              </span>
            </div>

            {/* Visual SVG Scene for Mechanic */}
            <div className="w-full h-36 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-center p-3 relative">
              <svg className="w-full h-full" viewBox="0 0 320 120">
                {/* Car Hood Outline */}
                <path d="M 40 85 C 60 40, 260 40, 280 85 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                
                {/* Engine Block */}
                <rect x="120" y="55" width="80" height="30" rx="3" fill="#b45309" stroke="#fbbf24" strokeWidth="1" />
                <text x="160" y="73" fill="#fef3c7" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  ENGINE BLOCK
                </text>

                {/* Diagnostic Computer / Tool */}
                <rect x="45" y="60" width="55" height="30" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
                <text x="72.5" y="75" fill="#fde68a" fontSize="8" fontWeight="bold" textAnchor="middle">
                  OBD-II SCAN
                </text>
                <text x="72.5" y="85" fill="#fbbf24" fontSize="7" textAnchor="middle">
                  {activeStage === 0 ? 'Intake Ticket' : activeStage === 1 ? 'Live DTC Codes' : activeStage === 2 ? 'Clean Fluid' : 'Spec Tolerances'}
                </text>

                {/* Cable linking diagnostic scanner to engine */}
                <path d="M 100 75 L 120 70" stroke="#fbbf24" strokeWidth="2" strokeDasharray="2 2" />

                {/* Status Indicator */}
                <circle cx="250" cy="70" r="10" fill={activeStage === 3 ? '#10b981' : '#f59e0b'} />
                <text x="250" y="73" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                  {activeStage === 3 ? 'PASS' : 'TEST'}
                </text>
              </svg>
            </div>

            <div className="space-y-1.5">
              <div className="font-semibold text-slate-100 text-sm flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span>{stage.mechanicAction}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {stage.mechanicDetails}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Shared Underlying Dynamic Card */}
      <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300 uppercase tracking-wider font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>The Shared Operating Principle</span>
          </div>
          <button
            onClick={() => setShowBoundary(!showBoundary)}
            className="text-xs font-medium text-slate-400 hover:text-amber-400 flex items-center gap-1 underline underline-offset-2"
          >
            {showBoundary ? 'Hide Divergence Limit' : 'Where Does This Stop Working?'}
          </button>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          {stage.sharedDynamic}
        </p>

        {/* Boundary Divergence Warning (Anti-oversimplification) */}
        {showBoundary && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 space-y-1 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-rose-300 uppercase font-mono tracking-wider text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Boundary Warning: Why It Is NOT Identical</span>
            </div>
            <p>{stage.divergenceRisk}</p>
          </div>
        )}
      </div>

      {/* Interactive Controls & Stage Stepper */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => {
            setActiveStage((prev) => (prev > 0 ? prev - 1 : STAGES.length - 1));
            setShowBoundary(false);
          }}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-medium text-slate-200 transition-colors"
        >
          ← Previous Stage
        </button>

        <span className="text-xs font-mono text-slate-400">
          Stage {activeStage + 1} of {STAGES.length}
        </span>

        <button
          onClick={() => {
            setActiveStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : 0));
            setShowBoundary(false);
          }}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-[0.98]"
        >
          {activeStage === STAGES.length - 1 ? 'Restart Diagnosis ↺' : 'Next Stage →'}
        </button>
      </div>
    </div>
  );
};
