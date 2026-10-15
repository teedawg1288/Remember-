import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  Flame,
  Wind,
  ShieldAlert,
  Gauge
} from 'lucide-react';

interface EngineComponent {
  id: string;
  name: string;
  category: 'Fuel & Spark' | 'Mechanical Core' | 'Airflow' | 'Timing';
  role: string;
  howItWorks: string;
  failureConsequence: string;
  color: string;
}

const ENGINE_PARTS: Record<string, EngineComponent> = {
  spark_plug: {
    id: 'spark_plug',
    name: 'Spark Plug & Ignition Coil',
    category: 'Fuel & Spark',
    role: 'Timed electrical discharge (~20,000V) to ignite compressed air-fuel mixture',
    howItWorks: 'Delivers a high-voltage spark precisely when the piston reaches top dead center (TDC) of the compression stroke.',
    failureConsequence: 'Misfires, unburnt fuel washing cylinder walls, rough idling, check engine light.',
    color: '#f59e0b'
  },
  intake_valve: {
    id: 'intake_valve',
    name: 'Intake Valve',
    category: 'Airflow',
    role: 'Regulates fresh oxygen and atomized fuel entering the chamber',
    howItWorks: 'Depressed by camshaft lobe on downward intake stroke; sealed tight under spring tension during compression & combustion.',
    failureConsequence: 'Carbon buildup causes valve sticking, loss of cylinder compression, hesitation.',
    color: '#06b6d4'
  },
  exhaust_valve: {
    id: 'exhaust_valve',
    name: 'Exhaust Valve',
    category: 'Airflow',
    role: 'Expels combusted gases into exhaust manifold and catalytic converter',
    howItWorks: 'Opens as the piston sweeps upward on stroke 4, releasing high-temp burned exhaust gases under pressure.',
    failureConsequence: 'Burnt valve edges cause permanent compression leak and catastrophic power loss.',
    color: '#f97316'
  },
  piston: {
    id: 'piston',
    name: 'Piston & Compression Rings',
    category: 'Mechanical Core',
    role: 'Converts expanding thermal gas pressure into linear mechanical motion',
    howItWorks: 'Slips within cylinder liner. Three rings maintain gas seal and scrape lubricating oil film down the walls.',
    failureConsequence: 'Worn rings cause "blow-by" (gas escaping to crankcase) and severe oil burning (blue exhaust smoke).',
    color: '#38bdf8'
  },
  cylinder_wall: {
    id: 'cylinder_wall',
    name: 'Cylinder Block & Water Jacket',
    category: 'Mechanical Core',
    role: 'Houses the combustion chamber and transfers extreme heat into coolant passages',
    howItWorks: 'Precision honed cast iron or sleeved aluminum with micro-crosshatch pattern to retain microscopic oil film.',
    failureConsequence: 'Overheating warps the cylinder head; scored walls cause permanent loss of engine compression.',
    color: '#94a3b8'
  },
  connecting_rod: {
    id: 'connecting_rod',
    name: 'Connecting Rod & Bearings',
    category: 'Mechanical Core',
    role: 'Transmits linear piston force to rotational crankshaft journal',
    howItWorks: 'Forged steel beam swinging through an angular arc, cushioned by pressurized hydrodynamic oil film bearings.',
    failureConsequence: 'Oil starvation wipes bearing shells, producing loud metal knocking ("rod knock") and eventual rod failure.',
    color: '#a855f7'
  },
  crankshaft: {
    id: 'crankshaft',
    name: 'Crankshaft & Counterweights',
    category: 'Timing',
    role: 'Translates reciprocating up-and-down motion into rotational torque',
    howItWorks: 'Heavy counterbalanced shaft spinning at thousands of RPM, driving transmission, alternator, and timing chain.',
    failureConsequence: 'Crank journal scoring or out-of-balance vibrations cause structural engine destruction.',
    color: '#10b981'
  }
};

const STROKES = [
  {
    step: 1,
    title: '1. Intake Stroke',
    action: 'Intake valve opens; Piston sweeps downward, vacuum pulls air-fuel mist into cylinder.',
    pistonPos: 0.8, // 0 = TDC, 1 = BDC
    intakeOpen: true,
    exhaustOpen: false,
    sparkFired: false,
    fuelColor: 'rgba(56, 189, 248, 0.4)',
    crankAngle: 90
  },
  {
    step: 2,
    title: '2. Compression Stroke',
    action: 'All valves sealed tight; Piston rises rapidly, compressing mixture into high-energy density.',
    pistonPos: 0.15,
    intakeOpen: false,
    exhaustOpen: false,
    sparkFired: false,
    fuelColor: 'rgba(234, 179, 8, 0.5)',
    crankAngle: 180
  },
  {
    step: 3,
    title: '3. Power (Combustion) Stroke',
    action: 'Spark plug ignites mixture; instant flame front expands gases, violently pushing piston down.',
    pistonPos: 0.65,
    intakeOpen: false,
    exhaustOpen: false,
    sparkFired: true,
    fuelColor: 'rgba(239, 68, 68, 0.75)',
    crankAngle: 270
  },
  {
    step: 4,
    title: '4. Exhaust Stroke',
    action: 'Exhaust valve opens; Piston sweeps upward, expelling burnt exhaust gases toward the catalytic converter.',
    pistonPos: 0.18,
    intakeOpen: false,
    exhaustOpen: true,
    sparkFired: false,
    fuelColor: 'rgba(100, 116, 139, 0.35)',
    crankAngle: 360
  }
];

export const VisualCarEngine: React.FC = () => {
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedPartId, setSelectedPartId] = useState<string>('piston');
  const [rpmSpeed, setRpmSpeed] = useState<number>(1); // 1 = normal, 2 = fast, 0.5 = slow

  // Auto-cycle through the 4-stroke steps when playing
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = Math.max(700, 1500 / rpmSpeed);
    const timer = setInterval(() => {
      setCurrentStrokeIndex((prev) => (prev + 1) % 4);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isPlaying, rpmSpeed]);

  const currentStroke = STROKES[currentStrokeIndex];
  const selectedPart = ENGINE_PARTS[selectedPartId] || ENGINE_PARTS.piston;

  // Geometry calculations for piston & rod
  const tdcY = 140; // Top dead center Y
  const bdcY = 250; // Bottom dead center Y
  const pistonY = tdcY + currentStroke.pistonPos * (bdcY - tdcY);
  const crankCenterX = 200;
  const crankCenterY = 370;
  const crankRadius = 45;
  const crankAngleRad = (currentStroke.crankAngle * Math.PI) / 180;
  const crankPinX = crankCenterX + Math.sin(crankAngleRad) * crankRadius;
  const crankPinY = crankCenterY + Math.cos(crankAngleRad) * crankRadius;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-6 overflow-hidden">
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 4-Stroke Engine Anatomy</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-100 mt-0.5">
            How Internal Combustion Components Work Together
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Tap any engine component to inspect its role, operating principle, and failure mode. Watch the synchronized 4-stroke cycle.
          </p>
        </div>

        {/* Play/Pause & Reset Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Motion</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play Cycle</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentStrokeIndex(0);
              setIsPlaying(false);
            }}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1"
            title="Reset to Stroke 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4-Stroke Navigation Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STROKES.map((stroke, idx) => {
          const isActive = currentStrokeIndex === idx;
          return (
            <button
              key={stroke.step}
              onClick={() => {
                setCurrentStrokeIndex(idx);
                setIsPlaying(false);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-teal-950/60 border-teal-500/70 text-white shadow-lg shadow-teal-950/40'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className={isActive ? 'text-teal-400 font-bold' : 'text-slate-500'}>
                  STROKE 0{stroke.step}
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                )}
              </div>
              <div className="text-xs font-semibold leading-tight text-slate-200">
                {stroke.title.replace(/^\d+\.\s*/, '')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage: SVG Engine + Diagnostic Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Illustrated SVG Engine Chamber */}
        <div className="lg:col-span-7 bg-slate-950/90 rounded-2xl border border-slate-800 p-4 relative flex flex-col items-center">
          {/* Real-time Stroke Status Ribbon */}
          <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-mono mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span className="text-slate-300 font-bold">{currentStroke.title}</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Tap parts to inspect
            </div>
          </div>

          {/* Engine SVG */}
          <div className="w-full max-w-[360px] aspect-[4/5] relative">
            <svg
              viewBox="0 0 400 470"
              className="w-full h-full drop-shadow-2xl select-none"
            >
              <defs>
                {/* Metallic cylinder gradient */}
                <linearGradient id="cylinderMetal" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="25%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#475569" />
                  <stop offset="75%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>

                {/* Piston Metal Gradient */}
                <linearGradient id="pistonMetal" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="20%" stopColor="#94a3b8" />
                  <stop offset="50%" stopColor="#cbd5e1" />
                  <stop offset="80%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>

                {/* Crankshaft Counterweight Gradient */}
                <linearGradient id="crankMetal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>

                {/* Combustion Flash Glow Filter */}
                <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                  <stop offset="35%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Engine Block Outer Shell */}
              <path
                d="M 60,60 L 340,60 L 340,430 L 60,430 Z"
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth="4"
              />

              {/* Coolant Passages (Water Jackets) on left & right */}
              <g
                cursor="pointer"
                onClick={() => setSelectedPartId('cylinder_wall')}
                className="transition-opacity hover:opacity-90"
              >
                <rect x="75" y="110" width="25" height="190" rx="6" fill="#0284c7" opacity="0.4" />
                <rect x="300" y="110" width="25" height="190" rx="6" fill="#0284c7" opacity="0.4" />
                <text x="87" y="210" fill="#7dd3fc" fontSize="8" fontFamily="monospace" transform="rotate(-90 87 210)" textAnchor="middle">COOLANT JACKET</text>
                <text x="312" y="210" fill="#7dd3fc" fontSize="8" fontFamily="monospace" transform="rotate(-90 312 210)" textAnchor="middle">COOLANT JACKET</text>
              </g>

              {/* Cylinder Bore Wall (Inner Chamber) */}
              <g
                cursor="pointer"
                onClick={() => setSelectedPartId('cylinder_wall')}
              >
                <rect
                  x="110"
                  y="100"
                  width="180"
                  height="210"
                  fill="url(#cylinderMetal)"
                  stroke={selectedPartId === 'cylinder_wall' ? '#38bdf8' : '#334155'}
                  strokeWidth={selectedPartId === 'cylinder_wall' ? '3' : '2'}
                />
              </g>

              {/* Dynamic Gas Chamber (Above Piston) */}
              <rect
                x="112"
                y="102"
                width="176"
                height={Math.max(2, pistonY - 102)}
                fill={currentStroke.fuelColor}
                className="transition-all duration-300"
              />

              {/* Power Stroke Flame Particles */}
              {currentStroke.sparkFired && (
                <g>
                  <circle cx="200" cy="115" r="42" fill="url(#sparkGlow)" className="animate-pulse" />
                  <path
                    d="M 195,108 Q 200,95 205,108 Q 215,115 203,122 Q 200,132 195,122 Q 185,115 195,108 Z"
                    fill="#fef08a"
                  />
                </g>
              )}

              {/* Cylinder Head Intake & Exhaust Ports */}
              {/* Left Port: Intake Runner */}
              <path
                d="M 80,70 Q 140,70 145,100 L 165,100 Q 160,50 80,50 Z"
                fill="#1e293b"
                stroke="#0284c7"
                strokeWidth="1.5"
              />
              {/* Right Port: Exhaust Runner */}
              <path
                d="M 320,70 Q 260,70 255,100 L 235,100 Q 240,50 320,50 Z"
                fill="#1e293b"
                stroke="#ea580c"
                strokeWidth="1.5"
              />

              {/* INTAKE VALVE (Left) */}
              <g
                cursor="pointer"
                onClick={() => setSelectedPartId('intake_valve')}
                className="transition-transform duration-200"
                transform={`translate(0, ${currentStroke.intakeOpen ? 14 : 0})`}
              >
                {/* Valve stem */}
                <rect x="151" y="45" width="6" height="58" fill="#94a3b8" />
                {/* Valve head angled face */}
                <path
                  d="M 137,102 L 171,102 L 163,94 L 145,94 Z"
                  fill={selectedPartId === 'intake_valve' ? '#06b6d4' : '#cbd5e1'}
                  stroke={selectedPartId === 'intake_valve' ? '#38bdf8' : '#475569'}
                  strokeWidth="2"
                />
                {/* Airflow arrows when intake is open */}
                {currentStroke.intakeOpen && (
                  <path
                    d="M 100,60 Q 140,65 148,90"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    fill="none"
                  />
                )}
              </g>

              {/* EXHAUST VALVE (Right) */}
              <g
                cursor="pointer"
                onClick={() => setSelectedPartId('exhaust_valve')}
                className="transition-transform duration-200"
                transform={`translate(0, ${currentStroke.exhaustOpen ? 14 : 0})`}
              >
                {/* Valve stem */}
                <rect x="243" y="45" width="6" height="58" fill="#94a3b8" />
                {/* Valve head angled face */}
                <path
                  d="M 229,102 L 263,102 L 255,94 L 237,94 Z"
                  fill={selectedPartId === 'exhaust_valve' ? '#f97316' : '#cbd5e1'}
                  stroke={selectedPartId === 'exhaust_valve' ? '#fb923c' : '#475569'}
                  strokeWidth="2"
                />
                {/* Exhaust flow arrows when open */}
                {currentStroke.exhaustOpen && (
                  <path
                    d="M 250,90 Q 260,65 300,60"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    fill="none"
                  />
                )}
              </g>

              {/* SPARK PLUG (Top Center) */}
              <g
                cursor="pointer"
                onClick={() => setSelectedPartId('spark_plug')}
              >
                {/* Hex body & ceramic insulator */}
                <rect x="194" y="30" width="12" height="35" rx="2" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
                <rect x="192" y="65" width="16" height="15" fill="#475569" />
                {/* Threaded shell */}
                <rect x="195" y="80" width="10" height="20" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                {/* Electrode */}
                <rect x="198" y="100" width="4" height="6" fill="#f59e0b" />
                {selectedPartId === 'spark_plug' && (
                  <circle cx="200" cy="65" r="22" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                )}
              </g>

              {/* PISTON ASSEMBLY */}
              <g
                cursor="pointer"
                onClick={() => setSelectedPartId('piston')}
                className="transition-all duration-300"
                transform={`translate(0, ${pistonY - 140})`}
              >
                {/* Piston Crown & Skirt */}
                <rect
                  x="114"
                  y="140"
                  width="172"
                  height="65"
                  rx="4"
                  fill="url(#pistonMetal)"
                  stroke={selectedPartId === 'piston' ? '#38bdf8' : '#475569'}
                  strokeWidth={selectedPartId === 'piston' ? '3' : '1.5'}
                />
                {/* Compression Rings Slots */}
                <line x1="114" y1="147" x2="286" y2="147" stroke="#1e293b" strokeWidth="2" />
                <line x1="114" y1="154" x2="286" y2="154" stroke="#1e293b" strokeWidth="2" />
                <line x1="114" y1="161" x2="286" y2="161" stroke="#1e293b" strokeWidth="2" />

                {/* Wrist Pin (Gudgeon Pin) */}
                <circle cx="200" cy="175" r="11" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
              </g>

              {/* CONNECTING ROD */}
              <g
                cursor="pointer"
                onClick={() => setSelectedPartId('connecting_rod')}
              >
                {/* Connecting rod beam */}
                <line
                  x1="200"
                  y1={pistonY + 35}
                  x2={crankPinX}
                  y2={crankPinY}
                  stroke={selectedPartId === 'connecting_rod' ? '#a855f7' : '#94a3b8'}
                  strokeWidth="14"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                <line
                  x1="200"
                  y1={pistonY + 35}
                  x2={crankPinX}
                  y2={crankPinY}
                  stroke="#475569"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                {/* Small end pin bearing */}
                <circle cx="200" cy={pistonY + 35} r="9" fill="#64748b" />
                {/* Big end journal bearing */}
                <circle cx={crankPinX} cy={crankPinY} r="13" fill="#64748b" stroke="#334155" strokeWidth="2" />
              </g>

              {/* CRANKSHAFT & COUNTERWEIGHTS */}
              <g
                cursor="pointer"
                onClick={() => setSelectedPartId('crankshaft')}
              >
                {/* Crankcase boundary */}
                <circle cx={crankCenterX} cy={crankCenterY} r="75" fill="#0f172a" stroke="#1e293b" strokeWidth="3" />
                {/* Crankshaft rotating counterweight */}
                <path
                  d={`M ${crankCenterX - 45},${crankCenterY + 10} A 55 55 0 0 0 ${crankCenterX + 45},${crankCenterY + 10} L ${crankPinX + 10},${crankPinY} L ${crankPinX - 10},${crankPinY} Z`}
                  fill="url(#crankMetal)"
                  stroke={selectedPartId === 'crankshaft' ? '#10b981' : '#475569'}
                  strokeWidth={selectedPartId === 'crankshaft' ? '3' : '1.5'}
                  className="transition-all duration-300"
                />
                {/* Center Main Journal */}
                <circle cx={crankCenterX} cy={crankCenterY} r="16" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
                <circle cx={crankCenterX} cy={crankCenterY} r="6" fill="#94a3b8" />
              </g>

              {/* Oil Sump Pool at bottom */}
              <path
                d="M 90,410 Q 200,435 310,410 L 310,425 Q 200,445 90,425 Z"
                fill="#b45309"
                opacity="0.6"
              />
              <text x="200" y="420" fill="#fde047" fontSize="8" fontFamily="monospace" textAnchor="middle">
                ENGINE OIL SUMP RESERVOIR
              </text>
            </svg>
          </div>

          {/* Stroke Narrative caption */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>{currentStroke.action}</span>
          </div>
        </div>

        {/* Right Column: Deep-Dive Component Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Component Selector Buttons */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Select Part to Inspect:</span>
              <span className="text-teal-400 font-semibold">{Object.keys(ENGINE_PARTS).length} parts</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(ENGINE_PARTS).map((part) => {
                const isSelected = selectedPartId === part.id;
                return (
                  <button
                    key={part.id}
                    onClick={() => setSelectedPartId(part.id)}
                    className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all text-left flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-800 text-white font-medium shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border-slate-800'
                    }`}
                    style={{
                      borderColor: isSelected ? part.color : undefined
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: part.color }}
                    />
                    <span>{part.name.split('&')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Inspector Card */}
          <div
            className="bg-slate-950/90 border rounded-2xl p-5 space-y-4 transition-all"
            style={{ borderColor: `${selectedPart.color}55` }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span
                  className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md font-semibold"
                  style={{
                    backgroundColor: `${selectedPart.color}20`,
                    color: selectedPart.color
                  }}
                >
                  {selectedPart.category}
                </span>
                <h4 className="font-serif text-lg font-semibold text-slate-100 mt-1">
                  {selectedPart.name}
                </h4>
              </div>
              <Wrench className="w-5 h-5 text-slate-500" />
            </div>

            {/* Core Function */}
            <div className="space-y-1">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>PRIMARY SYSTEM ROLE</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {selectedPart.role}
              </p>
            </div>

            {/* How it works in synchrony */}
            <div className="space-y-1">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>HOW IT WORKS IN SYNCHRONY</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedPart.howItWorks}
              </p>
            </div>

            {/* What happens when it fails */}
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 space-y-1">
              <div className="text-xs font-mono text-rose-300 flex items-center gap-1.5 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>DIAGNOSTIC FAILURE CONSEQUENCE</span>
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                {selectedPart.failureConsequence}
              </p>
            </div>
          </div>

          {/* Engine Speed Control */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Gauge className="w-4 h-4 text-teal-400" />
              <span>Simulated Cycle Speed:</span>
            </div>
            <div className="flex items-center gap-1">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    setRpmSpeed(spd);
                    setIsPlaying(true);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    rpmSpeed === spd
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
