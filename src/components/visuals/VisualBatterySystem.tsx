import React, { useState } from 'react';
import {
  BatteryCharging,
  Thermometer,
  Zap,
  Flame,
  Snowflake,
  ShieldAlert,
  Info,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const VisualBatterySystem: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(25); // Celsius: -10 to 55
  const [electricalLoad, setElectricalLoad] = useState<number>(50); // % load (0 to 100)
  const [stateOfCharge, setStateOfCharge] = useState<number>(65); // 0 to 100%
  const [isFastCharging, setIsFastCharging] = useState<boolean>(false);

  // Physical calculations based on real battery chemistry:
  // Cold causes viscous electrolyte -> high internal resistance (R)
  // Extreme heat causes accelerated SEI decomposition & parasitic reactions
  // Optimal temp is ~20°C - 30°C
  const tempFactor = temperature < 20
    ? (20 - temperature) * 1.8 // cold resistance penalty
    : temperature > 35
    ? (temperature - 35) * 1.5 // thermal degradation penalty
    : 0;

  const baseResistanceOhms = 0.05; // 50mOhm
  const internalResistance = baseResistanceOhms + (tempFactor * 0.004);

  // Measured voltage under load: V_cell = V_ocv - I * R
  const openCircuitVoltage = 3.2 + (stateOfCharge / 100) * 1.0; // 3.2V to 4.2V
  const currentDrawAmps = isFastCharging ? -15 : (electricalLoad / 100) * 10;
  const measuredTerminalVoltage = Math.max(
    2.5,
    Math.min(4.35, openCircuitVoltage - currentDrawAmps * internalResistance)
  );

  // Delivered efficiency vs heat generation: P_loss = I^2 * R
  const heatWattageLoss = Math.pow(currentDrawAmps, 2) * internalResistance;
  const effectiveDeliveredPower = isFastCharging
    ? -15 * measuredTerminalVoltage
    : Math.max(0, currentDrawAmps * measuredTerminalVoltage);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Working Interactive Physics Simulation</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-100 mt-0.5">
            Battery Performance: Temperature & Load Mechanics
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Manipulate temperature, electrical load, and fast charging to observe real-time ion velocity, resistance, and measured voltage.
          </p>
        </div>

        <button
          onClick={() => {
            setTemperature(25);
            setElectricalLoad(50);
            setStateOfCharge(65);
            setIsFastCharging(false);
          }}
          className="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Ambient</span>
        </button>
      </div>

      {/* Main Interactive Animated Battery SVG Chamber */}
      <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">State of Charge (SoC):</span>
            <span className="text-amber-400 font-bold text-sm">{stateOfCharge}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Terminal Voltage:</span>
            <span className="text-teal-400 font-bold text-sm">
              {measuredTerminalVoltage.toFixed(2)} V
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Heat Dissipation:</span>
            <span className={`font-bold text-sm ${heatWattageLoss > 8 ? 'text-rose-400' : 'text-slate-300'}`}>
              {heatWattageLoss.toFixed(1)} W
            </span>
          </div>
        </div>

        {/* Animated Battery Diagram */}
        <div className="w-full h-48 sm:h-56 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-2">
          <svg className="w-full h-full" viewBox="0 0 500 180">
            {/* Battery Cell Outer Casing */}
            <rect x="50" y="30" width="380" height="120" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
            <rect x="430" y="65" width="20" height="50" rx="4" fill="#64748b" /> {/* Cathode nub (+) */}

            {/* Anode (Graphite Lattice) on Left */}
            <rect x="60" y="40" width="70" height="100" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="95" y="95" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              ANODE (-)
            </text>
            <text x="95" y="110" fill="#7dd3fc" fontSize="8" textAnchor="middle">
              Graphite
            </text>

            {/* Separator / Porous Membrane in Middle */}
            <line x1="240" y1="40" x2="240" y2="140" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 4" />
            <text x="240" y="24" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              POROUS SEPARATOR
            </text>

            {/* Cathode (Metal Oxide) on Right */}
            <rect x="350" y="40" width="70" height="100" rx="6" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="385" y="95" fill="#fecdd3" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              CATHODE (+)
            </text>
            <text x="385" y="110" fill="#fda4af" fontSize="8" textAnchor="middle">
              Cobalt / LFP
            </text>

            {/* Electrolyte Fluid Background showing Temperature Impact */}
            <rect
              x="135"
              y="40"
              width="210"
              height="100"
              fill={temperature > 35 ? '#7f1d1d' : temperature < 10 ? '#0c4a6e' : '#042f2e'}
              opacity="0.35"
            />

            {/* Animated Lithium Ions Moving Across Electrolyte */}
            {/* If fast charging: ions rush Left (Cathode -> Anode). If discharging: ions rush Right (Anode -> Cathode) */}
            <g>
              {[50, 75, 100, 125].map((yPos, i) => (
                <g key={i}>
                  <circle
                    r="5"
                    fill={isFastCharging ? '#fbbf24' : '#2dd4bf'}
                  >
                    <animateMotion
                      path={
                        isFastCharging
                          ? `M 340 ${yPos} L 140 ${yPos}`
                          : `M 140 ${yPos} L 340 ${yPos}`
                      }
                      dur={`${Math.max(0.6, 3.5 - (temperature > 20 ? 1 : 0) - (electricalLoad / 50))}s`}
                      repeatCount="indefinite"
                      begin={`${i * 0.3}s`}
                    />
                  </circle>
                  <text
                    x={isFastCharging ? 280 - i * 30 : 160 + i * 30}
                    y={yPos + 3}
                    fill="#ffffff"
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Li+
                  </text>
                </g>
              ))}
            </g>

            {/* Visual Temperature Vapor Indicator */}
            {temperature > 38 && (
              <g className="animate-pulse">
                <text x="240" y="80" fill="#f87171" fontSize="11" fontWeight="bold" textAnchor="middle">
                  THERMAL STRESS: HIGH FRICTION
                </text>
              </g>
            )}
            {temperature < 5 && (
              <g className="animate-pulse">
                <text x="240" y="80" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                  VISCOUS ELECTROLYTE: IONS SLOWED
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Interactive Sliders and Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Temperature Slider */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              {temperature > 30 ? (
                <Flame className="w-4 h-4 text-rose-400" />
              ) : temperature < 15 ? (
                <Snowflake className="w-4 h-4 text-sky-400" />
              ) : (
                <Thermometer className="w-4 h-4 text-emerald-400" />
              )}
              Ambient Temperature
            </span>
            <span className={`font-mono font-bold ${temperature > 35 ? 'text-rose-400' : temperature < 10 ? 'text-sky-400' : 'text-emerald-400'}`}>
              {temperature}°C ({Math.round(temperature * 1.8 + 32)}°F)
            </span>
          </div>

          <input
            type="range"
            min="-10"
            max="55"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />

          <p className="text-[11px] text-slate-400">
            {temperature < 10
              ? 'Cold electrolyte thickens into molasses; voltage drops sharply under load.'
              : temperature > 38
              ? 'Excess heat accelerates irreversible chemical degradation and crystal breakdown.'
              : 'Ideal operating zone: ions flow smoothly with minimal internal friction.'}
          </p>
        </div>

        {/* Electrical Load Slider */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Electrical Load
            </span>
            <span className="font-mono font-bold text-amber-400">
              {isFastCharging ? 'Charging' : `${electricalLoad}%`}
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="100"
            disabled={isFastCharging}
            value={electricalLoad}
            onChange={(e) => setElectricalLoad(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer disabled:opacity-40"
          />

          <p className="text-[11px] text-slate-400">
            {electricalLoad > 75
              ? 'Heavy drain (e.g. 3D games) pulls massive amperage, causing immediate voltage sag.'
              : 'Moderate drain keeps internal thermal loss low.'}
          </p>
        </div>

        {/* Fast Charging Mode Toggle */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <BatteryCharging className="w-4 h-4 text-teal-400" />
                Charger Injected
              </span>
              <span className="font-mono text-[11px] font-bold text-teal-300">
                {isFastCharging ? 'Fast Charge 65W' : 'Discharge Mode'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              High-amperage pumping rams ions back into the graphite shelves at high velocity.
            </p>
          </div>

          <button
            onClick={() => setIsFastCharging(!isFastCharging)}
            className={`w-full py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
              isFastCharging
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-850 hover:bg-slate-800 text-teal-300 border border-teal-500/30'
            }`}
          >
            {isFastCharging ? 'Disconnect Fast Charger' : 'Plug In Fast Charger ⚡'}
          </button>
        </div>
      </div>

      {/* Explanatory Takeaway Card & Clear Simulation Identification */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-teal-400 font-bold">
            <Info className="w-3.5 h-3.5" />
            <span>Physical Mental Model</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-md font-semibold">
            Simulated Behavior · Illustrative Model
          </span>
        </div>
        <p className="leading-relaxed">
          Electricity is not magic juice; it is discrete physical particles squeezing through atomic lattices. 
          When you demand maximum power in freezing weather, ions cannot rush through the viscous electrolyte, 
          leading to false &ldquo;0% battery&rdquo; shutdowns even though stored energy is physically present.
        </p>
      </div>
    </div>
  );
};
