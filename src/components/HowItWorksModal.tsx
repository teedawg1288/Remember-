import React from 'react';
import { X, Layers, ShieldCheck, Check, Compass, Sparkles } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 z-10">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-1">
              Methodology & Purpose
            </div>
            <h3 className="font-serif text-2xl font-semibold text-stone-900">
              The Philosophy of The Last 10%
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
          <p className="font-medium text-stone-900 text-base">
            &ldquo;Understand what you don&apos;t know through what you already do.&rdquo;
          </p>

          <p>
            Most learning platforms bombard you with novel vocabulary, abstract definitions, 
            and authoritative lectures. You feel like a student memorizing for a test rather than 
            a human grasping genuine reality.
          </p>

          <p>
            <strong>The Last 10% operates on an inverted principle:</strong> You have already 
            lived through decades of real physical dynamics—friction, momentum, growth, feedback loops, 
            decay, boundary negotiations, and pressure release valves. By mapping unknown systems onto 
            experiences you already trust, your brain experiences the &ldquo;click&rdquo; of intuitive recognition.
          </p>

          {/* 5-Stage Framework */}
          <div className="pt-2">
            <h4 className="font-semibold text-stone-900 mb-3 text-xs uppercase tracking-wider text-amber-900">
              The Underlying 5-Stage Reasoning Chain:
            </h4>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="font-semibold text-stone-900 block">1. Reality:</span>
                <span className="text-stone-600 text-xs">The actual physical or systemic state of the world, free of rhetoric.</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="font-semibold text-stone-900 block">2. Observation:</span>
                <span className="text-stone-600 text-xs">What you notice or what symptoms cause confusion on the surface.</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
                <span className="font-semibold text-amber-950 block">3. Translation:</span>
                <span className="text-stone-700 text-xs">Bridging the unfamiliar dynamic to an everyday activity you have mastered.</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="font-semibold text-stone-900 block">4. Understanding:</span>
                <span className="text-stone-600 text-xs">The cognitive realization of why the system behaves the way it does.</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="font-semibold text-stone-900 block">5. Action:</span>
                <span className="text-stone-600 text-xs">Concrete, verifiable steps you can take to test, confirm, or utilize this insight.</span>
              </div>
            </div>
          </div>

          {/* Guardrails */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200/90 text-xs text-stone-600 space-y-1.5">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>Epistemic Integrity & Boundaries</span>
            </span>
            <p>
              • We never assume a similarity proves two systems are identical.
            </p>
            <p>
              • We explicitly identify what is established fact versus what is human interpretation.
            </p>
            <p>
              • No account required; basic use is free and private, storing history strictly in your browser.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 py-2 rounded-xl bg-stone-900 text-stone-50 text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
