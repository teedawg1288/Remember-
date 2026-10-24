import React, { useState } from 'react';
import {
  History,
  Hourglass,
  Sparkles,
  Compass,
  Eye,
  Scroll,
  Layers,
  Palette,
  Wind,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { EraProjection, EraUnderstandingResult } from '../types/sameStory';
import { buildErasForDilemma } from '../data/eraBuilder';
import { sound } from '../audio/soundEngine';

interface InteractiveDimensionSliderProps {
  currentDilemma: string;
  underneathMechanism?: string;
  eras?: EraProjection[];
}

export const InteractiveDimensionSlider: React.FC<InteractiveDimensionSliderProps> = ({
  currentDilemma,
  underneathMechanism = '',
  eras,
}) => {
  // Compute dynamic eras tailored to current dilemma if not passed from server
  const activeEras: EraProjection[] =
    eras && eras.length === 5
      ? eras
      : buildErasForDilemma(currentDilemma, currentDilemma, underneathMechanism);

  const [activeEraIndex, setActiveEraIndex] = useState(3); // Default to Present Day (index 3)
  const [viewMode, setViewMode] = useState<'visual' | 'anatomy'>('visual');
  const [lifeStage, setLifeStage] = useState<EraUnderstandingResult['lifeStage']>('starting_out');
  const [eraTranslations, setEraTranslations] = useState<Record<string, EraUnderstandingResult>>({});
  const [translating, setTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const currentEra = activeEras[activeEraIndex] || activeEras[3];
  const translationKey = currentDilemma + '|' + currentEra.id + '|' + lifeStage;
  const translation = eraTranslations[translationKey];
  const lifeStages: { id: EraUnderstandingResult['lifeStage']; label: string }[] = [
    { id: 'starting_out', label: 'Starting Out' },
    { id: 'heavy_lifting', label: 'Carrying Responsibility' },
    { id: 'looking_back', label: 'Looking Back' },
  ];

  const translateEra = async () => {
    const key = translationKey;
    setTranslating(true);
    setTranslationError(null);
    try {
      const res = await fetch('/api/same-story/era-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentDilemma, eraId: currentEra.id, lifeStage }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.translation) {
        throw new Error(data.error || 'Era translation unavailable.');
      }
      setEraTranslations((prev) => ({ ...prev, [key]: data.translation as EraUnderstandingResult }));
    } catch (err: any) {
      setTranslationError(err?.message || 'Could not translate this era right now.');
    } finally {
      setTranslating(false);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setActiveEraIndex(val);
    sound.playNodeChime(350 + val * 65);
  };

  const handleSelectEra = (index: number) => {
    setActiveEraIndex(index);
    sound.playNodeChime(350 + index * 65);
  };

  return (
    <div className="bg-[#12151e] rounded-3xl border border-lounge-border/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background ambient aura */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{
          backgroundColor: currentEra.visualAtmosphere?.colorPalette?.[1] || '#d97706',
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-lounge-border/60 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2">
            <Hourglass className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Time Continuum &bull; 3,400-Year Perspective</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Through The Eras: Your Story Across Millennia
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
            Explore fictional versions of a problem across eras. Then compare how age, experience, available knowledge, words and tools could change its meaning. Similar outcomes do not prove identical causes.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-[#0d1017] p-1 rounded-xl border border-lounge-border/70 self-start sm:self-auto shrink-0">
          <button
            onClick={() => {
              setViewMode('visual');
              sound.playNodeChime(480);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'visual'
                ? 'bg-amber-600 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Cinematic Scene</span>
          </button>
          <button
            onClick={() => {
              setViewMode('anatomy');
              sound.playNodeChime(520);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'anatomy'
                ? 'bg-amber-600 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>Era Anatomy</span>
          </button>
        </div>
      </div>

      {/* Interactive Range Timeline Slider */}
      <div className="space-y-4 pt-2 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono text-stone-400">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <History className="w-4 h-4" />
            Active Era:
          </span>
          <span className="text-stone-200 font-bold bg-[#181d2a] px-3 py-1 rounded-lg border border-amber-500/30">
            {currentEra.label}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max={activeEras.length - 1}
          step="1"
          value={activeEraIndex}
          onChange={handleSliderChange}
          className="w-full h-3 bg-[#181d2a] rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all border border-lounge-border"
        />

        {/* Era Step Selector Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {activeEras.map((era, i) => {
            const isSelected = activeEraIndex === i;
            return (
              <button
                key={era.id}
                onClick={() => handleSelectEra(i)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-600/20 border-amber-500/60 shadow-lg shadow-amber-950/40 text-amber-200'
                    : 'bg-[#151924] border-lounge-border/60 hover:border-stone-600 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-400">
                    {era.year}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                </div>
                <span className="text-xs font-serif font-bold text-white truncate block">
                  {era.label.split('(')[0].trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Three clocks: period, lived experience and information available at the time */}
      <div className="relative z-10 rounded-2xl border border-cyan-500/30 bg-[#0d1822] p-4 sm:p-5 space-y-4">
        <div className="space-y-1">
          <h4 className="font-serif text-xl text-white">Three Clocks Translator</h4>
          <p className="text-xs text-stone-300">
            Period: {currentEra.year} · Choose a stage of life separately. A stage is not a fixed age or ability.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {lifeStages.map((stage) => (
            <button key={stage.id} type="button" onClick={() => { setLifeStage(stage.id); setTranslationError(null); }}
              className={'rounded-lg px-3 py-2 text-xs font-medium border transition-colors ' +
                (lifeStage === stage.id
                  ? 'bg-cyan-600/25 border-cyan-400 text-cyan-100'
                  : 'bg-[#151924] border-stone-700 text-stone-300')}>
              {stage.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" disabled={translating} onClick={translateEra}
            className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-stone-950 disabled:opacity-50">
            {translating ? 'Translating era…' : translation ? 'Recheck this era' : 'Translate this era'}
          </button>
          <span className="text-[11px] text-stone-400">
            Uses one AI request when tapped. Reconstruction, not verified historical testimony.
          </span>
        </div>
        {translationError && <p role="alert" className="text-xs text-rose-300">{translationError}</p>}
        {translation && (
          <div className="space-y-4 pt-3 border-t border-cyan-500/20">
            <div className="grid gap-3 md:grid-cols-2">
              <article className="rounded-xl border border-stone-700 bg-[#121a27] p-4 space-y-2">
                <p className="text-xs font-semibold text-cyan-300">Characters, masks and words</p>
                <p className="text-sm text-stone-200">{translation.charactersAndRoleMasks}</p>
                <p className="text-sm text-white"><span className="text-amber-300">A possible phrase then: </span>{translation.termOrPhraseThen}</p>
                <p className="text-sm text-stone-200"><span className="text-cyan-300">Possible meaning then: </span>{translation.meaningThen}</p>
                <p className="text-sm text-stone-200"><span className="text-cyan-300">Meaning today: </span>{translation.whatTheWordMeansToday}</p>
              </article>
              <article className="rounded-xl border border-stone-700 bg-[#121a27] p-4 space-y-2">
                <p className="text-xs font-semibold text-cyan-300">Tools, knowledge and accepted norms</p>
                <p className="text-sm text-stone-200"><span className="text-amber-300">Possible tools and options: </span>{translation.toolsAndOptions}</p>
                <p className="text-sm text-stone-200"><span className="text-amber-300">Potentially known then: </span>{translation.reasonablyKnownThen}</p>
                <p className="text-sm text-stone-200"><span className="text-amber-300">Unknown or unverified: </span>{translation.uncertainOrUnknowableThen}</p>
                <p className="text-sm text-stone-200"><span className="text-amber-300">Social expectations and exceptions: </span>{translation.socialNormsAndExceptions}</p>
              </article>
            </div>
            <div className="rounded-xl border border-amber-500/25 bg-amber-950/15 p-4 space-y-2">
              <p className="text-xs font-semibold text-amber-300">Life stage × era: what might be understood?</p>
              <p className="text-sm text-stone-200">{translation.interpretationAtThatLifeStage}</p>
              <p className="text-sm text-stone-200"><span className="text-amber-300">Inherited rule: </span>{translation.inheritedRule}</p>
              <p className="text-sm text-stone-200"><span className="text-emerald-300">What may still transfer: </span>{translation.whatStillTransfers}</p>
              <p className="text-sm text-stone-200"><span className="text-rose-300">What might be outdated: </span>{translation.whatMayBeOutdated}</p>
              <p className="text-sm text-white"><span className="text-cyan-300">A choice suited to the present: </span>{translation.presentDayChoice}</p>
              <p className="text-[11px] text-stone-400 border-t border-stone-700 pt-2">{translation.evidenceNote}</p>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: CINEMATIC VISUAL SCENE */}
      {viewMode === 'visual' && (
        <div className="space-y-6 animate-fade-in relative z-10">
          {/* Visual Scene Canvas */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-black">
            {/* SVG Visual Composition per Era */}
            <div className="w-full h-72 sm:h-96 relative flex items-center justify-center overflow-hidden">
              {currentEra.visualAtmosphere?.sceneSvgType === 'bronze_age' && (
                <svg
                  viewBox="0 0 960 480"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <linearGradient id="bronzeSky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#451a03" />
                      <stop offset="40%" stopColor="#9a3412" />
                      <stop offset="75%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#fef08a" />
                    </linearGradient>
                    <radialGradient id="sunGlow" cx="0.5" cy="0.4" r="0.5">
                      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="stoneWall" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#292524" />
                      <stop offset="100%" stopColor="#1c1917" />
                    </linearGradient>
                  </defs>
                  {/* Sky & Sun */}
                  <rect width="960" height="480" fill="url(#bronzeSky)" />
                  <circle cx="480" cy="220" r="140" fill="url(#sunGlow)" />
                  {/* Distant Aegean Hills */}
                  <path d="M0 320 Q240 260 480 300 T960 280 L960 480 L0 480 Z" fill="#78350f" opacity="0.6" />
                  <path d="M0 350 Q300 310 600 340 T960 330 L960 480 L0 480 Z" fill="#451a03" opacity="0.8" />
                  {/* Mycenaean Stone Ground */}
                  <rect y="380" width="960" height="100" fill="url(#stoneWall)" />
                  {/* Cyclopean Gateway & Pillars */}
                  <rect x="80" y="140" width="90" height="250" fill="#1c1917" />
                  <rect x="230" y="140" width="90" height="250" fill="#1c1917" />
                  <rect x="50" y="100" width="300" height="45" fill="#292524" rx="4" />
                  {/* Right Colonnade */}
                  <rect x="740" y="160" width="70" height="230" fill="#1c1917" />
                  <rect x="850" y="160" width="70" height="230" fill="#1c1917" />
                  <rect x="720" y="120" width="220" height="40" fill="#292524" />
                  {/* Amphora Jars */}
                  <ellipse cx="370" cy="370" rx="20" ry="28" fill="#92400e" />
                  <ellipse cx="370" cy="342" rx="8" ry="4" fill="#78350f" />
                  <ellipse cx="400" cy="375" rx="16" ry="22" fill="#78350f" />
                  {/* Silhouette Figure 1: Walking away */}
                  <circle cx="340" cy="290" r="14" fill="#0c0a09" />
                  <path d="M325 304 L355 304 L360 380 L320 380 Z" fill="#0c0a09" />
                  {/* Silhouette Figure 2: Looking back with arm raised in doubt */}
                  <circle cx="580" cy="285" r="14" fill="#0c0a09" />
                  <path d="M565 300 L595 300 L600 380 L560 380 Z" fill="#0c0a09" />
                  <line x1="565" y1="310" x2="540" y2="330" stroke="#0c0a09" strokeWidth="6" strokeLinecap="round" />
                  {/* Dust and light beams */}
                  <polygon points="480,220 200,480 350,480" fill="#fde68a" opacity="0.12" />
                  <polygon points="480,220 600,480 750,480" fill="#fde68a" opacity="0.12" />
                </svg>
              )}

              {currentEra.visualAtmosphere?.sceneSvgType === 'classical_athens' && (
                <svg
                  viewBox="0 0 960 480"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <linearGradient id="athensSky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e3a8a" />
                      <stop offset="60%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#bae6fd" />
                    </linearGradient>
                    <linearGradient id="marbleColumn" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="50%" stopColor="#e2e8f0" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>
                  </defs>
                  {/* Aegean Azure Sky */}
                  <rect width="960" height="480" fill="url(#athensSky)" />
                  {/* Sun glare */}
                  <circle cx="700" cy="100" r="120" fill="#ffffff" opacity="0.4" />
                  {/* Agora Marble Floor */}
                  <rect y="360" width="960" height="120" fill="#e2e8f0" />
                  <line x1="0" y1="360" x2="960" y2="360" stroke="#94a3b8" strokeWidth="3" />
                  {/* Colonnade of the Stoa */}
                  {[60, 180, 300, 420, 540, 660, 780, 900].map((x, idx) => (
                    <g key={idx}>
                      <rect x={x - 22} y="80" width="44" height="280" fill="url(#marbleColumn)" />
                      <rect x={x - 28} y="60" width="56" height="20" fill="#f8fafc" rx="2" />
                      <rect x={x - 28} y="350" width="56" height="15" fill="#cbd5e1" rx="2" />
                    </g>
                  ))}
                  {/* Entablature roof */}
                  <rect x="0" y="30" width="960" height="35" fill="#f1f5f9" />
                  <polygon points="0,30 480,0 960,30" fill="#e2e8f0" />
                  {/* Olive branch shadow framing */}
                  <path d="M0 0 Q150 80 300 40 Q200 120 50 140 Z" fill="#064e3b" opacity="0.8" />
                  <circle cx="120" cy="70" r="5" fill="#14532d" />
                  <circle cx="180" cy="55" r="5" fill="#14532d" />
                  {/* Athenian Citizen 1 in himation draped over shoulder */}
                  <circle cx="260" cy="260" r="14" fill="#0f172a" />
                  <path d="M245 274 L275 274 L280 365 L240 365 Z" fill="#1e293b" />
                  <path d="M245 285 Q260 330 278 300" stroke="#f8fafc" strokeWidth="4" fill="none" opacity="0.8" />
                  {/* Athenian Citizen 2 walking past on the right */}
                  <circle cx="620" cy="260" r="14" fill="#0f172a" />
                  <path d="M605 274 L635 274 L640 365 L600 365 Z" fill="#0f172a" />
                  <path d="M605 285 Q620 330 638 300" stroke="#f8fafc" strokeWidth="4" fill="none" opacity="0.8" />
                </svg>
              )}

              {currentEra.visualAtmosphere?.sceneSvgType === 'industrial_dawn' && (
                <svg
                  viewBox="0 0 960 480"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <linearGradient id="gaslitWall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1c1917" />
                      <stop offset="70%" stopColor="#292524" />
                      <stop offset="100%" stopColor="#0c0a09" />
                    </linearGradient>
                    <radialGradient id="lampHalo" cx="0.5" cy="0.5" r="0.5">
                      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                      <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.6" />
                      <stop offset="80%" stopColor="#78350f" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* Dark Victorian Interior & Street */}
                  <rect width="960" height="480" fill="url(#gaslitWall)" />
                  {/* Gas Lanterns on Left and Right */}
                  <circle cx="220" cy="160" r="160" fill="url(#lampHalo)" />
                  <circle cx="740" cy="160" r="160" fill="url(#lampHalo)" />
                  {/* Ornate Gilt Mirror in Center */}
                  <rect x="400" y="80" width="160" height="220" fill="#1c1917" stroke="#d97706" strokeWidth="6" rx="8" />
                  <ellipse cx="480" cy="190" rx="70" ry="100" fill="#292524" />
                  <polygon points="430,100 530,100 500,160 450,160" fill="#fef08a" opacity="0.15" />
                  {/* Rain Mist Window Arches */}
                  <rect x="60" y="60" width="100" height="200" fill="#1e293b" opacity="0.6" rx="40" />
                  <rect x="800" y="60" width="100" height="200" fill="#1e293b" opacity="0.6" rx="40" />
                  {/* Wet Cobblestone Floor */}
                  <rect y="360" width="960" height="120" fill="#0c0a09" />
                  <ellipse cx="320" cy="410" rx="80" ry="15" fill="#d97706" opacity="0.2" />
                  <ellipse cx="640" cy="410" rx="80" ry="15" fill="#d97706" opacity="0.2" />
                  {/* Gentleman 1: Top hat, frock coat, cane */}
                  <ellipse cx="320" cy="215" rx="14" ry="4" fill="#000000" />
                  <rect x="312" y="195" width="16" height="20" fill="#000000" />
                  <circle cx="320" cy="230" r="12" fill="#000000" />
                  <path d="M305 242 L335 242 L340 375 L300 375 Z" fill="#0a0a0a" />
                  <line x1="340" y1="270" x2="350" y2="375" stroke="#78350f" strokeWidth="4" />
                  {/* Gentleman 2: Walking past in cravat and overcoat */}
                  <ellipse cx="640" cy="215" rx="14" ry="4" fill="#000000" />
                  <rect x="632" y="195" width="16" height="20" fill="#000000" />
                  <circle cx="640" cy="230" r="12" fill="#000000" />
                  <path d="M625 242 L655 242 L660 375 L620 375 Z" fill="#0a0a0a" />
                </svg>
              )}

              {currentEra.visualAtmosphere?.sceneSvgType === 'digital_present' && (
                <svg
                  viewBox="0 0 960 480"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <linearGradient id="modernTwilight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#020617" />
                      <stop offset="50%" stopColor="#0f172a" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                    <linearGradient id="phoneGlow" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                  {/* Twilight Glass Atrium */}
                  <rect width="960" height="480" fill="url(#modernTwilight)" />
                  {/* City Skyline through window grid */}
                  <rect x="180" y="140" width="60" height="180" fill="#090d16" />
                  <rect x="250" y="90" width="80" height="230" fill="#0c121e" />
                  <rect x="620" y="110" width="90" height="210" fill="#090d16" />
                  <rect x="720" y="160" width="70" height="160" fill="#0c121e" />
                  {/* Distant Window Lights */}
                  {[100, 150, 200, 260, 280, 640, 670, 740].map((x, i) => (
                    <rect key={i} x={x} y={150 + (i % 4) * 30} width="6" height="8" fill="#fde047" opacity="0.7" />
                  ))}
                  {/* Modern Glass Balustrade & Polished Floor */}
                  <rect y="320" width="960" height="160" fill="#090d16" />
                  <line x1="0" y1="320" x2="960" y2="320" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />
                  {/* Modern Downlight Cones */}
                  <polygon points="300,0 220,320 380,320" fill="#38bdf8" opacity="0.08" />
                  <polygon points="660,0 580,320 740,320" fill="#38bdf8" opacity="0.08" />
                  {/* Figure 1: In hoodie, looking down at phone screen glow */}
                  <circle cx="320" cy="210" r="13" fill="#020617" />
                  <path d="M305 224 L335 224 L340 375 L300 375 Z" fill="#020617" />
                  <rect x="330" y="260" width="10" height="16" fill="url(#phoneGlow)" rx="2" />
                  <circle cx="335" cy="268" r="16" fill="#38bdf8" opacity="0.3" />
                  {/* Figure 2: Headphones on, fast pace walking past */}
                  <circle cx="640" cy="210" r="13" fill="#020617" />
                  <path d="M625 224 L655 224 L660 375 L620 375 Z" fill="#020617" />
                  <path d="M632 202 Q640 196 648 202" stroke="#38bdf8" strokeWidth="3" fill="none" />
                </svg>
              )}

              {currentEra.visualAtmosphere?.sceneSvgType === 'orbital_colony' && (
                <svg
                  viewBox="0 0 960 480"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <radialGradient id="earthGlow" cx="0.5" cy="0.9" r="0.6">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                      <stop offset="40%" stopColor="#0284c7" stopOpacity="0.5" />
                      <stop offset="80%" stopColor="#0369a1" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="titaniumRib" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="50%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>
                  {/* Cosmic Deep Space */}
                  <rect width="960" height="480" fill="#020617" />
                  {/* Distant Stars */}
                  {[
                    [50, 40], [120, 90], [210, 30], [310, 110], [420, 60],
                    [530, 80], [640, 40], [750, 100], [860, 50], [920, 120],
                    [80, 200], [240, 180], [720, 220], [880, 210]
                  ].map(([x, y], idx) => (
                    <circle key={idx} cx={x} cy={y} r={idx % 2 === 0 ? 1.5 : 1} fill="#ffffff" opacity={0.8} />
                  ))}
                  {/* Glowing Crescent of Earth Below */}
                  <circle cx="480" cy="550" r="320" fill="url(#earthGlow)" />
                  <path d="M160 550 Q480 340 800 550 Z" fill="#0284c7" opacity="0.6" />
                  {/* Orbital Titanium Panoramic Cupola Arches */}
                  <path d="M0 80 Q480 0 960 80 L960 120 Q480 40 0 120 Z" fill="url(#titaniumRib)" />
                  <line x1="240" y1="50" x2="240" y2="400" stroke="#334155" strokeWidth="12" />
                  <line x1="480" y1="20" x2="480" y2="400" stroke="#334155" strokeWidth="16" />
                  <line x1="720" y1="50" x2="720" y2="400" stroke="#334155" strokeWidth="12" />
                  {/* Deck Floor */}
                  <rect y="380" width="960" height="100" fill="#090d16" />
                  <line x1="0" y1="380" x2="960" y2="380" stroke="#06b6d4" strokeWidth="3" opacity="0.7" />
                  {/* Holographic Cyan HUD Rings */}
                  <circle cx="340" cy="220" r="22" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.8" />
                  <circle cx="620" cy="220" r="22" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.8" />
                  {/* Astronaut 1 in EVA Suit */}
                  <circle cx="340" cy="265" r="14" fill="#0f172a" />
                  <rect x="333" y="260" width="14" height="9" fill="#06b6d4" rx="2" />
                  <path d="M320 280 L360 280 L365 385 L315 385 Z" fill="#0f172a" />
                  {/* Astronaut 2 passing in opposite direction */}
                  <circle cx="620" cy="265" r="14" fill="#0f172a" />
                  <rect x="613" y="260" width="14" height="9" fill="#06b6d4" rx="2" />
                  <path d="M600 280 L640 280 L645 385 L595 385 Z" fill="#0f172a" />
                </svg>
              )}

              {/* Cinematic Vignette Overlay and Scene Stamp */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Floating Period Quote */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 pointer-events-none">
                <div className="bg-[#0b0e14]/85 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl max-w-2xl">
                  <p className="font-serif italic text-xs sm:text-sm text-stone-100 leading-relaxed">
                    {currentEra.quote}
                  </p>
                  <span className="text-[10px] font-mono uppercase text-amber-400 mt-1 block font-bold">
                    &bull; Fictional illustration · {currentEra.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Atmosphere & Sensory Palette Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Color Palette & Art Style */}
            <div className="bg-[#151924] border border-lounge-border/70 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" /> Art Style & Palette:
              </span>
              <h4 className="font-serif text-sm font-bold text-white">
                {currentEra.visualAtmosphere?.artStyle || 'Historical Realism'}
              </h4>
              <div className="flex items-center gap-2 pt-1">
                {currentEra.visualAtmosphere?.colorPalette?.map((color, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div
                      className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[9px] font-mono text-stone-400">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lighting Atmosphere */}
            <div className="bg-[#151924] border border-lounge-border/70 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Atmospheric Lighting:
              </span>
              <p className="text-xs text-stone-200 leading-relaxed">
                {currentEra.visualAtmosphere?.lighting}
              </p>
              <p className="text-[11px] text-stone-400 font-mono italic">
                {currentEra.visualAtmosphere?.sceneryDetail}
              </p>
            </div>

            {/* Sensory & Immersion */}
            <div className="bg-[#151924] border border-lounge-border/70 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5" /> What They Heard & Felt:
              </span>
              <p className="text-xs text-stone-200 leading-relaxed">
                {currentEra.visualAtmosphere?.sensoryDetail}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ERA ANATOMY & COMPARISON */}
      {viewMode === 'anatomy' && (
        <div className="bg-[#171b26] rounded-2xl border border-amber-500/30 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-lg animate-fade-in relative z-10">
          {/* Setting & Tech */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Setting & Daily Gear:
            </span>
            <h4 className="font-serif text-lg font-bold text-white">{currentEra.setting}</h4>
            <div className="space-y-1 text-xs text-stone-300">
              <p>
                <strong className="text-stone-400 font-mono text-[11px]">Tech of the day: </strong>
                {currentEra.technology}
              </p>
              <p>
                <strong className="text-stone-400 font-mono text-[11px]">What they wore: </strong>
                {currentEra.costume}
              </p>
            </div>
          </div>

          {/* How The Dilemma Looked in This Era */}
          <div className="space-y-2 md:col-span-2 bg-[#11141c] p-4 rounded-xl border border-lounge-border/70">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Fictional Version of the Dilemma:
            </span>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
              "{currentEra.howTheDilemmaAppeared}"
            </p>
            <div className="pt-2 border-t border-lounge-border/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-rose-950/20 p-2.5 rounded-lg border border-rose-500/20 text-rose-200">
                <span className="font-bold block text-[10px] uppercase font-mono text-rose-400 mb-0.5">
                  What They Assumed:
                </span>
                {currentEra.whatTheyAssumed}
              </div>
              <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-200">
                <span className="font-bold block text-[10px] uppercase font-mono text-emerald-400 mb-0.5">
                  Possible Unseen Cause (fictional):
                </span>
                {currentEra.whatActuallyHappened}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The Core Truth Banner */}
      <div className="bg-[#0e111a] rounded-2xl p-4 sm:p-5 border border-lounge-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-300 relative z-10">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-white">Possible Recurring Structure: </strong>
            Roles, words and tools change across periods. A similar reaction may reflect a comparable process, but its actual cause must be checked in each era.
          </span>
        </div>
        <div className="text-[11px] font-mono text-amber-400/90 shrink-0">
          Question: Same mechanism or only similar outcome?
        </div>
      </div>
    </div>
  );
};
