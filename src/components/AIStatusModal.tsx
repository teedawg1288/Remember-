import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Cpu, RefreshCw, Zap, Shield, HelpCircle } from 'lucide-react';
import { AIProviderStatus } from '../types/translation';

interface AIStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIStatusModal: React.FC<AIStatusModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<AIProviderStatus | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/provider-status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // ignore
    }
  };

  const runLiveTest = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/verify-providers', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setVerificationResult(data);
      }
      fetchStatus();
    } catch (err: any) {
      setVerificationResult({
        error: err?.message || 'Network test failed',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      runLiveTest();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const openAiTest = verificationResult?.openai;
  const geminiTest = verificationResult?.gemini;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">AI Engine Routing & Health</h3>
              <p className="text-xs text-slate-400">Independent OpenAI & Gemini Verification</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Test Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase font-bold text-slate-300">
              Real-Time Model Health Check
            </span>
            {isVerifying && <RefreshCw className="w-3.5 h-3.5 text-teal-400 animate-spin" />}
          </div>
          <button
            type="button"
            onClick={runLiveTest}
            disabled={isVerifying}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 disabled:opacity-50"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Test Now</span>
          </button>
        </div>

        {/* Independent Provider Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
          {/* OpenAI Independent Status */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                OpenAI (gpt-4o-mini)
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                  openAiTest?.success
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : openAiTest?.creditsAvailable === false
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {openAiTest?.success
                  ? 'Operational'
                  : openAiTest?.creditsAvailable === false
                  ? 'Credits Exhausted (429)'
                  : openAiTest?.configured === false
                  ? 'Not Configured'
                  : 'Error'}
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Key Configured:</span>
                <span className={status?.openAiConfigured ? 'text-emerald-400' : 'text-slate-500'}>
                  {status?.openAiConfigured ? 'Yes (Server Secret)' : 'No'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Key Authenticated:</span>
                <span className={openAiTest?.keyValid ? 'text-emerald-400' : 'text-rose-400'}>
                  {openAiTest?.keyValid ? 'Valid Key' : 'Invalid / Missing'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Available Credits:</span>
                <span
                  className={
                    openAiTest?.creditsAvailable
                      ? 'text-emerald-400'
                      : openAiTest?.creditsAvailable === false
                      ? 'text-amber-400'
                      : 'text-slate-500'
                  }
                >
                  {openAiTest?.creditsAvailable ? 'Active Balance' : 'Exhausted (429)'}
                </span>
              </div>
              {openAiTest?.latencyMs && (
                <div className="flex justify-between text-slate-400">
                  <span>Latency:</span>
                  <span className="text-teal-300">{openAiTest.latencyMs}ms</span>
                </div>
              )}
            </div>

            {openAiTest?.message && !openAiTest.success && (
              <p className="text-[10px] text-amber-300/90 leading-tight bg-amber-950/30 p-2 rounded-lg border border-amber-900/30">
                {openAiTest.message}
              </p>
            )}
          </div>

          {/* Gemini Independent Status */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                Gemini (gemini-3.5-flash-lite)
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                  geminiTest?.success
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {geminiTest?.success ? 'Operational' : 'Unavailable'}
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Key Configured:</span>
                <span className={status?.geminiConfigured ? 'text-emerald-400' : 'text-slate-500'}>
                  {status?.geminiConfigured ? 'Yes (AI Studio Env)' : 'No'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Key Authenticated:</span>
                <span className={geminiTest?.keyValid !== false ? 'text-emerald-400' : 'text-rose-400'}>
                  {geminiTest?.keyValid !== false ? 'Valid Key' : 'Invalid Key'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Available Quota:</span>
                <span className={geminiTest?.creditsAvailable !== false ? 'text-emerald-400' : 'text-amber-400'}>
                  {geminiTest?.creditsAvailable !== false ? 'Available' : 'Rate Limited'}
                </span>
              </div>
              {geminiTest?.latencyMs && (
                <div className="flex justify-between text-slate-400">
                  <span>Latency:</span>
                  <span className="text-sky-300">{geminiTest.latencyMs}ms</span>
                </div>
              )}
            </div>

            {geminiTest?.message && (
              <p
                className={`text-[10px] leading-tight p-2 rounded-lg border ${
                  geminiTest.success
                    ? 'bg-emerald-950/30 text-emerald-300 border-emerald-900/30'
                    : 'bg-rose-950/30 text-rose-300 border-rose-900/30'
                }`}
              >
                {geminiTest.message}
              </p>
            )}
          </div>
        </div>

        {/* Fallback Architecture Notice */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 text-slate-300 mb-4">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-[11px] font-mono uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Deterministic Math Engine & Fallback Guarantee</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            The app uses genuine independent routing. If OpenAI has no credits remaining (HTTP 429), the app automatically runs Google Gemini. If network connections or quotas are unavailable, the built-in deterministic mathematical calculation engine executes genuine analytical formulas without disruption.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
