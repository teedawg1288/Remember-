import React, { useState } from 'react';
import { GetUnstuckResult } from '../../types/translation';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Plus
} from 'lucide-react';

interface VisualUnstuckJourneyProps {
  result: GetUnstuckResult;
}

interface CompletedActionLog {
  id: string;
  actionText: string;
  actualOutcome: string;
  timestamp: string;
}

export const VisualUnstuckJourney: React.FC<VisualUnstuckJourneyProps> = ({ result }) => {
  const [selectedPath, setSelectedPath] = useState<'step' | 'choice1' | 'choice2' | 'choice3'>('step');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [actualOutcomeInput, setActualOutcomeInput] = useState<string>('');
  const [outcomeLogs, setOutcomeLogs] = useState<CompletedActionLog[]>([]);
  const [showLogInput, setShowLogInput] = useState<boolean>(false);

  const handleRecordOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualOutcomeInput.trim()) return;

    const newLog: CompletedActionLog = {
      id: `log-${Date.now()}`,
      actionText: result.oneReasonableNextStep,
      actualOutcome: actualOutcomeInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOutcomeLogs([newLog, ...outcomeLogs]);
    setActualOutcomeInput('');
    setIsCompleted(true);
    setShowLogInput(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Pathway Navigation</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-100 mt-0.5">
            Dynamic Next-Step Agency Journey
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Chart viable routes forward, test your agency, mark actions as completed, and record what actually happened.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 self-start sm:self-center shrink-0">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-World Calibration</span>
        </div>
      </div>

      {/* Interactive Path Graph Canvas (SVG) */}
      <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4">
        <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>Tap a branch on the tree to examine its requirements and evaluation criteria:</span>
          {isCompleted && (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Action Logged
            </span>
          )}
        </div>

        {/* SVG Path Tree */}
        <div className="w-full h-44 sm:h-48 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 500 160">
            {/* Trunk: Current Sticking Point */}
            <rect x="20" y="60" width="100" height="40" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <text x="70" y="80" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
              WHERE YOU ARE
            </text>
            <text x="70" y="92" fill="#94a3b8" fontSize="8" textAnchor="middle">
              Loop / Paralysis
            </text>

            {/* Connecting branches */}
            <path d="M 120 70 C 180 70, 180 30, 240 30" fill="none" stroke={selectedPath === 'step' ? '#14b8a6' : '#334155'} strokeWidth="2.5" />
            <path d="M 120 80 C 180 80, 180 80, 240 80" fill="none" stroke={selectedPath === 'choice1' ? '#f59e0b' : '#334155'} strokeWidth="2.5" />
            <path d="M 120 90 C 180 90, 180 130, 240 130" fill="none" stroke={selectedPath === 'choice3' ? '#a855f7' : '#334155'} strokeWidth="2.5" />

            {/* Branch 1: High-leverage primary action */}
            <g onClick={() => setSelectedPath('step')} className="cursor-pointer">
              <rect
                x="240"
                y="15"
                width="220"
                height="32"
                rx="6"
                fill={selectedPath === 'step' ? '#0f766e' : '#0f172a'}
                stroke="#14b8a6"
                strokeWidth={selectedPath === 'step' ? '2' : '1'}
              />
              <text x="255" y="35" fill="#f0fdfa" fontSize="9" fontWeight="bold">
                BRANCH A: ONE REASONABLE NEXT STEP
              </text>
            </g>

            {/* Branch 2: Investigate Fresh Data */}
            <g onClick={() => setSelectedPath('choice1')} className="cursor-pointer">
              <rect
                x="240"
                y="64"
                width="220"
                height="32"
                rx="6"
                fill={selectedPath === 'choice1' ? '#78350f' : '#0f172a'}
                stroke="#f59e0b"
                strokeWidth={selectedPath === 'choice1' ? '2' : '1'}
              />
              <text x="255" y="84" fill="#fef3c7" fontSize="9" fontWeight="bold">
                BRANCH B: INVESTIGATE NEW EVIDENCE
              </text>
            </g>

            {/* Branch 3: Leave Unresolved / Acceptance */}
            <g onClick={() => setSelectedPath('choice3')} className="cursor-pointer">
              <rect
                x="240"
                y="114"
                width="220"
                height="32"
                rx="6"
                fill={selectedPath === 'choice3' ? '#581c87' : '#0f172a'}
                stroke="#a855f7"
                strokeWidth={selectedPath === 'choice3' ? '2' : '1'}
              />
              <text x="255" y="134" fill="#f3e8ff" fontSize="9" fontWeight="bold">
                BRANCH C: SET ASIDE UNRESOLVED FOR NOW
              </text>
            </g>
          </svg>
        </div>

        {/* Selected Branch Details */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
              {selectedPath === 'step'
                ? 'Primary Direct Action'
                : selectedPath === 'choice1'
                ? 'Information Gathering Pathway'
                : 'Intentional Non-Interference'}
            </span>
            <span className="text-[11px] font-mono text-teal-400">
              Agency Level: High (Within Your Control)
            </span>
          </div>

          <p className="text-sm text-slate-100 font-medium leading-relaxed">
            {selectedPath === 'step'
              ? result.oneReasonableNextStep
              : selectedPath === 'choice1'
              ? result.loopBreakChoices?.choice1Investigate || 'Collect missing documentation or ask a direct, bounded question.'
              : result.loopBreakChoices?.choice3LeaveUnresolved || 'Recognize that some ambiguities require time or cannot be solved right now; pause debate.'}
          </p>

          <div className="pt-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-teal-400 font-semibold block mb-0.5">
              How To Evaluate Outcome:
            </span>
            <p>{result.howToEvaluateOutcome}</p>
          </div>

          {/* Action Completion & Real Outcome Input Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
            <button
              onClick={() => setShowLogInput(!showLogInput)}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Action As Taken & Record Reality</span>
            </button>
          </div>

          {/* Expanded Reality Feedback Form */}
          {showLogInput && (
            <form onSubmit={handleRecordOutcome} className="pt-3 space-y-2 border-t border-slate-800 animate-fadeIn">
              <label htmlFor="outcomeText" className="block text-xs font-semibold text-slate-300">
                What actually happened in the real world when you tried this?
              </label>
              <textarea
                id="outcomeText"
                rows={2}
                value={actualOutcomeInput}
                onChange={(e) => setActualOutcomeInput(e.target.value)}
                placeholder="e.g. 'I asked them directly and they confirmed they were just busy with family, not avoiding me'..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 resize-none focus:outline-none focus:border-amber-400"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogInput(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors"
                >
                  Save Real-World Outcome
                </button>
              </div>
            </form>
          )}

          {/* Recorded Real-World Feedback Logs */}
          {outcomeLogs.length > 0 && (
            <div className="pt-3 space-y-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold block">
                Recorded Real-World Verifications:
              </span>
              {outcomeLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                    <span>Action Taken</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-200 font-semibold">"{log.actualOutcome}"</p>
                  <p className="text-emerald-300 text-[11px]">
                    Outcome verified: Information gap closed through real-world action.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
