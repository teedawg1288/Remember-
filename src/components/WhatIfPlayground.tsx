import React, { useState } from 'react';
import { PlayCircle, Shuffle, Sparkles, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { WhatIfScenario } from '../types/sameStory';
import { sound } from '../audio/soundEngine';

interface WhatIfPlaygroundProps {
  scenarios: WhatIfScenario[];
  currentDilemma: string;
}

export const WhatIfPlayground: React.FC<WhatIfPlaygroundProps> = ({
  scenarios,
  currentDilemma,
}) => {
  const [activeScenarioList, setActiveScenarioList] = useState<WhatIfScenario[]>(scenarios);
  const [selectedScenario, setSelectedScenario] = useState<WhatIfScenario>(scenarios[0]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (scenario: WhatIfScenario) => {
    setSelectedScenario(scenario);
    sound.playNodeChime(490);
  };

  const handleCustomSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || isSimulating) return;

    setIsSimulating(true);
    setError(null);
    sound.playNodeChime(520);
    try {
      const res = await fetch('/api/same-story/simulate-what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentDilemma, whatIfQuestion: customQuestion.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.scenario) throw new Error(data.error || 'What-if exploration unavailable.');
      if (data.success && data.scenario) {
        setActiveScenarioList((prev) => [data.scenario, ...prev]);
        setSelectedScenario(data.scenario);
        setCustomQuestion('');
        sound.playDiscoveryChime();
      }
    } catch (err: any) {
      console.warn('Scenario exploration failed:', err);
      setError(err?.message || 'Could not explore that scenario.');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="bg-[#141822] rounded-3xl border border-amber-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2">
          <PlayCircle className="w-3.5 h-3.5" />
          <span>What-If &bull; Hypothetical Scenarios</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-white">
          Explore What Might Happen
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
          Change one condition and consider possible consequences. These are hypotheses, not results from a validated simulation.
        </p>
      </div>

      {/* Preset What-If Scenarios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {activeScenarioList.slice(0, 3).map((scen, idx) => (
          <button
            key={scen.id || idx}
            onClick={() => handleSelect(scen)}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedScenario.id === scen.id
                ? 'bg-amber-600/20 border-amber-500 shadow-md shadow-amber-950/30 text-amber-100'
                : 'bg-[#10131b] border-lounge-border/70 hover:border-stone-500 text-stone-300'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                Scenario #{idx + 1}
              </span>
              <p className="text-xs font-serif font-semibold leading-snug mb-2">
                "{scen.question}"
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">
              Var: {scen.variableChanged}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Scenario Simulation Output */}
      <div className="bg-[#0e1119] rounded-2xl border border-amber-500/40 p-5 sm:p-7 mb-6 shadow-lg">
        <div className="mb-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
            Active Counterfactual Question:
          </span>
          <h4 className="font-serif text-lg sm:text-xl font-bold text-white">
            "{selectedScenario.question}"
          </h4>
          <span className="text-xs text-stone-400 font-mono">
            Variable Shift: <strong className="text-cyan-300">{selectedScenario.variableChanged}</strong>
          </span>
        </div>

        {/* The Simulated Outcome */}
        <div className="bg-[#161a25] rounded-xl p-4 sm:p-5 border border-emerald-500/30 text-stone-100 text-sm sm:text-base leading-relaxed mb-4 font-sans">
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold block mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Possible Consequences (Not Tested):
          </span>
          {selectedScenario.simulatedOutcome}
        </div>

        {/* Historical or Scientific Basis */}
        <div className="bg-[#10131b] rounded-xl p-3.5 border border-lounge-border/60 text-xs text-stone-300 font-mono">
          <span className="text-stone-400 font-bold">Suggested Comparison (Check Source): </span>
          {selectedScenario.historicalOrScientificBasis}
        </div>
      </div>

      {error && <p role="alert" className="text-rose-300 text-sm mb-3">{error}</p>}
      {/* Ask Your Own "What If..." Box */}
      <form onSubmit={handleCustomSimulate} className="bg-[#10131b] rounded-2xl p-4 border border-lounge-border flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder='Try: "What if the salon owner stopped fixing everybody’s mistakes?" or "What if we changed the room instead of the person?"'
          className="flex-1 bg-[#0b0e14] border border-lounge-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
          disabled={isSimulating}
        />
        <button
          type="submit"
          disabled={isSimulating || !customQuestion.trim()}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
              <span>Exploring...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Explore What-If</span>
              <Send className="w-3.5 h-3.5 text-stone-950" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
