import React, { useState } from 'react';
import { HistoricalComparison, TimelinePhase } from '../../types/sameStory';
import {
  Clock,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  GitBranch,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualSameStorySceneProps {
  comparison: HistoricalComparison;
  activePhaseIndex: number;
  onSelectPhase: (index: number) => void;
  onSelectCharacter?: (characterId: string) => void;
}

export const VisualSameStoryScene: React.FC<VisualSameStorySceneProps> = ({
  comparison,
  activePhaseIndex,
  onSelectPhase,
  onSelectCharacter,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState<'chosen' | 'alternative'>('chosen');

  const currentPhase: TimelinePhase = comparison.timeline[activePhaseIndex] || comparison.timeline[0];
  const pressure = currentPhase.pressureLevel;

  // Auto-play timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        onSelectPhase((activePhaseIndex + 1) % comparison.timeline.length);
      }, 4200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activePhaseIndex, comparison.timeline.length, onSelectPhase]);

  // Pressure gauge color helper
  const getPressureColor = (val: number) => {
    if (val < 40) return { bg: 'bg-emerald-500', text: 'text-emerald-400', stroke: '#10b981', label: 'Moderate Load' };
    if (val < 75) return { bg: 'bg-amber-500', text: 'text-amber-400', stroke: '#f59e0b', label: 'Escalating Stress' };
    return { bg: 'bg-rose-500', text: 'text-rose-400', stroke: '#f43f5e', label: 'Critical Threshold' };
  };

  const pressureStatus = getPressureColor(pressure);

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all">
      {/* Header bar: Timeline scrub & Pressure Meter */}
      <div className="bg-slate-900/90 border-b border-slate-800 p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Step Indicators */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
            title={isPlaying ? 'Pause timeline animation' : 'Auto-advance timeline'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-teal-400" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            {comparison.timeline.map((phase, idx) => {
              const isActive = activePhaseIndex === idx;
              return (
                <button
                  key={phase.phaseNumber}
                  onClick={() => {
                    setIsPlaying(false);
                    onSelectPhase(idx);
                  }}
                  className={`min-h-[36px] px-2.5 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? 'bg-slate-950 text-teal-300' : 'bg-slate-750 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="max-w-[110px] sm:max-w-[140px] truncate">{phase.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time System Pressure Gauge */}
        <div className="flex items-center gap-3 shrink-0 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl self-end md:self-auto">
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">System Pressure</span>
            <span className={`text-xs font-bold font-mono ${pressureStatus.text}`}>
              {pressure}% · {pressureStatus.label}
            </span>
          </div>
          <div className="w-16 sm:w-24 bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5">
            <motion.div
              className={`h-full rounded-full ${pressureStatus.bg}`}
              initial={{ width: 0 }}
              animate={{ width: `${pressure}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Centerpiece: Illustrated Dual Historical Scene (SVG) */}
      <div className="relative p-3 sm:p-5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#14b8a6 1px, transparent 1px), radial-gradient(#64748b 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Dual Canvas Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Canvas: Event A */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 sm:p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <h4 className="font-serif font-bold text-white text-sm sm:text-base tracking-tight">
                  {comparison.eventA.shortLabel}
                </h4>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                <Clock className="w-3 h-3 text-teal-400" />
                <span>{currentPhase.eraDateA}</span>
              </div>
            </div>

            {/* SVG Illustration A */}
            <div className="relative w-full aspect-[16/9] max-h-[220px] rounded-lg bg-slate-950 border border-slate-800/60 overflow-hidden my-2 flex items-center justify-center">
              <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id={`gradA-${activePhaseIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#091224" />
                  </linearGradient>
                  <filter id="glowTeal" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                  </filter>
                </defs>

                <rect width="400" height="220" fill={`url(#gradA-${activePhaseIndex})`} />

                {/* Horizon & Ground lines */}
                <line x1="0" y1="160" x2="400" y2="160" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />

                {/* Custom scene elements based on comparison */}
                {comparison.id === 'groupthink-infallibility' ? (
                  /* Athenian Harbor & Triremes */
                  <g>
                    {/* Distant Hills / Syracuse cliffs */}
                    <path d="M 0 160 Q 70 120 160 160 Q 240 110 320 160 L 400 160 L 400 220 L 0 220 Z" fill="#0b172a" opacity="0.7" />
                    {/* Water waves */}
                    <path d="M 0 175 Q 50 170 100 175 T 200 175 T 300 175 T 400 175" stroke="#0ea5e9" strokeWidth="1.5" fill="none" opacity="0.4" />
                    <path d="M 0 195 Q 60 190 120 195 T 240 195 T 360 195" stroke="#14b8a6" strokeWidth="1.5" fill="none" opacity="0.3" />

                    {/* Trireme 1 */}
                    <motion.g
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {/* Hull */}
                      <path d="M 80 165 Q 150 175 220 165 L 235 155 L 70 155 Z" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
                      {/* Mast & Sail */}
                      <line x1="150" y1="155" x2="150" y2="85" stroke="#94a3b8" strokeWidth="2.5" />
                      <path d="M 120 95 Q 150 90 180 95 L 175 140 Q 150 135 125 140 Z" fill="#e2e8f0" opacity="0.85" />
                      {/* Oars */}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <line key={i} x1={95 + i * 15} y1="162" x2={85 + i * 15} y2="182" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.8" />
                      ))}
                      {/* Athenian Banner */}
                      <polygon points="150,85 168,90 150,95" fill="#14b8a6" />
                    </motion.g>

                    {/* Harbor boom chain (if late phase) */}
                    {activePhaseIndex >= 2 && (
                      <g>
                        <path d="M 30 165 Q 200 170 370 165" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 3" opacity="0.9" filter="url(#glowTeal)" />
                        <text x="200" y="152" textAnchor="middle" fill="#fca5a5" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                          [ SYRACUSE HARBOR BOOM CHAIN TRAP ]
                        </text>
                      </g>
                    )}

                    {/* Pnyx assembly podium (if early phase) */}
                    {activePhaseIndex <= 1 && (
                      <g>
                        <rect x="270" y="120" width="100" height="40" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                        <line x1="320" y1="120" x2="320" y2="105" stroke="#94a3b8" strokeWidth="2" />
                        <circle cx="320" cy="100" r="5" fill="#f59e0b" />
                        <text x="320" y="145" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
                          Athenian Pnyx
                        </text>
                      </g>
                    )}
                  </g>
                ) : comparison.id === 'supply-shock-bottleneck' ? (
                  /* Bronze Age Port & Tin Ingots */
                  <g>
                    {/* Uluburun Merchant Vessel */}
                    <path d="M 60 165 Q 160 185 260 165 L 270 150 L 50 150 Z" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="160" y1="150" x2="160" y2="75" stroke="#cbd5e1" strokeWidth="2.5" />
                    <path d="M 125 85 Q 160 80 195 85 L 190 135 Q 160 130 130 135 Z" fill="#fde68a" opacity="0.85" />
                    {/* Oxhide Ingot stacks */}
                    <g transform="translate(180, 140)">
                      <rect x="0" y="0" width="22" height="10" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1" />
                      <rect x="25" y="0" width="22" height="10" rx="2" fill={activePhaseIndex >= 2 ? '#64748b' : '#38bdf8'} stroke="#0284c7" strokeWidth="1" />
                    </g>
                    <text x="200" y="125" textAnchor="middle" fill={activePhaseIndex >= 2 ? '#f87171' : '#38bdf8'} fontSize="9" fontWeight="bold">
                      {activePhaseIndex >= 2 ? 'Tin Depleted (Zero Alloy)' : 'Tin + Copper Ingot Flow'}
                    </text>
                  </g>
                ) : (
                  /* 1720 South Sea Exchange Alley */
                  <g>
                    {/* London Coffeehouse Facade */}
                    <rect x="40" y="70" width="320" height="90" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                    <rect x="70" y="100" width="40" height="60" fill="#0f172a" stroke="#64748b" />
                    <rect x="140" y="90" width="60" height="40" rx="3" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1.5" />
                    <text x="170" y="115" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                      South Sea Co.
                    </text>
                    {/* Stock Price Curve */}
                    <path
                      d={
                        activePhaseIndex === 0
                          ? 'M 60 150 Q 150 140 340 130'
                          : activePhaseIndex === 1
                          ? 'M 60 150 Q 180 130 340 60'
                          : activePhaseIndex === 2
                          ? 'M 60 150 Q 200 40 340 50'
                          : 'M 60 150 Q 200 40 270 50 L 340 155'
                      }
                      fill="none"
                      stroke={activePhaseIndex >= 3 ? '#ef4444' : '#10b981'}
                      strokeWidth="3.5"
                    />
                  </g>
                )}

                {/* Status Indicator inside SVG */}
                <rect x="12" y="12" width="130" height="24" rx="6" fill="#091224" opacity="0.85" stroke="#334155" />
                <circle cx="24" cy="24" r="4" fill="#14b8a6" />
                <text x="35" y="27" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                  Phase {activePhaseIndex + 1}: {currentPhase.eraDateA}
                </text>
              </svg>
            </div>

            {/* Scene Description A */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
              {currentPhase.sceneDescriptionA}
            </p>

            {/* Cause & Effect A */}
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400">
                <strong className="text-slate-200">Operational Cause: </strong>
                {currentPhase.causeEffectA}
              </p>
            </div>
          </div>

          {/* Right Canvas: Event B */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 sm:p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h4 className="font-serif font-bold text-white text-sm sm:text-base tracking-tight">
                  {comparison.eventB.shortLabel}
                </h4>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{currentPhase.eraDateB}</span>
              </div>
            </div>

            {/* SVG Illustration B */}
            <div className="relative w-full aspect-[16/9] max-h-[220px] rounded-lg bg-slate-950 border border-slate-800/60 overflow-hidden my-2 flex items-center justify-center">
              <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id={`gradB-${activePhaseIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1a1209" />
                  </linearGradient>
                </defs>

                <rect width="400" height="220" fill={`url(#gradB-${activePhaseIndex})`} />
                <line x1="0" y1="180" x2="400" y2="180" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

                {comparison.id === 'groupthink-infallibility' ? (
                  /* Space Shuttle Challenger Pad & O-Ring Joint */
                  <g>
                    {/* Launch Gantry Tower */}
                    <rect x="90" y="40" width="30" height="140" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="90" y1="70" x2="120" y2="70" stroke="#94a3b8" />
                    <line x1="90" y1="110" x2="120" y2="110" stroke="#94a3b8" />
                    <line x1="90" y1="150" x2="120" y2="150" stroke="#94a3b8" />

                    {/* External Tank (Orange) */}
                    <path d="M 180 50 Q 195 30 210 50 L 210 175 L 180 175 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />

                    {/* Solid Rocket Booster Left */}
                    <rect x="165" y="60" width="12" height="115" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    {/* Solid Rocket Booster Right (Field Joint Focus) */}
                    <rect x="213" y="60" width="12" height="115" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />

                    {/* Aft Field Joint Indicator */}
                    <circle cx="219" cy="150" r="7" fill="none" stroke={pressure > 70 ? '#ef4444' : '#f59e0b'} strokeWidth="2" strokeDasharray="2 2" />
                    <line x1="226" y1="150" x2="270" y2="150" stroke="#cbd5e1" strokeWidth="1" />
                    <rect x="272" y="138" width="115" height="24" rx="4" fill="#091224" stroke="#475569" />
                    <text x="330" y="153" textAnchor="middle" fill={pressure > 70 ? '#fca5a5' : '#fde68a'} fontSize="9" fontWeight="bold">
                      {activePhaseIndex >= 3 ? 'JOINT SEAL RUPTURE' : activePhaseIndex === 1 ? '36°F O-Ring Inelasticity' : 'Field Joint Seal'}
                    </text>

                    {/* Flame plume on final phase */}
                    {activePhaseIndex === 3 && (
                      <g>
                        <path d="M 219 150 Q 240 155 260 170 Q 220 180 219 160 Z" fill="#ef4444" opacity="0.9" filter="url(#glowTeal)" />
                        <text x="200" y="205" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">
                          [ T+73s STRUCTURAL BREAKUP ]
                        </text>
                      </g>
                    )}

                    {/* Teleconference screen early phase */}
                    {activePhaseIndex === 1 && (
                      <g>
                        <rect x="260" y="50" width="120" height="65" rx="5" fill="#091224" stroke="#38bdf8" strokeWidth="1.5" />
                        <text x="320" y="70" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                          Thiokol / NASA Call
                        </text>
                        <text x="320" y="88" textAnchor="middle" fill="#fca5a5" fontSize="8">
                          &quot;Do not fly below 53°F&quot;
                        </text>
                        <text x="320" y="103" textAnchor="middle" fill="#94a3b8" fontSize="8">
                          [Overruled by Mgmt]
                        </text>
                      </g>
                    )}
                  </g>
                ) : comparison.id === 'supply-shock-bottleneck' ? (
                  /* 1973 Gas Line & Oil Drums */
                  <g>
                    {/* Gas Station Canopy */}
                    <rect x="80" y="70" width="240" height="18" rx="2" fill="#334155" stroke="#94a3b8" />
                    <line x1="120" y1="88" x2="120" y2="180" stroke="#64748b" strokeWidth="3" />
                    <line x1="280" y1="88" x2="280" y2="180" stroke="#64748b" strokeWidth="3" />
                    {/* Gas Pump */}
                    <rect x="180" y="125" width="40" height="55" rx="3" fill="#b91c1c" stroke="#f87171" strokeWidth="1.5" />
                    {/* Out of Gas Sign */}
                    <rect x="175" y="95" width="50" height="22" rx="3" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="200" y="110" textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="bold">
                      NO GAS
                    </text>
                    {/* Queue of waiting cars */}
                    <path d="M 40 175 L 70 175 L 80 160 L 50 160 Z" fill="#475569" stroke="#94a3b8" />
                    <path d="M 270 175 L 320 175 L 330 160 L 290 160 Z" fill="#334155" stroke="#64748b" />
                  </g>
                ) : (
                  /* 2000 Dot Com Trading Room */
                  <g>
                    {/* Electronic Ticker Display */}
                    <rect x="40" y="60" width="320" height="35" rx="4" fill="#020617" stroke="#1e293b" strokeWidth="1.5" />
                    <text x="60" y="82" fill="#22c55e" fontSize="10" fontFamily="monospace">
                      NASDAQ: 5,048
                    </text>
                    <text x="200" y="82" fill={activePhaseIndex >= 2 ? '#ef4444' : '#eab308'} fontSize="10" fontFamily="monospace">
                      {activePhaseIndex >= 2 ? 'BURN RATE: -78%' : 'PETS.COM: +300%'}
                    </text>
                    {/* Fiber Optic Cables under floor */}
                    <path d="M 0 190 Q 100 175 200 190 T 400 190" stroke="#06b6d4" strokeWidth="3" fill="none" opacity="0.6" />
                    <text x="200" y="210" textAnchor="middle" fill="#94a3b8" fontSize="9">
                      [ Millions of miles of unlit dark fiber ]
                    </text>
                  </g>
                )}

                {/* Status Indicator inside SVG */}
                <rect x="12" y="12" width="130" height="24" rx="6" fill="#1c1917" opacity="0.85" stroke="#44403c" />
                <circle cx="24" cy="24" r="4" fill="#f59e0b" />
                <text x="35" y="27" fill="#fef3c7" fontSize="9" fontFamily="monospace">
                  Phase {activePhaseIndex + 1}: {currentPhase.eraDateB}
                </text>
              </svg>
            </div>

            {/* Scene Description B */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
              {currentPhase.sceneDescriptionB}
            </p>

            {/* Cause & Effect B */}
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400">
                <strong className="text-slate-200">Operational Cause: </strong>
                {currentPhase.causeEffectB}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Turning Point / Branching Decision (if present in phase) */}
        {currentPhase.turningPoint && (
          <div className="mt-4 p-3 sm:p-4 rounded-xl bg-slate-900 border border-amber-500/40 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Critical Turning Point & Pathway Pivot
                </span>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setSelectedPathway('chosen')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    selectedPathway === 'chosen'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Historical Path Taken
                </button>
                <button
                  onClick={() => setSelectedPathway('alternative')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    selectedPathway === 'alternative'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Alternative Pathway
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-lg border transition-all ${
                selectedPathway === 'chosen' ? 'bg-rose-950/20 border-rose-800/80 text-rose-200' : 'bg-slate-950 border-slate-800 text-slate-400 opacity-60'
              }`}>
                <span className="font-bold text-rose-300 block mb-1">What Actually Happened:</span>
                <p className="leading-relaxed">{currentPhase.turningPoint.chosenPathway}</p>
              </div>

              <div className={`p-3 rounded-lg border transition-all ${
                selectedPathway === 'alternative' ? 'bg-teal-950/20 border-teal-800/80 text-teal-200' : 'bg-slate-950 border-slate-800 text-slate-400 opacity-60'
              }`}>
                <span className="font-bold text-teal-300 block mb-1">Alternative Decision Available:</span>
                <p className="leading-relaxed">{currentPhase.turningPoint.alternativePathway}</p>
                <div className="mt-2 pt-2 border-t border-teal-800/40 text-[11px] text-teal-300/80">
                  <strong>Plausible Divergence: </strong>{currentPhase.turningPoint.outcomeDifference}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shared Operating Mechanism vs Where It Diverges */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-800/40 text-teal-200">
            <div className="flex items-center gap-1.5 font-bold text-teal-300 mb-1">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Shared Underlying Mechanism</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              {currentPhase.sharedOperationalMechanism}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-slate-400 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Where The Comparison Stops Working</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              {currentPhase.whereParallelDiverges}
            </p>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => {
              setIsPlaying(false);
              onSelectPhase(Math.max(0, activePhaseIndex - 1));
            }}
            disabled={activePhaseIndex === 0}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-slate-300 flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Phase</span>
          </button>

          <span className="text-xs text-slate-400 font-mono">
            Phase {activePhaseIndex + 1} of {comparison.timeline.length}
          </span>

          <button
            onClick={() => {
              setIsPlaying(false);
              onSelectPhase(Math.min(comparison.timeline.length - 1, activePhaseIndex + 1));
            }}
            disabled={activePhaseIndex === comparison.timeline.length - 1}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-slate-300 flex items-center gap-1 transition-colors"
          >
            <span>Next Phase</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
