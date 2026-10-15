import React, { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  Search,
  Users
} from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'unreached' | 'speculating' | 'verified_fact' | 'refuted';
  statement: string;
  evidenceWeight: number; // 0 to 100
}

const INITIAL_NODES: NetworkNode[] = [
  {
    id: 'source',
    name: 'Originator',
    x: 60,
    y: 110,
    status: 'speculating',
    statement: '"I saw an ambulance outside the school building at 8 AM."',
    evidenceWeight: 80 // directly observed fact
  },
  {
    id: 'nodeA',
    name: 'Peer 1 (Text Group)',
    x: 180,
    y: 60,
    status: 'speculating',
    statement: '"Someone told me the school had a major chemical spill!"',
    evidenceWeight: 20 // unverified interpretation
  },
  {
    id: 'nodeB',
    name: 'Peer 2 (Social App)',
    x: 180,
    y: 160,
    status: 'speculating',
    statement: '"Everyone says classes are cancelled for the rest of the week."',
    evidenceWeight: 10 // hearsay extrapolation
  },
  {
    id: 'nodeC',
    name: 'Broadcaster (Viral Post)',
    x: 320,
    y: 110,
    status: 'speculating',
    statement: '"BREAKING: Massive hazmat disaster covered up by school board!"',
    evidenceWeight: 5 // sensationalized amplification
  },
  {
    id: 'verifier',
    name: 'Official Records / Dispatch',
    x: 440,
    y: 110,
    status: 'unreached',
    statement: 'Fire Dispatch Log: "Routine false alarm triggered by burnt toast in staff cafeteria."',
    evidenceWeight: 100 // verified primary record
  }
];

export const VisualInformationNetwork: React.FC = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('source');
  const [hasVerifiedWithOfficial, setHasVerifiedWithOfficial] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleApplyVerification = () => {
    setHasVerifiedWithOfficial(true);
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === 'verifier') {
          return { ...n, status: 'verified_fact' };
        }
        if (n.id === 'nodeA' || n.id === 'nodeB' || n.id === 'nodeC') {
          return { ...n, status: 'refuted' };
        }
        return n;
      })
    );
  };

  const handleReset = () => {
    setNodes(INITIAL_NODES);
    setHasVerifiedWithOfficial(false);
    setSelectedNodeId('source');
    setStepIndex(0);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Network Diffusion Model</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-100 mt-0.5">
            Rumours vs. Verified Reality in Information Networks
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Tap each node in the transmission chain to see how raw observation mutates into viral distortion, and how primary records collapse speculation.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Network</span>
        </button>
      </div>

      {/* SVG Interactive Network Canvas */}
      <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono border-b border-slate-800 pb-2">
          <span className="text-slate-400">
            Status: {hasVerifiedWithOfficial ? 'Primary Verification Applied' : 'Unchecked Rumour Diffusion'}
          </span>
          <span className="text-teal-400">Tap any person/node below to inspect evidence:</span>
        </div>

        <div className="w-full h-64 sm:h-72 bg-slate-900/90 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-visible">
          <svg className="w-full h-full" viewBox="0 0 520 220">
            {/* Connection Edges */}
            <g strokeWidth="2" strokeDasharray="3 3">
              {/* Origin -> Peer 1 */}
              <line
                x1="60"
                y1="110"
                x2="180"
                y2="60"
                stroke={hasVerifiedWithOfficial ? '#ef4444' : '#f59e0b'}
              />
              {/* Origin -> Peer 2 */}
              <line
                x1="60"
                y1="110"
                x2="180"
                y2="160"
                stroke={hasVerifiedWithOfficial ? '#ef4444' : '#f59e0b'}
              />
              {/* Peer 1 -> Broadcaster */}
              <line
                x1="180"
                y1="60"
                x2="320"
                y2="110"
                stroke={hasVerifiedWithOfficial ? '#ef4444' : '#f43f5e'}
              />
              {/* Peer 2 -> Broadcaster */}
              <line
                x1="180"
                y1="160"
                x2="320"
                y2="110"
                stroke={hasVerifiedWithOfficial ? '#ef4444' : '#f43f5e'}
              />
              {/* Broadcaster -> Official Verifier */}
              <line
                x1="320"
                y1="110"
                x2="440"
                y2="110"
                stroke={hasVerifiedWithOfficial ? '#10b981' : '#64748b'}
                strokeWidth={hasVerifiedWithOfficial ? '3' : '1.5'}
              />
            </g>

            {/* Interactive Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isRefuted = node.status === 'refuted';
              const isVerified = node.status === 'verified_fact';

              const fill = isRefuted
                ? '#7f1d1d'
                : isVerified
                ? '#065f46'
                : node.id === 'source'
                ? '#1e293b'
                : '#78350f';

              const stroke = isRefuted
                ? '#ef4444'
                : isVerified
                ? '#10b981'
                : isSelected
                ? '#fbbf24'
                : '#94a3b8';

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer transition-transform hover:scale-105"
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                >
                  {/* Selection glow circle */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="26"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                  )}

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected ? '3' : '2'}
                  />

                  {/* Icon label initials */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {node.id === 'source'
                      ? 'OBS'
                      : node.id === 'verifier'
                      ? 'DOC'
                      : isRefuted
                      ? 'FAIL'
                      : 'RUM'}
                  </text>

                  {/* Node Name beneath */}
                  <text
                    x={node.x}
                    y={node.y + 34}
                    fill={isSelected ? '#fbbf24' : '#cbd5e1'}
                    fontSize="9"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Action Button: Verify with Primary Records */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="text-xs text-slate-300">
            {hasVerifiedWithOfficial ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Primary verification applied: Speculative branches marked as refuted.
              </span>
            ) : (
              <span className="text-amber-400 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Unfiltered diffusion: Each transmission adds emotional exaggeration without new evidence.
              </span>
            )}
          </div>

          <button
            onClick={handleApplyVerification}
            disabled={hasVerifiedWithOfficial}
            className={`min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
              hasVerifiedWithOfficial
                ? 'bg-slate-800 text-slate-500 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.98]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Verify With Primary Records</span>
          </button>
        </div>
      </div>

      {/* Selected Node Inspector Detail Card */}
      <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
              Inspecting: {selectedNode.name}
            </span>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
              selectedNode.status === 'refuted'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : selectedNode.status === 'verified_fact'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              {selectedNode.status.toUpperCase()}
            </span>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Evidence Credibility: <span className="font-bold text-white">{selectedNode.evidenceWeight}%</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Statement Circulated:
          </span>
          <p className="text-sm font-serif italic text-slate-100 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            {selectedNode.statement}
          </p>
        </div>

        {/* Analytical separation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-teal-400 font-semibold block mb-0.5">What Was Observed:</span>
            <p className="text-slate-300">
              {selectedNode.id === 'source'
                ? 'A stationary emergency vehicle with lights on.'
                : selectedNode.id === 'verifier'
                ? 'An official timestamped radio log by the department.'
                : 'Second-hand or third-hand text messages with no direct photos or documentation.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-amber-400 font-semibold block mb-0.5">What Was Inferred / Added:</span>
            <p className="text-slate-300">
              {selectedNode.id === 'source'
                ? 'No cause assumed; just reporting the sighting.'
                : selectedNode.id === 'verifier'
                ? 'None; log reflects direct dispatch verification.'
                : 'Assumed a catastrophic hazard or malicious institutional coverup.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
