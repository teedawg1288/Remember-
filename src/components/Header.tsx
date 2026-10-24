import React, { useState } from 'react';
import {
  Scissors,
  Wine,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  ChevronDown,
  MessageSquare,
  Eye,
  Bookmark,
} from 'lucide-react';
import { sound } from '../audio/soundEngine';

export type BrandNameOption = 'ARCHETYPE' | 'PARALLEL' | 'ECHOS' | 'SYNAPSE' | 'REMEMBER';
export type MainTabOption = 'talk' | 'show' | 'discoveries';

interface HeaderProps {
  appName: BrandNameOption;
  onAppNameChange: (name: BrandNameOption) => void;
  activeMainTab: MainTabOption;
  onMainTabChange: (tab: MainTabOption) => void;
  persona: 'barber' | 'bartender';
  onPersonaChange: (p: 'barber' | 'bartender') => void;
  onReset: () => void;
  showResearchLab: boolean;
  onToggleResearchLab: () => void;
  hasActiveStory: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  appName,
  onAppNameChange,
  activeMainTab,
  onMainTabChange,
  persona,
  onPersonaChange,
  onReset,
  showResearchLab,
  onToggleResearchLab,
  hasActiveStory,
}) => {
  const [showNameMenu, setShowNameMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  const brandOptions: { name: BrandNameOption; subtitle: string; tag: string }[] = [
    { name: 'REMEMBER', subtitle: 'The Living Rosetta Stone', tag: 'Core Vision' },
    { name: 'PARALLEL', subtitle: 'Same Story, Different Characters', tag: 'Cinematic' },
    { name: 'ARCHETYPE', subtitle: 'The Universal Pattern Engine', tag: 'Alternative' },
    { name: 'ECHOS', subtitle: 'What History Figured Out First', tag: 'Historical' },
    { name: 'SYNAPSE', subtitle: 'Cross-Disciplinary Bridge', tag: 'Scientific' },
  ];

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playNodeChime(600);
    }
  };

  const handleSelectName = (name: BrandNameOption) => {
    onAppNameChange(name);
    setShowNameMenu(false);
    sound.playDiscoveryChime();
  };

  const currentBrand = brandOptions.find((b) => b.name === appName) || brandOptions[0];

  return (
    <header className="border-b border-lounge-border/70 bg-[#0f1117]/95 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand identity with interactive name switcher */}
        <div className="relative">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div
              onClick={onReset}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-lg shadow-amber-900/30 border border-amber-500/40 cursor-pointer hover:scale-105 transition-transform shrink-0"
            >
              {persona === 'barber' ? (
                <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100" />
              ) : (
                <Wine className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setShowNameMenu(!showNameMenu)}
                  className="group flex items-center gap-1 font-serif text-lg sm:text-2xl font-black tracking-tight text-white hover:text-amber-300 transition-colors cursor-pointer"
                  title="Choose your preferred name"
                >
                  <span>{currentBrand.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-400 transition-colors" />
                </button>

                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold hidden sm:inline">
                  Pattern Intelligence
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-medium hidden md:block">
                {currentBrand.subtitle}
              </p>
            </div>
          </div>

          {/* Name Selection Dropdown Menu */}
          {showNameMenu && (
            <div className="absolute top-12 left-0 z-50 w-72 bg-[#141822] border border-amber-500/40 rounded-2xl shadow-2xl p-2.5 animate-fade-in backdrop-blur-xl">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold border-b border-lounge-border/60 mb-1 flex items-center justify-between">
                <span>Select Brand Identity:</span>
                <span className="text-stone-400">Live</span>
              </div>
              <div className="space-y-1">
                {brandOptions.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => handleSelectName(opt.name)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      appName === opt.name
                        ? 'bg-amber-600/25 border border-amber-500/40 text-amber-200'
                        : 'hover:bg-[#1c212f] text-stone-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-serif font-bold text-sm flex items-center gap-2">
                        <span>{opt.name}</span>
                        {appName === opt.name && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400 block">{opt.subtitle}</span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#10131a] text-stone-300 border border-lounge-border/40">
                      {opt.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: The Three Core Pillars (Requirement 3) */}
        <div className="flex items-center bg-[#131620] p-1 rounded-2xl border border-lounge-border/80 shadow-inner">
          <button
            onClick={() => {
              onMainTabChange('talk');
              sound.playNodeChime(420);
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'talk'
                ? 'bg-amber-600 text-stone-950 shadow-md shadow-amber-950/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>LET'S TALK</span>
          </button>

          <button
            onClick={() => {
              onMainTabChange('show');
              sound.playNodeChime(480);
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'show'
                ? 'bg-amber-600 text-stone-950 shadow-md shadow-amber-950/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>SHOW ME</span>
          </button>

          <button
            onClick={() => {
              onMainTabChange('discoveries');
              sound.playNodeChime(540);
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'discoveries'
                ? 'bg-amber-600 text-stone-950 shadow-md shadow-amber-950/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MY DISCOVERIES</span>
            <span className="sm:hidden">VAULT</span>
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Audio Synthesizer toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              !isMuted
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-[#181c25] text-stone-400 border-lounge-border hover:text-stone-200'
            }`}
            title={isMuted ? 'Enable 3D sound feedback' : 'Mute 3D sound effects'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Persona selector: Barber vs Bartender */}
          <div className="hidden lg:flex items-center bg-[#181c25] p-1 rounded-xl border border-lounge-border text-xs font-medium">
            <button
              onClick={() => {
                onPersonaChange('barber');
                sound.playNodeChime(420);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                persona === 'barber'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Barbershop: lively, sharp, street-smart"
            >
              <Scissors className="w-3 h-3" />
              <span>Barbershop</span>
            </button>
            <button
              onClick={() => {
                onPersonaChange('bartender');
                sound.playNodeChime(360);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                persona === 'bartender'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Bartender: observant, candid, late-night"
            >
              <Wine className="w-3 h-3" />
              <span>Bartender</span>
            </button>
          </div>

          {/* Research Lab toggle */}
          {hasActiveStory && (
            <button
              onClick={() => {
                onToggleResearchLab();
                sound.playNodeChime(showResearchLab ? 320 : 560);
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                showResearchLab
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#181c25] text-stone-300 border-lounge-border hover:border-stone-500'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Lab</span>
            </button>
          )}

          {/* New Story reset button */}
          <button
            onClick={() => {
              onReset();
              sound.playNodeChime(440);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-all shadow-md shadow-amber-600/25 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-950" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>
    </header>
  );
};
