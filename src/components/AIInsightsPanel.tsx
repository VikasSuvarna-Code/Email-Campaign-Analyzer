import React from 'react';
import { AIInsights } from '../types/campaign';
import { CheckCircle2, AlertTriangle, Lightbulb, ShieldAlert, Sparkles } from 'lucide-react';

interface AIInsightsPanelProps {
  insights: AIInsights;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights }) => {
  const { strengths, weaknesses, opportunities, risks } = insights;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            AI Campaign Strategic Insights
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evidence-based observations distinguishing user metrics from model assessments
          </p>
        </div>
        <span className="text-[11px] text-slate-400">
          Synthesized from copy & metric signals
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/80 dark:border-emerald-900/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Observed Strengths ({strengths.length})
          </div>
          <div className="space-y-3">
            {strengths.map((item, idx) => (
              <div key={idx} className="text-xs space-y-1">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {item.detail}
                </p>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono bg-emerald-100/60 dark:bg-emerald-900/40 p-1.5 rounded">
                  Evidence: {item.evidence}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/80 dark:border-amber-900/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Friction & Weaknesses ({weaknesses.length})
          </div>
          <div className="space-y-3">
            {weaknesses.map((item, idx) => (
              <div key={idx} className="text-xs space-y-1">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {item.detail}
                </p>
                <div className="text-[10px] text-amber-700 dark:text-amber-400 font-mono bg-amber-100/60 dark:bg-amber-900/40 p-1.5 rounded">
                  Evidence: {item.evidence}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200/80 dark:border-indigo-900/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            High-Impact Opportunities ({opportunities.length})
          </div>
          <div className="space-y-3">
            {opportunities.map((item, idx) => (
              <div key={idx} className="text-xs space-y-1">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {item.detail}
                </p>
                <div className="text-[10px] text-indigo-700 dark:text-indigo-400 font-mono bg-indigo-100/60 dark:bg-indigo-900/40 p-1.5 rounded">
                  Evidence: {item.evidence}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risks */}
        <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200/80 dark:border-rose-900/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            Deliverability & Reputational Risks ({risks.length})
          </div>
          <div className="space-y-3">
            {risks.map((item, idx) => (
              <div key={idx} className="text-xs space-y-1">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {item.detail}
                </p>
                <div className="text-[10px] text-rose-700 dark:text-rose-400 font-mono bg-rose-100/60 dark:bg-rose-900/40 p-1.5 rounded">
                  Evidence: {item.evidence}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
