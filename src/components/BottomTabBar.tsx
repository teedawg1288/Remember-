import React from 'react';
import { ScreenId } from '../types/translation';
import { MessageSquare, Eye, Bookmark, Sparkles } from 'lucide-react';

interface BottomTabBarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  hasActiveTranslation: boolean;
  savedCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentScreen,
  onSelectScreen,
  hasActiveTranslation,
  savedCount,
}) => {
  // Normalize screen to 3 primary areas
  const activeTab: 'talk' | 'visual' | 'discoveries' =
    currentScreen === 'talk' || currentScreen === 'discover'
      ? 'talk'
      : currentScreen === 'visual' ||
        currentScreen === 'understand' ||
        currentScreen === 'missing_engine' ||
        currentScreen === 'same_story' ||
        currentScreen === 'uncover' ||
        currentScreen === 'reality' ||
        currentScreen === 'move_forward'
      ? 'visual'
      : 'discoveries';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-400 select-none shadow-2xl"
      aria-label="Screen Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 items-center h-16 px-2">
        {/* Tab 1: Let's Talk */}
        <button
          onClick={() => onSelectScreen('talk')}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1 transition-all rounded-2xl relative ${
            activeTab === 'talk'
              ? 'text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 active:scale-95'
          }`}
          title="Let's Talk"
          aria-current={activeTab === 'talk' ? 'page' : undefined}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-xs tracking-tight mt-1 leading-none">Let&apos;s Talk</span>
          {activeTab === 'talk' && (
            <span className="absolute bottom-1 w-6 h-0.5 bg-teal-400 rounded-full" />
          )}
        </button>

        {/* Tab 2: Show Me */}
        <button
          onClick={() => onSelectScreen('visual')}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1 transition-all rounded-2xl relative ${
            activeTab === 'visual'
              ? 'text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 active:scale-95'
          }`}
          title="Show Me"
          aria-current={activeTab === 'visual' ? 'page' : undefined}
        >
          <div className="relative">
            <Eye className="w-5 h-5" />
            {hasActiveTranslation && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            )}
          </div>
          <span className="text-xs tracking-tight mt-1 leading-none">Show Me</span>
          {activeTab === 'visual' && (
            <span className="absolute bottom-1 w-6 h-0.5 bg-teal-400 rounded-full" />
          )}
        </button>

        {/* Tab 3: My Discoveries */}
        <button
          onClick={() => onSelectScreen('discoveries')}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1 transition-all rounded-2xl relative ${
            activeTab === 'discoveries'
              ? 'text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 active:scale-95'
          }`}
          title="My Discoveries"
          aria-current={activeTab === 'discoveries' ? 'page' : undefined}
        >
          <div className="relative">
            <Bookmark className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-teal-500 text-slate-950 font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-xs tracking-tight mt-1 leading-none">My Discoveries</span>
          {activeTab === 'discoveries' && (
            <span className="absolute bottom-1 w-6 h-0.5 bg-teal-400 rounded-full" />
          )}
        </button>
      </div>
    </nav>
  );
};
