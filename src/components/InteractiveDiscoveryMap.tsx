import React, { useState, useId, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  Eye,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Radio,
  History,
  Languages,
  FlaskConical,
  GitBranch,
  Bookmark,
  Share2,
  Compass,
  Sliders,
  ChevronRight,
  X,
  Maximize2,
  Layers,
  Activity,
  Flame,
  Volume2,
} from 'lucide-react';
import {
  SameStoryResult,
  StoryParallel,
  ScaleConnection,
  CrucialDifference,
  LivingRosettaStone,
} from '../types/sameStory';
import { sound } from '../audio/soundEngine';
import { getRosettaStoneForAnalysis } from '../data/curatedRosettaStones';

export interface DiscoveryNode {
  id: string;
  domain: 'history' | 'science' | 'psychology' | 'prediction' | 'scale' | 'research';
  fieldLabel: string;
  nodeTitle: string;
  tagline: string;
  evidenceType: 'Historical Parallel' | 'Cross-Field Comparison' | 'Possible Interpretation' | 'Testable Prediction' | 'Systemic Scale' | 'Citation to Check';
  evidenceRating: 'Needs Independent Check' | 'Hypothesis / Testable';
  isomorphismSummary: string;
  color: {
    bg: string;
    border: string;
    glow: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
  };
  details: {
    donorField: string;
    whatHappenedThere: string;
    howItDirectlyAppliesToYou: string;
    theCrucialDifference: string;
    whyDifferenceMatters: string;
    testableAction: string;
  };
}

interface InteractiveDiscoveryMapProps {
  analysis: SameStoryResult;
  persona: 'barber' | 'bartender';
  appName: string;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onOpenResearchLab?: () => void;
  onNavigateTab?: (tab: 'story' | 'bridge' | 'eras' | 'rosetta') => void;
}

export const InteractiveDiscoveryMap: React.FC<InteractiveDiscoveryMapProps> = ({
  analysis,
  persona,
  appName,
  isSaved = false,
  onToggleSave,
  onOpenResearchLab,
  onNavigateTab,
}) => {
  // Active selected node ID. null means centered on user dilemma
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeExperimentDecision, setActiveExperimentDecision] = useState<'default' | 'alternative' | 'third'>('default');
  const [activePerspective, setActivePerspective] = useState<'you' | 'them' | 'third_party'>('you');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Derive Nodes from Real Analysis
  const primaryParallel = analysis.stories[0];
  const secondaryParallel = analysis.stories[1] || null;
  const prediction = analysis.prediction;
  const scenarioList = analysis.whatIfScenarios || [];
  const rosetta = getRosettaStoneForAnalysis(analysis);
  const diffCrucial = analysis.differenceThatChangesEverything;

  // Build the constellation nodes dynamically
  const nodes: DiscoveryNode[] = useMemo(() => {
    const list: DiscoveryNode[] = [
      {
        id: 'node-history',
        domain: 'history',
        fieldLabel: primaryParallel?.domainLabel || 'Historical Parallel',
        nodeTitle: primaryParallel?.title || 'Comparison not available',
        tagline: primaryParallel?.timeAndPlace || 'Time and place not supplied',
        evidenceType: 'Historical Parallel',
        evidenceRating: 'Needs Independent Check',
        isomorphismSummary: primaryParallel?.whatActuallyHappened || 'No source-backed historical account supplied.',
        color: {
          bg: 'from-amber-950/80 to-[#1e1710]',
          border: 'border-amber-500/50',
          glow: 'rgba(245, 158, 11, 0.35)',
          text: 'text-amber-300',
          badgeBg: 'bg-amber-500/15',
          badgeText: 'text-amber-300 border-amber-500/30',
          accent: '#f59e0b',
        },
        details: {
          donorField: primaryParallel?.timeAndPlace || 'Historical Record',
          whatHappenedThere: primaryParallel?.whatActuallyHappened || primaryParallel?.narrative || 'No account has been supplied for this comparison.',
          howItDirectlyAppliesToYou: primaryParallel?.whatThisFieldAlreadyFiguredOut || 'No transferable finding has been supplied for this comparison.',
          theCrucialDifference: analysis.crucialDifferences?.[0]?.comparison || 'The compared situations may have different causes, constraints, and stakes.',
          whyDifferenceMatters: analysis.crucialDifferences?.[0]?.whyThisDifferenceMatters || 'Check whether the comparison still holds under each situation’s specific conditions.',
          testableAction: analysis.unresolvedQuestion?.testablePossibility || 'Check what evidence would distinguish this comparison from a superficial similarity.',
        },
      },
      {
        id: 'node-science',
        domain: 'science',
        fieldLabel: analysis.borrowedInsight?.donorField || 'Other Field',
        nodeTitle: analysis.borrowedInsight?.donorField || 'Candidate Cross-Field Insight',
        tagline: 'Borrowed mechanism — inspect limits',
        evidenceType: 'Cross-Field Comparison',
        evidenceRating: 'Needs Independent Check',
        isomorphismSummary: analysis.borrowedInsight?.whatWasLearnedThere || 'Candidate comparison; donor finding needs a source.',
        color: {
          bg: 'from-cyan-950/80 to-[#0e1a24]',
          border: 'border-cyan-500/50',
          glow: 'rgba(6, 182, 212, 0.35)',
          text: 'text-cyan-300',
          badgeBg: 'bg-cyan-500/15',
          badgeText: 'text-cyan-300 border-cyan-500/30',
          accent: '#06b6d4',
        },
        details: {
          donorField: analysis.borrowedInsight?.donorField || 'Other Field',
          whatHappenedThere: analysis.borrowedInsight?.whatWasLearnedThere || 'No donor finding described.',
          howItDirectlyAppliesToYou: analysis.borrowedInsight?.howItAppliesHere || 'Transfer not established.',
          theCrucialDifference: analysis.crucialDifferences?.[0]?.comparison || 'Different domains may involve different causes.',
          whyDifferenceMatters: analysis.crucialDifferences?.[0]?.whyThisDifferenceMatters || 'The borrowed mechanism may not transfer.',
          testableAction: analysis.unresolvedQuestion?.testablePossibility || 'Identify a safe observation that distinguishes alternatives.',
        },
      },
      {
        id: 'node-rosetta',
        domain: 'psychology',
        fieldLabel: 'The Living Rosetta Stone',
        nodeTitle: rosetta?.oneQuestionThatChangesEverything?.question
          ? 'The Unseen Perspective'
          : 'The Translation Barrier',
        tagline: `Universal Chord: ${rosetta?.primaryChord || 'Not yet identified'}`,
        evidenceType: 'Possible Interpretation',
        evidenceRating: 'Needs Independent Check',
        isomorphismSummary: rosetta?.oneQuestionThatChangesEverything?.whyItShiftsTheLens || 'Consider other possible interpretations of the same observation.',
        color: {
          bg: 'from-purple-950/80 to-[#191024]',
          border: 'border-purple-500/50',
          glow: 'rgba(168, 85, 247, 0.35)',
          text: 'text-purple-300',
          badgeBg: 'bg-purple-500/15',
          badgeText: 'text-purple-300 border-purple-500/30',
          accent: '#a855f7',
        },
        details: {
          donorField: 'Meaning & Lived Experience',
          whatHappenedThere: rosetta?.translations?.[0]?.speakerB?.felt || 'The other person’s experience has not been confirmed.',
          howItDirectlyAppliesToYou: rosetta?.translations?.[0]?.theBridge || 'A different interpretation is possible; check rather than assume.',
          theCrucialDifference: 'What was expressed, what was heard, and what was understood can be different; interpretations are not confirmed without checking.',
          whyDifferenceMatters: 'A guessed meaning can change a response even when the guess is wrong. Compare each perspective with actual evidence.',
          testableAction: rosetta?.oneQuestionThatChangesEverything?.question || 'Ask what each person or system meant and understood, then check the answer.',
        },
      },
      {
        id: 'node-prediction',
        domain: 'prediction',
        fieldLabel: 'Cause & Effect Experiment',
        nodeTitle: diffCrucial ? 'The Decisive Variable' : 'What If You Change One Decision?',
        tagline: 'Proposed next-step prediction — not tested',
        evidenceType: 'Testable Prediction',
        evidenceRating: 'Hypothesis / Testable',
        isomorphismSummary: prediction?.falsifiablePrediction || 'No prediction supplied for this question.',
        color: {
          bg: 'from-emerald-950/80 to-[#0e2119]',
          border: 'border-emerald-500/50',
          glow: 'rgba(16, 185, 129, 0.35)',
          text: 'text-emerald-300',
          badgeBg: 'bg-emerald-500/15',
          badgeText: 'text-emerald-300 border-emerald-500/30',
          accent: '#10b981',
        },
        details: {
          donorField: prediction?.donorField || 'Proposed donor field',
          whatHappenedThere: prediction?.establishedKnowledgeApplied || 'Donor-domain mechanism needs to be established.',
          howItDirectlyAppliesToYou: prediction?.predictionStages?.newPrediction || prediction?.falsifiablePrediction || 'No transfer prediction available.',
          theCrucialDifference: prediction?.transferLimit || 'An analogous structure does not imply the same outcome.',
          whyDifferenceMatters: analysis.crucialDifferences?.[0]?.whyThisDifferenceMatters || 'Testing should examine whether the difference changes the result.',
          testableAction: prediction?.predictionStages?.howToTest || 'No test designed yet.',
        },
      },
    ];

    // Additional dynamic nodes if expanded
    if (isExpanded) {
      if (analysis.scaleConnections && analysis.scaleConnections.length > 0) {
        const scale = analysis.scaleConnections[1] || analysis.scaleConnections[0];
        list.push({
          id: 'node-scale',
          domain: 'scale',
          fieldLabel: 'Systemic Scale Dynamic',
          nodeTitle: scale.title || 'Workplace & Group Contagion',
          tagline: scale.levelLabel || 'When This Spreads to Groups',
          evidenceType: 'Systemic Scale',
          evidenceRating: 'Needs Independent Check',
          isomorphismSummary: scale.whatIsTheSame || 'No shared group mechanism has been established.',
          color: {
            bg: 'from-rose-950/80 to-[#221015]',
            border: 'border-rose-500/50',
            glow: 'rgba(244, 63, 94, 0.35)',
            text: 'text-rose-300',
            badgeBg: 'bg-rose-500/15',
            badgeText: 'text-rose-300 border-rose-500/30',
            accent: '#f43f5e',
          },
          details: {
            donorField: 'Organizational Systems & Sociology',
            whatHappenedThere: scale.howItAppearsHere || 'When expectations are unstated, everyone watches everyone else and no one acts.',
            howItDirectlyAppliesToYou: scale.whatIsTheSame || 'Check whether the same causal mechanism is present at this scale.',
            theCrucialDifference: scale.whatIsDifferent || 'The roles, incentives, and responsibilities may differ with scale.',
            whyDifferenceMatters: scale.whyTheDifferenceMatters || 'Determine what changes when the number of actors or authority structure changes.',
            testableAction: analysis.unresolvedQuestion?.testablePossibility || 'Check one key assumption in the larger group setting.',
          },
        });
      }

      if (analysis.deepResearch?.peerReviewedReferences?.length) {
        const ref = analysis.deepResearch.peerReviewedReferences[0];
        list.push({
          id: 'node-research',
          domain: 'research',
          fieldLabel: 'Empirical Literature',
          nodeTitle: 'Peer-Reviewed Benchmark',
          tagline: ref.citation ? ref.citation.slice(0, 42) + '...' : 'No linked studies supplied',
          evidenceType: 'Citation to Check',
          evidenceRating: 'Needs Independent Check',
          isomorphismSummary: ref.relevance || 'The cited work needs to be read before drawing a conclusion.',
          color: {
            bg: 'from-sky-950/80 to-[#0e1d28]',
            border: 'border-sky-500/50',
            glow: 'rgba(14, 165, 233, 0.35)',
            text: 'text-sky-300',
            badgeBg: 'bg-sky-500/15',
            badgeText: 'text-sky-300 border-sky-500/30',
            accent: '#0ea5e9',
          },
          details: {
            donorField: 'Cognitive Science & Social Psychology',
            whatHappenedThere: ref.citation || 'Citation details not supplied',
            howItDirectlyAppliesToYou: analysis.deepResearch.formalHypothesis || 'The finding cannot be generalized without checking the study.',
            theCrucialDifference: 'Study conditions and real-world conditions may differ in ways that change the outcome.',
            whyDifferenceMatters: 'A study supports only the findings established by its actual design, measures, and participants.',
            testableAction: 'Inspect the peer-reviewed methodology in the Deep Research Lab drawer.',
          },
        });
      }
    }

    // A missing comparison should not appear as a discovered connection.
    return list.filter((node) => {
      if (node.id === 'node-science' && analysis.isCustomGenerated) {
        return Boolean(analysis.mechanismBridges?.length);
      }
      if (node.id === 'node-history') return Boolean(primaryParallel);
      if (node.id === 'node-rosetta') return Boolean(analysis.meaningSynchronization);
      if (node.id === 'node-prediction') return Boolean(prediction?.falsifiablePrediction);
      return true;
    });
  }, [analysis, isExpanded, primaryParallel, secondaryParallel, prediction, rosetta, diffCrucial]);

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const handleSelectNode = (nodeId: string) => {
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      sound.playNodeChime(380);
    } else {
      setSelectedNodeId(nodeId);
      sound.playNodeChime(540);
    }
  };

  const handleResetToCenter = () => {
    setSelectedNodeId(null);
    sound.playNodeChime(440);
  };

  // Radial positioning coordinates (percentage from center of viewBox)
  const nodePositions = useMemo(() => {
    const total = nodes.length;
    const radius = 38; // percentage radius
    return nodes.map((node, i) => {
      // Offset starting angle so it forms a balanced halo around the center
      const angle = (i * (2 * Math.PI) / total) - Math.PI / 2;
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      return { id: node.id, x, y };
    });
  }, [nodes]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* 1. Header Toolbar: Live Discovery Banner & Center Status */}
      <div className="bg-[#10131d] border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Living Discovery Map · Candidate Connections
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Explore the connections
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
              Start with your question. Open a connection to see what matches, what differs, and what still needs checking.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onToggleSave && (
              <button
                onClick={() => {
                  onToggleSave();
                  sound.playDiscoveryChime();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-amber-600/30 text-amber-300 border-amber-500/50 shadow-md shadow-amber-950/40'
                    : 'bg-[#161a26] text-stone-300 border-stone-700 hover:border-amber-500/50 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isSaved ? 'Saved in Vault' : 'Save Discovery'}</span>
              </button>
            )}

            {selectedNodeId && (
              <button
                onClick={handleResetToCenter}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1d2232] text-amber-300 border border-amber-500/40 hover:bg-amber-500/20 transition-all cursor-pointer shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return to Center</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. THE LIVING MAP: Touch-Responsive Constellation Canvas */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0e111a] via-[#090b12] to-[#06080e] border border-stone-800 p-4 sm:p-8 shadow-2xl overflow-hidden min-h-[520px] sm:min-h-[580px] flex flex-col justify-between">
        {/* Subtle coordinate grid lines for spatial cartography feel */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />

        {/* Dynamic SVG Connecting Lines & Light Pulses */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="centerToNodeGrad" x1="50%" y1="50%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {nodePositions.map((pos) => {
            const isTargetSelected = selectedNodeId === pos.id;
            const isHovered = hoveredNodeId === pos.id;
            return (
              <g key={pos.id}>
                {/* Background guide line */}
                <line
                  x1="50"
                  y1="50"
                  x2={pos.x}
                  y2={pos.y}
                  stroke={isTargetSelected ? '#f59e0b' : '#334155'}
                  strokeWidth={isTargetSelected ? '0.8' : '0.35'}
                  strokeDasharray={isTargetSelected ? 'none' : '1.5 1'}
                  opacity={isTargetSelected ? '0.9' : '0.45'}
                  filter={isTargetSelected ? 'url(#glowEffect)' : undefined}
                  className="transition-all duration-500"
                />

                {/* Animated energy pulse traveling along the line */}
                <circle
                  r={isTargetSelected ? '1.2' : '0.7'}
                  fill={isTargetSelected ? '#fbbf24' : '#38bdf8'}
                  opacity={isTargetSelected || isHovered ? '0.9' : '0.4'}
                >
                  <animate
                    attributeName="cx"
                    from="50"
                    to={pos.x}
                    dur={`${2.4 + (pos.x % 3)}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    from="50"
                    to={pos.y}
                    dur={`${2.4 + (pos.x % 3)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Mobile & Desktop Responsive Layout */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center my-auto py-8">
          {/* THE CENTER SUN / HUB: The User's Question */}
          <div
            onClick={handleResetToCenter}
            className={`group relative max-w-md w-full mx-auto p-5 sm:p-6 rounded-3xl transition-all duration-500 cursor-pointer text-center border shadow-2xl ${
              selectedNodeId === null
                ? 'bg-gradient-to-b from-[#1e1b14] via-[#161410] to-[#0c0a08] border-amber-500/70 shadow-amber-950/60 scale-105'
                : 'bg-[#12141c]/90 border-stone-700/80 hover:border-amber-500/50 opacity-90'
            }`}
          >
            {/* Center Breathing Aura */}
            <div className="absolute -inset-1 rounded-3xl bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

            <div className="relative z-10 space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                <span>YOUR QUESTION</span>
              </div>

              <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-snug line-clamp-3">
                "{analysis.userOriginalInput || analysis.userWordsSummary}"
              </h3>

              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] font-mono text-stone-400">
                <span className="text-amber-400 font-semibold">Tap a connection to explore</span>
                <span className="text-stone-500 italic">Tap to center</span>
              </div>
            </div>
          </div>

          {/* SATELLITE CONNECTION NODES: Radial on desktop, interactive touch-cards on mobile */}
          <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 relative z-10 max-w-6xl">
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => handleSelectNode(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? `bg-gradient-to-b ${node.color.bg} ${node.color.border} shadow-2xl scale-[1.02] ring-2 ring-amber-500/40`
                      : 'bg-[#111420]/80 hover:bg-[#161a29] border-stone-800 hover:border-stone-600 shadow-lg'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Top Node Meta: Domain badge & Evidence strength */}
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md font-bold border ${node.color.badgeBg} ${node.color.badgeText}`}>
                        {node.fieldLabel}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {node.evidenceType}
                      </span>
                    </div>

                    {/* Node Title */}
                    <h4 className={`font-serif text-sm sm:text-base font-bold leading-snug group-hover:text-white transition-colors ${
                      isSelected ? 'text-white' : node.color.text
                    }`}>
                      {node.nodeTitle}
                    </h4>

                    {/* Tagline */}
                    <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                      {node.isomorphismSummary}
                    </p>
                  </div>

                  {/* Interactive touch indicator */}
                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className={isSelected ? 'text-amber-300 font-bold' : 'text-stone-400'}>
                      {isSelected ? 'Currently Inspecting' : 'Touch to explore →'}
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color.accent }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expand More Connections Action */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                sound.playDiscoveryChime();
              }}
              className="px-4 py-2 rounded-full text-xs font-mono font-bold bg-[#141824] hover:bg-[#1c2233] border border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-amber-300 transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isExpanded ? 'Show fewer connections' : 'Show more connections'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. VISUAL TRANSFORMATION & EXPERIMENTATION STAGE (Opens when a node is selected) */}
      {activeNode && (
        <section className="bg-gradient-to-b from-[#131724] via-[#0f121d] to-[#0a0d16] border border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fade-in relative overflow-hidden">
          {/* Header Bar of Inspection Stage */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono uppercase font-bold px-2.5 py-0.5 rounded-full border ${activeNode.color.badgeBg} ${activeNode.color.badgeText}`}>
                  {activeNode.fieldLabel}
                </span>
                <span className="text-stone-400 text-xs font-mono">
                  Evidence Level: <strong className="text-white">{activeNode.evidenceRating}</strong>
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                {activeNode.nodeTitle}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300">
                Visual transformation showing how both worlds align, where they differ, and what happens when you alter a variable.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetToCenter}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1b202e] hover:bg-[#23293b] text-stone-200 border border-stone-700 hover:border-stone-500 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Return to Central Map</span>
              </button>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-white bg-[#151924] border border-stone-800 hover:border-stone-600 transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VISUAL TRANSFORMATION: Dual-World Overlay (Requirement 2) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Dual-World Structural Alignment
              </h4>
              <span className="text-xs font-mono text-stone-400">
                Possible shared function
              </span>
            </div>

            {/* Side-by-side Connected Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative">
              {/* Left Column: Your Situation */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0b0e15] border border-stone-800 space-y-4 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="text-xs font-mono uppercase text-amber-300 font-bold">
                    Original situation
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">Your question</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-mono text-stone-400 block mb-1">What Happened Here:</span>
                    <p className="text-sm text-stone-100 font-serif leading-snug">
                      "{analysis.userWordsSummary}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141824] border border-stone-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                      A Possible Interpretation:
                    </span>
                    <p className="text-xs text-stone-300">
                      {analysis.storyChain?.defaultChain?.whatYouThought || 'The meaning of this observation has not yet been established.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: The Parallel World */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0b0e15] border border-stone-800 space-y-4 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="text-xs font-mono uppercase font-bold" style={{ color: activeNode.color.accent }}>
                    World B · {activeNode.details.donorField}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Comparison to Examine
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-mono text-stone-400 block mb-1">What Is Reported or Proposed There:</span>
                    <p className="text-sm text-stone-100 font-serif leading-snug">
                      {activeNode.details.whatHappenedThere}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141824] border border-stone-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: activeNode.color.accent }}>
                      What This Comparison Suggests:
                    </span>
                    <p className="text-xs text-stone-300">
                      {activeNode.details.howItDirectlyAppliesToYou}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Crucial Difference & Why It Saves You */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-stone-900/60 to-[#141822] border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <h5 className="font-serif text-sm sm:text-base font-bold text-white">
                  Where the comparison may break
                </h5>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                {activeNode.details.theCrucialDifference}
              </p>
              <div className="pt-2 text-xs font-mono text-amber-300">
                <strong>Why this distinction matters:</strong> {activeNode.details.whyDifferenceMatters}
              </div>
            </div>
          </div>

          {/* Hypothetical branches — no invented simulation data */}
          {!!scenarioList.length && (
            <div className="p-6 rounded-2xl bg-[#0a0d14] border border-stone-800 space-y-5">
              <div>
                <h4 className="font-serif text-lg font-bold text-white">Explore Possible Outcomes</h4>
                <p className="text-xs text-stone-400">Choose an alternative. These are proposed scenarios, not measured or simulated results.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {scenarioList.slice(0, 3).map((scenario, index) => {
                  const decision = (['default', 'alternative', 'third'] as const)[index];
                  return (
                    <button key={scenario.id || index} onClick={() => { setActiveExperimentDecision(decision); sound.playNodeChime(400 + 60 * index); }}
                      className={`p-3.5 rounded-xl border text-left text-xs ${activeExperimentDecision === decision ? 'bg-cyan-950/50 border-cyan-500/60 text-white' : 'bg-[#111420] border-stone-800 text-stone-300'}`}>
                      <span className="text-cyan-300 font-semibold block mb-1">Possibility {index + 1}</span>
                      {scenario.question}
                    </button>
                  );
                })}
              </div>
              {(() => {
                const selectedIndex = Math.min((['default', 'alternative', 'third'] as const).indexOf(activeExperimentDecision), scenarioList.length - 1);
                const scenario = scenarioList[selectedIndex];
                return scenario ? (
                  <div className="rounded-xl bg-[#121624] border border-stone-800 p-4 space-y-2">
                    <p className="text-cyan-300 text-xs font-bold">Hypothetical outcome (unverified)</p>
                    <p className="text-stone-200 text-sm">{scenario.simulatedOutcome}</p>
                    <p className="text-amber-200 text-xs"><strong>Proposed comparison:</strong> {scenario.historicalOrScientificBasis}</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Deep Navigation Bridges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-800">
            <span className="text-xs font-mono text-stone-400">
              Ready to delve deeper into this connection?
            </span>
            <div className="flex items-center gap-2">
              {onNavigateTab && (
                <>
                  <button
                    onClick={() => onNavigateTab('bridge')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#151926] hover:bg-[#1f2537] text-stone-200 border border-stone-700 hover:border-stone-500 transition-colors cursor-pointer"
                  >
                    Open Full Dual Bridge →
                  </button>
                  <button
                    onClick={() => onNavigateTab('eras')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#151926] hover:bg-[#1f2537] text-stone-200 border border-stone-700 hover:border-stone-500 transition-colors cursor-pointer"
                  >
                    Travel 3,400 Years Through Eras →
                  </button>
                </>
              )}
              {onOpenResearchLab && (
                <button
                  onClick={onOpenResearchLab}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 border border-amber-500/50 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Inspect Empirical Protocols</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
