import React, { useState, useId, useMemo } from 'react';
import {
  ArrowLeftRight,
  GitCommit,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Compass,
  Zap,
  Eye,
  Info
} from 'lucide-react';
import {
  RelationshipMapping,
  DifferenceBreakdown,
  BidirectionalInsight
} from '../types/translation';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface RelationshipVisualProps {
  unfamiliarTopic: string;
  familiarDomain: string;
  headlineSummary?: string;
  mappings: RelationshipMapping[];
  differences?: DifferenceBreakdown[];
  bidirectionalInsights?: BidirectionalInsight;
}

type ViewMode = 'focused' | 'all' | 'boundaries';
type TransferDirection = 'forward' | 'bidirectional';

export const RelationshipVisual: React.FC<RelationshipVisualProps> = ({
  unfamiliarTopic,
  familiarDomain,
  headlineSummary,
  mappings = [],
  differences = [],
  bidirectionalInsights,
}) => {
  const uniqueId = useId().replace(/:/g, '_');
  const speech = useSpeechSynthesis();

  // State
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);
  const [hoveredNodeIndex, setHoveredNodeIndex] = useState<number | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<'left' | 'center' | 'right' | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('focused');
  const [transferDirection, setTransferDirection] = useState<TransferDirection>('forward');
  const [pulseKey, setPulseKey] = useState<number>(0);

  // Safety fallback if mappings is empty
  const safeMappings: RelationshipMapping[] = useMemo(() => {
    if (mappings && mappings.length > 0) return mappings;
    return [
      {
        unfamiliarElement: unfamiliarTopic || 'Target Concept',
        familiarElement: familiarDomain || 'Familiar Model',
        underlyingDynamic: 'Dynamic Transfer',
        explanation: headlineSummary || 'Relational mapping connects the core principles of both systems.'
      }
    ];
  }, [mappings, unfamiliarTopic, familiarDomain, headlineSummary]);

  const activeIndex = Math.min(Math.max(0, selectedNodeIndex), safeMappings.length - 1);
  const activeMapping = safeMappings[activeIndex];

  // Matched difference boundary for this mapping index if available
  const activeDifference = differences[activeIndex] || differences[0] || null;

  // Layout calculations for responsive SVG
  const rowCount = safeMappings.length;
  const startY = 110;
  const rowGap = rowCount <= 3 ? 95 : Math.max(76, 320 / (rowCount || 1));
  const svgHeight = Math.max(420, startY + rowCount * rowGap + 40);
  const leftX = 210;
  const centerX = 450;
  const rightX = 690;

  const triggerPulseWave = () => {
    setPulseKey((prev) => prev + 1);
  };

  const handleNext = () => {
    setSelectedNodeIndex((prev) => (prev + 1) % safeMappings.length);
  };

  const handlePrev = () => {
    setSelectedNodeIndex((prev) => (prev - 1 + safeMappings.length) % safeMappings.length);
  };

  const handleListenMapping = () => {
    if (speech.isPlaying) {
      speech.stop();
    } else {
      const textToRead = `Parallel ${activeIndex + 1}: ${activeMapping.underlyingDynamic}. ` +
        `In ${unfamiliarTopic}, this is ${activeMapping.unfamiliarElement}. ` +
        `In ${familiarDomain}, this is ${activeMapping.familiarElement}. ` +
        `Here is how the dynamic operates: ${activeMapping.explanation}. ` +
        (activeDifference ? `Boundary reminder: ${activeDifference.whereItFails}` : '');
      speech.play(textToRead);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-5 sm:p-8 border border-slate-800/90 shadow-2xl space-y-6 overflow-hidden relative">
      {/* Background Ambience & Radial Glows */}
      <div className="absolute top-0 -left-28 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-28 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: System Context & Clean Metadata */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs uppercase tracking-wider font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Relationship Diagram</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-normal capitalize">
              {safeMappings.length} Parallel {safeMappings.length === 1 ? 'Synapse' : 'Synapses'}
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-100 tracking-tight">
            Relational Synapse Diagram
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Tap any node, bridge, or dynamic to explore how structures in{' '}
            <span className="text-teal-300 font-medium">{unfamiliarTopic}</span> connect directly
            to lived principles in{' '}
            <span className="text-amber-300 font-medium">{familiarDomain}</span>.
          </p>
        </div>

        {/* Mode Selector Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('focused')}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'focused'
                  ? 'bg-slate-800 text-teal-300 shadow-sm border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Inspect one focused relationship at a time"
            >
              Focused View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'all'
                  ? 'bg-slate-800 text-amber-300 shadow-sm border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="View all synaptic bridges running concurrently"
            >
              All Synapses
            </button>
            <button
              type="button"
              onClick={() => setViewMode('boundaries')}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'boundaries'
                  ? 'bg-slate-800 text-rose-300 shadow-sm border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Inspect boundary limits where analogies diverge"
            >
              Boundaries
            </button>
          </div>

          <button
            type="button"
            onClick={triggerPulseWave}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700/70 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title="Fire an animated impulse wave across the diagram"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Pulse Signal</span>
          </button>
        </div>
      </div>

      {/* SVG Diagram Canvas Container */}
      <div className="relative z-10 w-full bg-slate-950/80 rounded-2xl border border-slate-800/90 shadow-inner p-2 sm:p-4 overflow-hidden">
        {/* Direction & Help Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 text-xs text-slate-400 border-b border-slate-800/60 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
              {viewMode === 'all'
                ? 'All Dynamic Bridges Active'
                : viewMode === 'boundaries'
                ? 'Displaying Safe Connection Limits'
                : `Focusing Parallel 0${activeIndex + 1}: ${activeMapping.underlyingDynamic}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setTransferDirection((d) => (d === 'forward' ? 'bidirectional' : 'forward'))
              }
              className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
              title="Toggle transfer direction"
            >
              <ArrowLeftRight className="w-3 h-3 text-amber-400" />
              <span>
                {transferDirection === 'bidirectional'
                  ? 'Flow: Bi-directional ⇆'
                  : 'Flow: Lived → Unfamiliar →'}
              </span>
            </button>
          </div>
        </div>

        {/* The Responsive SVG Diagram */}
        <div className="w-full overflow-x-auto touch-pan-x py-2">
          <svg
            className="w-full min-w-[700px] h-auto select-none"
            viewBox={`0 0 900 ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            role="region"
            aria-label="Interactive SVG diagram mapping relationships between unfamiliar topic and familiar domain"
          >
            <defs>
              {/* Synapse Glow Filter */}
              <filter id={`synapseGlow_${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Active Connection Gradients */}
              <linearGradient id={`bridgeGrad_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id={`inactiveGrad_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#334155" stopOpacity="0.7" />
              </linearGradient>

              <linearGradient id={`boundaryGrad_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Column Guide Background Ribbons */}
            <g opacity="0.35">
              {/* Left Column Tint */}
              <rect
                x={30}
                y={60}
                width={280}
                height={svgHeight - 80}
                rx={16}
                fill="#042f2e"
                opacity="0.3"
              />
              {/* Center Conduit Tint */}
              <rect
                x={330}
                y={60}
                width={240}
                height={svgHeight - 80}
                rx={16}
                fill="#0f172a"
                opacity="0.5"
              />
              {/* Right Column Tint */}
              <rect
                x={590}
                y={60}
                width={280}
                height={svgHeight - 80}
                rx={16}
                fill="#451a03"
                opacity="0.25"
              />
            </g>

            {/* Top Column Domain Headers */}
            <g>
              {/* Left Pillar Header: Unfamiliar Domain */}
              <g transform="translate(170, 42)">
                <rect
                  x="-120"
                  y="-18"
                  width="240"
                  height="34"
                  rx="10"
                  fill="#042f2e"
                  stroke="#14b8a6"
                  strokeWidth="1.2"
                  strokeOpacity="0.6"
                />
                <circle cx="-96" cy="-1" r="5" fill="#14b8a6" />
                <text
                  x="-82"
                  y="4"
                  fill="#5eead4"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="1"
                >
                  TARGET: UNFAMILIAR
                </text>
              </g>

              {/* Center Pillar Header: Relational Dynamic Hub */}
              <g transform="translate(450, 42)">
                <rect
                  x="-100"
                  y="-18"
                  width="200"
                  height="34"
                  rx="10"
                  fill="#1e293b"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeOpacity="0.6"
                />
                <circle cx="-80" cy="-1" r="5" fill="#38bdf8" />
                <text
                  x="-66"
                  y="4"
                  fill="#bae6fd"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="1"
                >
                  SHARED DYNAMICS
                </text>
              </g>

              {/* Right Pillar Header: Familiar Lived Twin */}
              <g transform="translate(730, 42)">
                <rect
                  x="-120"
                  y="-18"
                  width="240"
                  height="34"
                  rx="10"
                  fill="#451a03"
                  stroke="#f59e0b"
                  strokeWidth="1.2"
                  strokeOpacity="0.6"
                />
                <circle cx="-96" cy="-1" r="5" fill="#f59e0b" />
                <text
                  x="-82"
                  y="4"
                  fill="#fde68a"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="1"
                >
                  LIVED TWIN: FAMILIAR
                </text>
              </g>
            </g>

            {/* Connecting Synaptic Splines (Rendered under nodes) */}
            <g key={`paths_${pulseKey}`}>
              {safeMappings.map((mapping, idx) => {
                const y = startY + idx * rowGap;
                const isSelected = activeIndex === idx;
                const isHovered = hoveredNodeIndex === idx;
                const isHighlighted = viewMode === 'all' || isSelected || isHovered;

                // Bezier path connecting Left -> Center -> Right
                const leftToCenter = `M ${leftX} ${y} C ${leftX + 100} ${y - 12}, ${centerX - 100} ${y + 12}, ${centerX} ${y}`;
                const centerToRight = `M ${centerX} ${y} C ${centerX + 100} ${y - 12}, ${rightX - 100} ${y + 12}, ${rightX} ${y}`;
                const fullBridge = `M ${leftX} ${y} C ${leftX + 90} ${y - 16}, ${centerX - 80} ${y + 16}, ${centerX} ${y} C ${centerX + 80} ${y - 16}, ${rightX - 90} ${y + 16}, ${rightX} ${y}`;

                return (
                  <g
                    key={`synapse_${idx}`}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedNodeIndex(idx);
                      setSelectedColumn('center');
                    }}
                    onMouseEnter={() => setHoveredNodeIndex(idx)}
                    onMouseLeave={() => setHoveredNodeIndex(null)}
                  >
                    {/* Generous Invisible Hit Path for Effortless Tapping */}
                    <path
                      d={fullBridge}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="36"
                      className="cursor-pointer"
                    />

                    {/* Ambient Guide Line */}
                    <path
                      d={fullBridge}
                      fill="none"
                      stroke={
                        viewMode === 'boundaries' && isHighlighted
                          ? `url(#boundaryGrad_${uniqueId})`
                          : isHighlighted
                          ? `url(#bridgeGrad_${uniqueId})`
                          : `url(#inactiveGrad_${uniqueId})`
                      }
                      strokeWidth={isHighlighted ? (isSelected ? '4' : '2.5') : '1.5'}
                      strokeDasharray={isHighlighted ? (viewMode === 'boundaries' ? '6 4' : 'none') : '4 4'}
                      strokeLinecap="round"
                      opacity={isHighlighted ? 0.95 : 0.3}
                      filter={isHighlighted && isSelected ? `url(#synapseGlow_${uniqueId})` : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Animated Traveling Pulses on Highlighted Bridges */}
                    {isHighlighted && (
                      <>
                        {/* Impulse from Familiar (Right) to Unfamiliar (Left) */}
                        <circle r="4.5" fill="#f59e0b">
                          <animateMotion
                            path={`M ${rightX} ${y} C ${rightX - 90} ${y + 16}, ${centerX + 80} ${y - 16}, ${centerX} ${y} C ${centerX - 80} ${y + 16}, ${leftX + 90} ${y - 16}, ${leftX} ${y}`}
                            dur={isSelected ? '2.4s' : '3.6s'}
                            begin={`${idx * 0.4}s`}
                            repeatCount="indefinite"
                          />
                        </circle>

                        {/* Bidirectional Counter Pulse from Left to Right */}
                        {(transferDirection === 'bidirectional' || isSelected) && (
                          <circle r="4" fill="#14b8a6">
                            <animateMotion
                              path={fullBridge}
                              dur={isSelected ? '2.8s' : '4.2s'}
                              begin={`${idx * 0.5 + 0.3}s`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                      </>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Interactive Nodes and Labels */}
            {safeMappings.map((mapping, idx) => {
              const y = startY + idx * rowGap;
              const isSelected = activeIndex === idx;
              const isHovered = hoveredNodeIndex === idx;
              const isHighlighted = viewMode === 'all' || isSelected || isHovered;

              // Truncate labels for SVG canvas text
              const shortUnfamiliar =
                mapping.unfamiliarElement.length > 22
                  ? `${mapping.unfamiliarElement.slice(0, 20)}…`
                  : mapping.unfamiliarElement;

              const shortFamiliar =
                mapping.familiarElement.length > 22
                  ? `${mapping.familiarElement.slice(0, 20)}…`
                  : mapping.familiarElement;

              const shortDynamic =
                mapping.underlyingDynamic.length > 20
                  ? `${mapping.underlyingDynamic.slice(0, 18)}…`
                  : mapping.underlyingDynamic;

              return (
                <g key={`row_${idx}`} className="transition-opacity duration-200">
                  {/* ===================== LEFT NODE (UNFAMILIAR) ===================== */}
                  <g
                    transform={`translate(${leftX}, ${y})`}
                    className="cursor-pointer group"
                    tabIndex={0}
                    role="button"
                    aria-label={`Unfamiliar element: ${mapping.unfamiliarElement}`}
                    onClick={() => {
                      setSelectedNodeIndex(idx);
                      setSelectedColumn('left');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedNodeIndex(idx);
                        setSelectedColumn('left');
                      }
                    }}
                    onMouseEnter={() => setHoveredNodeIndex(idx)}
                    onMouseLeave={() => setHoveredNodeIndex(null)}
                  >
                    {/* Generous touch target */}
                    <circle cx="0" cy="0" r="32" fill="transparent" />

                    {/* Outer animated halo when active */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="20"
                        fill="none"
                        stroke="#14b8a6"
                        strokeWidth="1.5"
                        opacity="0.6"
                        className="animate-ping"
                      />
                    )}

                    {/* Node Body */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? '14' : '11'}
                      fill={isHighlighted ? '#042f2e' : '#0f172a'}
                      stroke="#14b8a6"
                      strokeWidth={isSelected ? '3' : '1.8'}
                      filter={isSelected ? `url(#synapseGlow_${uniqueId})` : undefined}
                      className="transition-all duration-200"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? '6' : '4.5'}
                      fill={isSelected ? '#5eead4' : '#14b8a6'}
                    />

                    {/* Label Badge / Text on Left side */}
                    <g transform="translate(-24, 0)">
                      <rect
                        x="-140"
                        y="-15"
                        width="134"
                        height="30"
                        rx="7"
                        fill={isSelected ? '#0f2928' : '#091515'}
                        stroke={isSelected ? '#14b8a6' : '#134e4a'}
                        strokeWidth={isSelected ? '1.5' : '1'}
                        opacity={isHighlighted ? 1 : 0.65}
                      />
                      <text
                        x="-10"
                        y="4"
                        textAnchor="end"
                        fill={isSelected ? '#f0fdfa' : '#99f6e4'}
                        fontSize="11.5"
                        fontWeight={isSelected ? '600' : '500'}
                        fontFamily="sans-serif"
                      >
                        {shortUnfamiliar}
                      </text>
                    </g>
                  </g>

                  {/* ===================== CENTER HUB (DYNAMIC BRIDGE) ===================== */}
                  <g
                    transform={`translate(${centerX}, ${y})`}
                    className="cursor-pointer group"
                    tabIndex={0}
                    role="button"
                    aria-label={`Shared dynamic: ${mapping.underlyingDynamic}`}
                    onClick={() => {
                      setSelectedNodeIndex(idx);
                      setSelectedColumn('center');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedNodeIndex(idx);
                        setSelectedColumn('center');
                      }
                    }}
                    onMouseEnter={() => setHoveredNodeIndex(idx)}
                    onMouseLeave={() => setHoveredNodeIndex(null)}
                  >
                    {/* Generous touch target */}
                    <rect
                      x="-80"
                      y="-22"
                      width="160"
                      height="44"
                      fill="transparent"
                    />

                    {/* Center Dynamic Pill */}
                    <rect
                      x="-72"
                      y="-17"
                      width="144"
                      height="34"
                      rx="17"
                      fill={
                        viewMode === 'boundaries' && isSelected
                          ? '#3b0714'
                          : isSelected
                          ? '#1e293b'
                          : '#0b1120'
                      }
                      stroke={
                        viewMode === 'boundaries' && isSelected
                          ? '#f43f5e'
                          : isSelected
                          ? '#38bdf8'
                          : '#334155'
                      }
                      strokeWidth={isSelected ? '2' : '1.2'}
                      filter={isSelected ? `url(#synapseGlow_${uniqueId})` : undefined}
                      className="transition-all duration-200"
                    />

                    {/* Small dynamic index dot */}
                    <circle
                      cx="-54"
                      cy="0"
                      r="4.5"
                      fill={
                        viewMode === 'boundaries' && isSelected
                          ? '#fb7185'
                          : isSelected
                          ? '#38bdf8'
                          : '#64748b'
                      }
                    />

                    <text
                      x="4"
                      y="4"
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {shortDynamic}
                    </text>
                  </g>

                  {/* ===================== RIGHT NODE (FAMILIAR TWIN) ===================== */}
                  <g
                    transform={`translate(${rightX}, ${y})`}
                    className="cursor-pointer group"
                    tabIndex={0}
                    role="button"
                    aria-label={`Familiar element: ${mapping.familiarElement}`}
                    onClick={() => {
                      setSelectedNodeIndex(idx);
                      setSelectedColumn('right');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedNodeIndex(idx);
                        setSelectedColumn('right');
                      }
                    }}
                    onMouseEnter={() => setHoveredNodeIndex(idx)}
                    onMouseLeave={() => setHoveredNodeIndex(null)}
                  >
                    {/* Generous touch target */}
                    <circle cx="0" cy="0" r="32" fill="transparent" />

                    {/* Outer animated halo when active */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="20"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        opacity="0.6"
                        className="animate-ping"
                      />
                    )}

                    {/* Node Body */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? '14' : '11'}
                      fill={isHighlighted ? '#451a03' : '#0f172a'}
                      stroke="#f59e0b"
                      strokeWidth={isSelected ? '3' : '1.8'}
                      filter={isSelected ? `url(#synapseGlow_${uniqueId})` : undefined}
                      className="transition-all duration-200"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? '6' : '4.5'}
                      fill={isSelected ? '#fde68a' : '#f59e0b'}
                    />

                    {/* Label Badge / Text on Right side */}
                    <g transform="translate(24, 0)">
                      <rect
                        x="6"
                        y="-15"
                        width="134"
                        height="30"
                        rx="7"
                        fill={isSelected ? '#2d1804' : '#140c04'}
                        stroke={isSelected ? '#f59e0b' : '#78350f'}
                        strokeWidth={isSelected ? '1.5' : '1'}
                        opacity={isHighlighted ? 1 : 0.65}
                      />
                      <text
                        x="16"
                        y="4"
                        textAnchor="start"
                        fill={isSelected ? '#fffbeb' : '#fef3c7'}
                        fontSize="11.5"
                        fontWeight={isSelected ? '600' : '500'}
                        fontFamily="sans-serif"
                      >
                        {shortFamiliar}
                      </text>
                    </g>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Mobile / Screen Helper Text */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 px-2 border-t border-slate-900/80">
          <span>Tap any node, spline, or dynamic pill to reveal relational details</span>
          <span className="hidden sm:inline font-mono">Use arrow buttons below to cycle through parallels</span>
        </div>
      </div>

      {/* ==================== ACTIVE NODE INSPECTION DRAWER ==================== */}
      <div className="relative z-10 bg-slate-950 rounded-2xl border border-slate-800/90 p-4 sm:p-6 space-y-4 shadow-xl">
        {/* Navigation & Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-400">
              Parallel 0{activeIndex + 1} of 0{safeMappings.length}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-200 text-sm font-semibold">
              {activeMapping.underlyingDynamic}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Listen Button */}
            <button
              type="button"
              onClick={handleListenMapping}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                speech.isPlaying
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
              title="Listen to this parallel connection read aloud"
            >
              {speech.isPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Listen</span>
                </>
              )}
            </button>

            {/* Steppers */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Previous connection"
                aria-label="Previous connection"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Next connection"
                aria-label="Next connection"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Side-by-Side Dual Anchor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Target Unfamiliar Element */}
          <div
            className={`p-4 rounded-xl transition-all border ${
              selectedColumn === 'left'
                ? 'bg-teal-950/60 border-teal-500/70 shadow-md shadow-teal-950/50'
                : 'bg-slate-900/80 border-teal-500/30'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                In {unfamiliarTopic} (Unfamiliar)
              </span>
              <Sparkles className="w-3.5 h-3.5 text-teal-400/80" />
            </div>
            <div className="text-base font-semibold text-slate-100">
              {activeMapping.unfamiliarElement}
            </div>
          </div>

          {/* Familiar Lived Twin Element */}
          <div
            className={`p-4 rounded-xl transition-all border ${
              selectedColumn === 'right'
                ? 'bg-amber-950/60 border-amber-500/70 shadow-md shadow-amber-950/50'
                : 'bg-slate-900/80 border-amber-500/30'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                In {familiarDomain} (Lived Experience Twin)
              </span>
              <GitCommit className="w-3.5 h-3.5 text-amber-400/80" />
            </div>
            <div className="text-base font-semibold text-slate-100">
              {activeMapping.familiarElement}
            </div>
          </div>
        </div>

        {/* Narrative Dynamic Explanation */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>How This Relational Dynamic Operates</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {activeMapping.explanation}
          </p>
        </div>

        {/* Boundary / Limits Analysis (Where the Analogy Fails) */}
        {activeDifference && (
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-rose-400 font-medium font-mono text-[11px] uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Boundary Warning: Where This Analogy Stops Working</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <span className="font-semibold text-rose-200">Where it fails: </span>
              {activeDifference.whereItFails}
            </p>
            {activeDifference.riskOfAssumingIdentical && (
              <p className="text-slate-400 text-xs italic">
                *Risk of assuming identical: {activeDifference.riskOfAssumingIdentical}
              </p>
            )}
          </div>
        )}

        {/* Bi-directional Transfer Insight (If Available) */}
        {bidirectionalInsights && (
          <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/30 text-xs text-sky-200/90 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-sky-300 block mb-0.5">
                Bi-Directional Reflection:
              </span>
              <p className="text-slate-300">
                {bidirectionalInsights.unfamiliarToFamiliar}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
