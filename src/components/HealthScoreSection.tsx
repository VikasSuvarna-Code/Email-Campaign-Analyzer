import React, { useState } from 'react';
import { CampaignHealthScore, ScoreCategory } from '../types/campaign';
import { Info, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';

interface HealthScoreSectionProps {
  healthScore: CampaignHealthScore;
  onNavigateTab?: (tab: any) => void;
}

export const HealthScoreSection: React.FC<HealthScoreSectionProps> = ({
  healthScore,
  onNavigateTab,
}) => {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('subjectLine');

  const { overall, status, breakdown, summaryRationale } = healthScore;

  // Circular progress calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  // Determine color theme based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 65) return 'text-indigo-500 stroke-indigo-500';
    if (score >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
    if (score >= 65) return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
  };

  const categories: Array<{
    key: keyof typeof breakdown;
    name: string;
    targetTab: string;
  }> = [
    { key: 'subjectLine', name: 'Subject Line', targetTab: 'content' },
    { key: 'emailContent', name: 'Email Content', targetTab: 'content' },
    { key: 'ctaQuality', name: 'CTA Quality', targetTab: 'content' },
    { key: 'readability', name: 'Readability', targetTab: 'content' },
    { key: 'personalization', name: 'Personalization', targetTab: 'content' },
    { key: 'engagementSignals', name: 'Engagement Signals', targetTab: 'metrics' },
    { key: 'conversionPotential', name: 'Conversion Potential', targetTab: 'metrics' },
  ];

  const activeCategory = breakdown[selectedCategoryKey as keyof typeof breakdown] || breakdown.subjectLine;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 transition-colors">
      {/* Top Banner Disclaimer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">
            AI Campaign Health Assessment
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>AI-generated heuristic assessment · Not a guaranteed outcome</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Radial Chart & Overall Score */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`${getScoreColor(overall)} transition-all duration-1000 ease-out`}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Score in Center */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {overall}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${overall >= 80 ? 'bg-emerald-500' : overall >= 65 ? 'bg-indigo-500' : 'bg-amber-500'}`} />
              <span className="text-slate-800 dark:text-slate-200">{status} Health</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs line-clamp-2 mt-1">
              {summaryRationale}
            </p>
          </div>
        </div>

        {/* Right Column: 7 Category Pillars */}
        <div className="lg:col-span-8 space-y-3">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Score Breakdown by Category
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories.map(({ key, name }) => {
              const cat = breakdown[key];
              const isSelected = selectedCategoryKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategoryKey(key)}
                  className={`text-left p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700 shadow-xs ring-1 ring-indigo-400/30'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {name}
                    </span>
                    <span className={`font-mono text-xs font-bold tabular-nums px-1.5 py-0.5 rounded border ${getScoreBadge(cat.score)}`}>
                      {cat.score}
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.score >= 80 ? 'bg-emerald-500' : cat.score >= 65 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {cat.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Category Detail Card */}
          {activeCategory && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {categories.find(c => c.key === selectedCategoryKey)?.name} Diagnostic
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                  Click any category above to inspect
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {activeCategory.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
