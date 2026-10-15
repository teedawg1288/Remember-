import React, { useState } from 'react';
import { RealityCheckResult } from '../../types/translation';
import {
  CheckCircle2,
  Eye,
  Heart,
  Brain,
  FileCheck,
  HelpCircle,
  ShieldCheck,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface VisualRealitySpectrumProps {
  result: RealityCheckResult;
}

type SpectrumCategory = 'observed' | 'feelings' | 'beliefs' | 'evidence' | 'uncertain';

export const VisualRealitySpectrum: React.FC<VisualRealitySpectrumProps> = ({ result }) => {
  const [activeCategory, setActiveCategory] = useState<SpectrumCategory>('observed');

  const categories = [
    {
      id: 'observed' as SpectrumCategory,
      title: 'Observed Facts',
      count: result.whatWasDirectlyObserved.length + result.whatActuallyHappened.length,
      color: 'teal',
      badge: 'GROUND TRUTH',
      summary: 'Tangible occurrences and sensory observations without narrative spin.',
      items: [...result.whatActuallyHappened, ...result.whatWasDirectlyObserved],
      icon: Eye
    },
    {
      id: 'feelings' as SpectrumCategory,
      title: 'Valid Feelings',
      count: result.whatThePersonIsFeeling.length,
      color: 'rose',
      badge: 'EMOTIONALLY REAL',
      summary: 'Real emotional sensations that require validation, but never prove external facts.',
      items: result.whatThePersonIsFeeling,
      icon: Heart
    },
    {
      id: 'beliefs' as SpectrumCategory,
      title: 'Interpretations / Story',
      count: result.whatThePersonBelievesHappened.length,
      color: 'amber',
      badge: 'UNVERIFIED NARRATIVE',
      summary: 'Mental stories, inferred motives, and assumptions created to fill in the blanks.',
      items: result.whatThePersonBelievesHappened,
      icon: Brain
    },
    {
      id: 'evidence' as SpectrumCategory,
      title: 'Verified Evidence',
      count: result.whatAvailableEvidenceSupports.length,
      color: 'indigo',
      badge: 'CORROBORATED',
      summary: 'Claims supported by verifiable records, physical proof, or corroborating witnesses.',
      items: result.whatAvailableEvidenceSupports,
      icon: FileCheck
    },
    {
      id: 'uncertain' as SpectrumCategory,
      title: 'Unknowns & Missing Data',
      count: result.whatRemainsUncertain.length,
      color: 'slate',
      badge: 'INVESTIGATION NEEDED',
      summary: 'Ambiguities where conclusive proof is absent. Healthy minds tolerate uncertainty.',
      items: result.whatRemainsUncertain,
      icon: HelpCircle
    }
  ];

  const active = categories.find((c) => c.id === activeCategory) || categories[0];
  const ActiveIcon = active.icon;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Epistemological Spectrum</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-100 mt-0.5">
            The Reality Separation Spectrum
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Tap each category along the spectrum to separate physical reality from emotional narrative.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 self-start sm:self-center shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Anti-misinformation Filter</span>
        </div>
      </div>

      {/* Interactive Category Selector Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-800 to-slate-850 border-amber-400/80 shadow-md ring-1 ring-amber-400/40 scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </div>
              <div className={`text-xs font-semibold mt-2 truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {cat.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* SVG Separation Funnel Visual */}
      <div className="w-full bg-slate-950/90 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4">
        <div className="w-full h-24 sm:h-28 bg-slate-900 rounded-xl border border-slate-800/80 flex items-center justify-center p-2 relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 500 90">
            {/* Spectrum gradient bar */}
            <defs>
              <linearGradient id="spectrumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="25%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="75%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>

            <line x1="40" y1="45" x2="460" y2="45" stroke="url(#spectrumGradient)" strokeWidth="4" strokeLinecap="round" />

            {/* Indicator dots for 5 buckets */}
            <circle cx="60" cy="45" r="10" fill={activeCategory === 'observed' ? '#14b8a6' : '#0f172a'} stroke="#14b8a6" strokeWidth="2" />
            <circle cx="150" cy="45" r="10" fill={activeCategory === 'feelings' ? '#f43f5e' : '#0f172a'} stroke="#f43f5e" strokeWidth="2" />
            <circle cx="250" cy="45" r="10" fill={activeCategory === 'beliefs' ? '#f59e0b' : '#0f172a'} stroke="#f59e0b" strokeWidth="2" />
            <circle cx="350" cy="45" r="10" fill={activeCategory === 'evidence' ? '#6366f1' : '#0f172a'} stroke="#6366f1" strokeWidth="2" />
            <circle cx="440" cy="45" r="10" fill={activeCategory === 'uncertain' ? '#94a3b8' : '#0f172a'} stroke="#94a3b8" strokeWidth="2" />

            {/* Text labels */}
            <text x="60" y="70" fill="#2dd4bf" fontSize="8" fontWeight="bold" textAnchor="middle">OBSERVED</text>
            <text x="150" y="70" fill="#fda4af" fontSize="8" fontWeight="bold" textAnchor="middle">FEELINGS</text>
            <text x="250" y="70" fill="#fde68a" fontSize="8" fontWeight="bold" textAnchor="middle">BELIEFS</text>
            <text x="350" y="70" fill="#c7d2fe" fontSize="8" fontWeight="bold" textAnchor="middle">EVIDENCE</text>
            <text x="440" y="70" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle">UNKNOWN</text>
          </svg>
        </div>

        {/* Selected Category Deep Dive Panel */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <ActiveIcon className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-slate-100 text-sm">{active.title}</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
              {active.badge}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {active.summary}
          </p>

          {/* List of items in this category */}
          <div className="space-y-2 pt-1">
            {active.items.length > 0 ? (
              active.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 flex items-start gap-2.5"
                >
                  <span className="text-amber-400 font-mono font-bold mt-0.5 shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No items identified in this category.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
