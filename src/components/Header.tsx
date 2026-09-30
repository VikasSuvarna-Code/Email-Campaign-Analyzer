import React, { useState } from 'react';
import { Mail, Plus, Sun, Moon, ChevronDown, Check, Sparkles, AlertCircle } from 'lucide-react';
import { FullCampaignAnalysis } from '../types/campaign';

interface HeaderProps {
  currentCampaign: FullCampaignAnalysis;
  campaignList: Array<{ id: string; name: string; isDemo?: boolean }>;
  onSelectCampaign: (id: string) => void;
  onOpenNewAnalysis: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCampaign,
  campaignList,
  onSelectCampaign,
  onOpenNewAnalysis,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white shadow-sm">
          <Mail className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              MailLens AI
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 dark:text-slate-500">·</span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500 dark:text-slate-400">
              Email Campaign Analyzer
            </span>
          </div>
          <span className="hidden md:inline-block text-[11px] text-slate-400 dark:text-slate-500">
            Turn every email campaign into actionable insight
          </span>
        </div>
      </div>

      {/* Center Zone: Active Campaign Selector */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors max-w-[200px] sm:max-w-xs truncate"
          aria-expanded={dropdownOpen}
          aria-label="Select Campaign"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="truncate">{currentCampaign.campaignName}</span>
          {currentCampaign.isDemo && (
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider shrink-0">
              (Demo)
            </span>
          )}
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-1.5 text-xs animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Active Campaigns
              </div>
              {campaignList.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCampaign(c.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors ${
                    c.id === currentCampaign.id
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/50 dark:bg-indigo-950/20'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="truncate">{c.name}</span>
                    {c.isDemo && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        Demo
                      </span>
                    )}
                  </div>
                  {c.id === currentCampaign.id && (
                    <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  )}
                </button>
              ))}
              <div className="border-t border-slate-100 dark:border-slate-700/80 my-1" />
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenNewAnalysis();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Analyze New Campaign
              </button>
            </div>
          </>
        )}
      </div>

      {/* Action Zone: New Analysis + Dark/Light toggle + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenNewAnalysis}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Analysis</span>
          <span className="sm:hidden">New</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle Theme"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 focus:outline-none ring-offset-2 focus:ring-2 focus:ring-indigo-500 rounded-full"
            aria-label="User menu"
          >
            <img
              src="/src/assets/images/avatar_marketing_lead_1790747452432.jpg"
              alt="Elena Vance"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              onError={(e) => {
                // Fallback if image fails to render
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }}
            />
            <div className="hidden w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 items-center justify-center text-xs font-bold">
              EV
            </div>
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 p-3 text-xs animate-in fade-in">
                <div className="font-semibold text-slate-900 dark:text-white">
                  Elena Vance
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                  elena@luminagear.com
                </div>
                <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                  Role: Lead Growth Analyst
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700 my-2" />
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Gemini 3.8 Flash Connected
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
