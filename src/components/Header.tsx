import React, { useState } from 'react';
import { ScreenId } from '../types/translation';
import { RotateCcw, User, LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  onStartOver: () => void;
  onOpenHowItWorks: () => void;
  onOpenAuth: () => void;
  hasActiveTranslation: boolean;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectScreen,
  onStartOver,
  onOpenHowItWorks,
  onOpenAuth,
}) => {
  const { user, signOutUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Brand Wordmark (Tap to start fresh or return to Let's Talk) */}
        <button
          onClick={() => onSelectScreen('talk')}
          className="text-left group flex items-center gap-2.5 shrink-0 focus-visible:outline-teal-400"
          title="The Last 10% — Return to conversation"
        >
          <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-serif text-lg font-bold shadow-xs">
            10
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg sm:text-xl text-white tracking-tight leading-none group-hover:text-teal-300 transition-colors">
              THE LAST 10%
            </span>
            <span className="text-[10px] text-slate-400 font-sans truncate">
              Understand what you don&apos;t know through what you do
            </span>
          </div>
        </button>

        {/* Clean Controls: New Conversation, Purpose Info, User Account */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* New / Reset Conversation */}
          <button
            onClick={onStartOver}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
            title="Start fresh conversation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">New</span>
          </button>

          {/* How It Works Modal trigger */}
          <button
            onClick={onOpenHowItWorks}
            className="p-2 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 rounded-xl transition-colors flex items-center gap-1.5"
            title="How The Last 10% works"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline text-slate-300">How it works</span>
          </button>

          {/* User Account / Sign In */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-teal-400 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                  {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="max-w-[90px] truncate hidden md:inline">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-1.5 z-50 text-xs animate-fadeIn text-slate-200">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="font-semibold text-white truncate">
                      {user.displayName || 'Signed In'}
                    </p>
                    <p className="text-slate-400 truncate text-[11px]">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      signOutUser();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
