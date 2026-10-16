import React, { useState, useRef, useEffect } from 'react';
import {
  TranslationResult,
  MystiqueDomain,
  ChatMessage,
} from '../../types/translation';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { PredictionChart } from '../visuals/PredictionChart';
import {
  Sparkles,
  ArrowRight,
  Mic,
  MicOff,
  Eye,
  Bookmark,
  Check,
  Send,
  Loader2,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

interface LetsTalkScreenProps {
  onSendMessage: (query: string, domain?: string) => Promise<void>;
  onFollowUp: (question: string) => Promise<void>;
  onNavigateToShowMe: () => void;
  onSaveDiscovery: () => void;
  isSaved: boolean;
  isLoading: boolean;
  activeTranslation: TranslationResult | null;
  chatHistory: ChatMessage[];
  mystiqueDomain: MystiqueDomain;
  onChangeMystiqueDomain: (domain: MystiqueDomain) => void;
}

const QUICK_PROMPTS = [
  'Why do two people remember the same argument completely differently?',
  'Why do I act like a different person around my boss than around my friends?',
  'Why is it so hard to change an old habit even when I really want to?',
  'Why does the same problem keep happening after we fix it?',
  'Why does our pipeline stall even when sales feel busy? (Business Traffic Jam)',
  'Why does fatigue or pain flare up only on stressful days? (Health Warning Light)',
  'Why do my partner and I keep having the exact same fight? (Appliance Filter)',
  'Why does history seem to repeat itself with different characters?',
];

const REFRAME_OPTIONS: Array<{ id: MystiqueDomain; label: string; icon: string }> = [
  { id: 'everyday', label: 'Everyday life', icon: '💡' },
  { id: 'driving', label: 'Cars', icon: '🚗' },
  { id: 'cooking', label: 'Cooking', icon: '🍳' },
  { id: 'relationships', label: 'Family & Friends', icon: '👥' },
  { id: 'work', label: 'Work & Bosses', icon: '💼' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'fixing', label: 'Fixing & Plumbing', icon: '🔧' },
];

export const LetsTalkScreen: React.FC<LetsTalkScreenProps> = ({
  onSendMessage,
  onFollowUp,
  onNavigateToShowMe,
  onSaveDiscovery,
  isSaved,
  isLoading,
  activeTranslation,
  chatHistory,
  mystiqueDomain,
  onChangeMystiqueDomain,
}) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const voice = useVoiceInput((finalText) => {
    setInput((prev) => (prev ? `${prev} ${finalText}` : finalText));
  });

  const handleToggleVoice = () => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const query = input.trim();
    setInput('');

    if (activeTranslation) {
      onFollowUp(query);
    } else {
      onSendMessage(query, mystiqueDomain === 'everyday' ? undefined : mystiqueDomain);
    }
  };

  const handlePromptClick = (p: string) => {
    onSendMessage(p, mystiqueDomain === 'everyday' ? undefined : mystiqueDomain);
  };

  // Scroll to bottom when conversation grows
  useEffect(() => {
    if (chatHistory.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isLoading]);

  return (
    <div className="flex flex-col max-w-2xl mx-auto w-full min-h-[calc(100vh-140px)] pb-36 px-1">
      {/* CASE 1: EMPTY STATE — Clean, inviting starting point */}
      {!activeTranslation && chatHistory.length === 0 && (
        <div className="my-auto py-8 text-center space-y-6 animate-fadeIn px-2">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-mono tracking-wider">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>THE LAST 10%</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              What&apos;s on your mind?
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Ask anything, tell a story, or throw out a random thought. We&apos;ll explore it through things you already know.
            </p>
          </div>

          {/* Quick inspiration prompts */}
          <div className="space-y-2 pt-2 text-left max-w-xl mx-auto">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
              Popular everyday questions to start:
            </div>
            <div className="grid grid-cols-1 gap-2">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePromptClick(p)}
                  className="p-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-left text-xs sm:text-sm text-slate-200 hover:text-white transition-all flex items-start gap-3 group shadow-xs active:scale-[0.99]"
                >
                  <span className="text-teal-400 mt-0.5 group-hover:translate-x-0.5 transition-transform">
                    &rarr;
                  </span>
                  <span className="leading-snug">{p}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CASE 2: ACTIVE CONVERSATION THREAD */}
      {(activeTranslation || chatHistory.length > 0) && (
        <div className="space-y-6 pt-2 pb-6 flex-1 animate-fadeIn">
          {/* Main Inquiry Card — Natural Human Flow */}
          {activeTranslation && (
            <div className="bg-slate-850/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
              {/* Question Header */}
              <div className="border-b border-slate-800/80 pb-3 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider font-semibold block">
                    {activeTranslation.predictionTestResult ? 'Verified Prediction & Computational Test' : 'Investigation & Translation'}
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5 leading-snug">
                    {activeTranslation.unfamiliarTopic}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onSaveDiscovery}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all shrink-0 ${
                    isSaved
                      ? 'bg-teal-950 text-teal-300 border-teal-800'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                  }`}
                  title={isSaved ? 'Saved to My Discoveries' : 'Save to My Discoveries'}
                >
                  {isSaved ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {/* Verified Prediction Visual Chart (if predictive test was executed) */}
              {activeTranslation.predictionTestResult && (
                <div className="pt-1">
                  <PredictionChart prediction={activeTranslation.predictionTestResult} />
                </div>
              )}

              {/* Conversational Narrative */}
              <div className="space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed">
                {/* 1. Core headline in plain language */}
                <p className="font-medium text-white text-base sm:text-lg">
                  {activeTranslation.headlineSummary}
                </p>

                {/* 2. Empirical Analysis / Relatable Explanation */}
                {activeTranslation.predictionTestResult ? (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-teal-900/40 text-slate-200 text-sm sm:text-base leading-relaxed">
                    <span className="text-teal-400 font-semibold block text-xs font-mono uppercase mb-1.5">
                      Empirical Findings & Predictive Behavior:
                    </span>
                    <p className="text-slate-300">
                      {activeTranslation.section1Connects.narrative ||
                        activeTranslation.frameworkFlow.translation}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 text-sm sm:text-base leading-relaxed">
                    <span className="text-teal-400 font-semibold block text-xs font-mono uppercase mb-1">
                      {activeTranslation.familiarDomain ? `Understanding (${activeTranslation.familiarDomain}):` : 'Key Perspective:'}
                    </span>
                    <p className="text-slate-300">
                      {activeTranslation.section1Connects.narrative ||
                        activeTranslation.frameworkFlow.translation}
                    </p>
                  </div>
                )}

                {/* 3. Crucial difference / Model boundaries */}
                {activeTranslation.section2Differences.breakdowns &&
                  activeTranslation.section2Differences.breakdowns.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1">
                      <span className="text-rose-400 font-semibold block text-xs">
                        {activeTranslation.predictionTestResult ? 'Model Boundary Conditions & Physical Limits:' : 'Where the comparison stops:'}
                      </span>
                      <p>{activeTranslation.section2Differences.breakdowns[0].whereItFails}</p>
                    </div>
                  )}

                {/* 4. Missing Question / What Remains Uncertain */}
                {activeTranslation.section3Missing.missingInformation &&
                  activeTranslation.section3Missing.missingInformation.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1">
                      <span className="text-teal-400 font-semibold block text-xs">
                        {activeTranslation.predictionTestResult ? 'What Remains Uncertain & Missing for Real-World Lab Validation:' : 'Hang on, what are we missing here?'}
                      </span>
                      <p>{activeTranslation.section3Missing.missingInformation[0]}</p>
                    </div>
                  )}

                {/* 5. What you could do */}
                {activeTranslation.section4NextSteps.practicalSteps &&
                  activeTranslation.section4NextSteps.practicalSteps.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-teal-950/20 border border-teal-900/30 text-xs sm:text-sm text-teal-100 space-y-1">
                      <span className="text-teal-400 font-semibold block text-xs">
                        So what could you do?
                      </span>
                      <p>{activeTranslation.section4NextSteps.practicalSteps[0]}</p>
                    </div>
                  )}

                {/* 6. WHAT HAPPENS NEXT? (Prediction & Possibilities) */}
                {activeTranslation.predictions && activeTranslation.predictions.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-sky-800/50 text-xs sm:text-sm text-slate-200 space-y-3.5 shadow-md">
                    <div className="flex items-center justify-between border-b border-sky-900/40 pb-2">
                      <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                        <span>What happens next? (Testable Prediction)</span>
                      </div>
                      <span className="text-[10px] bg-sky-950 px-2.5 py-0.5 rounded-full text-sky-300 border border-sky-800 font-mono">
                        {activeTranslation.predictions[0].likelihood.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-mono text-sky-300 uppercase tracking-wider font-bold block">
                        Here&apos;s what I think could happen:
                      </span>
                      <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                        {activeTranslation.predictions[0].scenario}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
                      <span className="text-slate-400 font-bold block font-mono text-[11px] uppercase">
                        Here&apos;s why:
                      </span>
                      <p className="text-slate-200 leading-relaxed">
                        {activeTranslation.predictions[0].likelihoodExplanation}
                      </p>
                    </div>

                    {activeTranslation.predictions[0].whatCouldChangeIt && (
                      <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-900/40 text-xs space-y-1 text-teal-100">
                        <span className="text-teal-400 font-bold block font-mono text-[11px] uppercase">
                          Here&apos;s what could change it:
                        </span>
                        <p className="leading-relaxed">
                          {activeTranslation.predictions[0].whatCouldChangeIt}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-slate-300 font-bold block font-mono text-[11px] uppercase">
                          Here&apos;s how we&apos;d find out:
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {activeTranslation.predictions[0].verificationTest.howWeFindOut}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                        <span className="text-rose-400 font-bold block font-mono text-[11px] uppercase">
                          What would prove this wrong:
                        </span>
                        <p className="text-rose-200/90 text-[11px] leading-relaxed">
                          {activeTranslation.predictions[0].verificationTest.falsificationSign}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. WHAT HAVEN'T WE THOUGHT OF? (Cross-Field Discoveries) */}
                {activeTranslation.crossFieldDiscoveries && activeTranslation.crossFieldDiscoveries.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 text-xs sm:text-sm text-indigo-100 space-y-3 shadow-md">
                    <div className="flex items-center justify-between border-b border-indigo-900/40 pb-2">
                      <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider font-mono">
                        <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                        <span>What haven&apos;t we thought of? (Cross-Field Connection)</span>
                      </div>
                      <span className="text-[10px] bg-indigo-950/90 px-2 py-0.5 rounded-full text-indigo-200 border border-indigo-800/60 font-mono">
                        {activeTranslation.crossFieldDiscoveries[0].domain}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider font-bold block mb-0.5">
                        Where else have we seen something like this?
                      </span>
                      <h4 className="font-semibold text-white text-sm sm:text-base leading-snug">
                        {activeTranslation.crossFieldDiscoveries[0].title}
                      </h4>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        {activeTranslation.crossFieldDiscoveries[0].whatHappensThere}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-900/40 text-xs text-indigo-100 space-y-1">
                      <strong className="text-indigo-300 font-mono uppercase text-[11px] block">
                        Shared Underlying Mechanism:
                      </strong>
                      <p className="leading-relaxed">
                        {activeTranslation.crossFieldDiscoveries[0].whyItMattersHere}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-400 italic bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 flex items-start gap-2">
                      <span className="text-amber-400 not-italic font-bold">Caution:</span>
                      <span>{activeTranslation.crossFieldDiscoveries[0].untestedCaution}</span>
                    </div>
                  </div>
                )}

                {/* 8. SEPARATING FACTS FROM GUESSES */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Separating Facts from Guesses:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                      <span className="text-teal-400 font-bold block mb-0.5 font-mono">
                        &bull; Known to be True (Verified Fact):
                      </span>
                      <p className="text-slate-200">
                        {activeTranslation.section3Missing.establishedFacts[0] || 'Physical limits and verified occurrences.'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                      <span className="text-amber-400 font-bold block mb-0.5 font-mono">
                        &bull; Completely Unknown (Needs Evidence):
                      </span>
                      <p className="text-slate-200">
                        {activeTranslation.section3Missing.missingInformation[0] || 'Unresolved variables where speculation must pause.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar: Show Me & Mystique Reframe */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onNavigateToShowMe}
                  className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-500/20 active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  <span>Show Me (Visual Trajectory & Map)</span>
                </button>

                {/* Mystique Quick Reframe Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-400">
                  <span className="text-[11px] text-slate-500 shrink-0">Try another angle:</span>
                  {REFRAME_OPTIONS.slice(1, 5).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => onChangeMystiqueDomain(r.id)}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all whitespace-nowrap"
                    >
                      {r.icon} {r.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat History Messages */}
          {chatHistory.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex gap-3 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-4 rounded-3xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal-500 text-slate-950 font-semibold rounded-br-xs shadow-md'
                    : 'bg-slate-850 text-slate-100 border border-slate-800 rounded-bl-xs shadow-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 p-3 text-xs text-slate-400 bg-slate-850 rounded-2xl max-w-xs animate-pulse border border-slate-800">
              <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
              <span>Thinking about what connects...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      )}

      {/* FIXED CONVERSATIONAL INPUT BAR (Responsive, Mobile-First) */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                activeTranslation
                  ? 'Ask a question, throw out a thought, or tell a story...'
                  : "Type what's on your mind... an argument, work puzzle, or curiosity."
              }
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/60 rounded-2xl px-4 py-3 pr-10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
            />
            {voice.isSupported && (
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`absolute right-2 top-2.5 p-1.5 rounded-xl transition-all ${
                  voice.isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={voice.isListening ? 'Stop voice listening' : 'Speak using microphone'}
              >
                {voice.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 sm:px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md shadow-teal-500/20 active:scale-95"
            title="Send"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
