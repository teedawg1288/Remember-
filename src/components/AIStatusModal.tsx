import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Cpu, RefreshCw, Zap, Shield, ArrowRight } from 'lucide-react';
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
    setVerificationResult(null);
    try {
      const res = await fetch('/api/verify-openai', { method: 'POST' });
      const data = await res.json();
      setVerificationResult(data);
      fetchStatus();
    } catch (err: any) {
      setVerificationResult({
        success: false,
        message: err?.message || 'Network request failed',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">AI Engine & Connection</h3>
              <p className="text-xs text-slate-400">OpenAI & Gemini Multi-Provider System</p>
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

        {/* Live Verification Box */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase font-bold text-slate-400">
                  Live OpenAI Verification
                </span>
                {isVerifying && <RefreshCw className="w-3.5 h-3.5 text-teal-400 animate-spin" />}
              </div>
              <button
                type="button"
                onClick={runLiveTest}
                disabled={isVerifying}
                className="text-[11px] font-semibold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Test Again</span>
              </button>
            </div>

            {verificationResult ? (
              <div
                className={`p-3 rounded-xl border text-xs space-y-2 ${
                  verificationResult.success
                    ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                    : verificationResult.isQuotaIssue
                    ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                    : 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {verificationResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-medium leading-relaxed">{verificationResult.message}</p>
                    {verificationResult.latencyMs && (
                      <p className="text-[11px] font-mono text-slate-400">
                        Model: {verificationResult.model || 'gpt-4o-mini'} &bull; Latency: {verificationResult.latencyMs}ms
                      </p>
                    )}
                  </div>
                </div>

                {verificationResult.isQuotaIssue && (
                  <div className="pt-2 border-t border-amber-900/30 text-[11px] text-amber-300/90 leading-relaxed">
                    <strong>Seamless Fallback:</strong> The app is automatically using Google Gemini so your conversation and visual exploration work without interruption. Once credits are added to your OpenAI account, requests will automatically utilize OpenAI!
                  </div>
                )}
              </div>
            ) : isVerifying ? (
              <div className="py-4 text-center text-xs text-slate-400 font-mono">
                Pinging OpenAI gpt-4o-mini endpoint...
              </div>
            ) : null}
          </div>

          {/* Connected Providers Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* OpenAI Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-teal-400" />
                  OpenAI
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-teal-300 border border-teal-500/30">
                  Primary
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Model: <span className="font-mono text-slate-200">gpt-4o-mini</span></p>
              <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                Requests: {status?.usage.openAiRequests || 0} &bull; Tokens: {status?.usage.openAiTokens || 0}
              </div>
            </div>

            {/* Gemini Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  Gemini
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-sky-300 border border-sky-500/30">
                  Fallback
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Model: <span className="font-mono text-slate-200">gemini-3.1-flash-lite</span></p>
              <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                Requests: {status?.usage.geminiRequests || 0} &bull; Fallbacks: {status?.usage.fallbackActivations || 0}
              </div>
            </div>
          </div>

          {/* Cost Control & Safeguards Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5 text-slate-300">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-[11px] font-mono uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>Cost Controls & Safeguards</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              <li>18-second strict timeout prevents hanging requests.</li>
              <li>Sliding 30 requests/min rate limit protects against runaway billing.</li>
              <li>Keys are read securely from server environment and never exposed to client.</li>
              <li>Deep cross-domain investigations require explicit user approval.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
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
