import React, { useState } from 'react';
import { HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CalculatedRates, CampaignMetrics } from '../types/campaign';
import { INDUSTRY_BENCHMARKS } from '../utils/metrics';

interface KpiGridProps {
  metrics?: CampaignMetrics;
  rates: CalculatedRates;
}

interface KpiDef {
  key: string;
  name: string;
  value?: number;
  unit: string;
  industryAvg: number;
  explanation: string;
  formula: string;
  isInverse?: boolean; // Lower is better (e.g. bounce, unsubscribe)
}

export const KpiGrid: React.FC<KpiGridProps> = ({ metrics, rates }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const kpis: KpiDef[] = [
    {
      key: 'openRate',
      name: 'Open Rate',
      value: rates.openRate,
      unit: '%',
      industryAvg: INDUSTRY_BENCHMARKS.openRate,
      explanation: 'Percentage of delivered emails opened by recipients.',
      formula: 'Opens / Delivered × 100',
    },
    {
      key: 'ctr',
      name: 'Click-Through Rate',
      value: rates.ctr,
      unit: '%',
      industryAvg: INDUSTRY_BENCHMARKS.ctr,
      explanation: 'Percentage of delivered emails that registered at least one link click.',
      formula: 'Clicks / Delivered × 100',
    },
    {
      key: 'ctor',
      name: 'Click-to-Open Rate',
      value: rates.ctor,
      unit: '%',
      industryAvg: INDUSTRY_BENCHMARKS.ctor,
      explanation: 'Measures content effectiveness among subscribers who opened the email.',
      formula: 'Clicks / Opens × 100',
    },
    {
      key: 'conversionRate',
      name: 'Conversion Rate',
      value: rates.conversionRate,
      unit: '%',
      industryAvg: INDUSTRY_BENCHMARKS.conversionRate,
      explanation: 'Percentage of delivered recipients completing the desired action (e.g. purchase).',
      formula: 'Conversions / Delivered × 100',
    },
    {
      key: 'bounceRate',
      name: 'Bounce Rate',
      value: rates.bounceRate,
      unit: '%',
      industryAvg: INDUSTRY_BENCHMARKS.bounceRate,
      explanation: 'Percentage of sent emails that could not be delivered to recipient mailboxes.',
      formula: 'Bounces / Sent × 100',
      isInverse: true,
    },
    {
      key: 'unsubscribeRate',
      name: 'Unsubscribe Rate',
      value: rates.unsubscribeRate,
      unit: '%',
      industryAvg: INDUSTRY_BENCHMARKS.unsubscribeRate,
      explanation: 'Percentage of delivered recipients who opted out of future sends.',
      formula: 'Unsubscribes / Delivered × 100',
      isInverse: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpis.map((kpi) => {
        const hasData = kpi.value !== undefined && !isNaN(kpi.value);
        let diff = 0;
        let isPositive = false;
        let isNegative = false;

        if (hasData) {
          diff = Number((kpi.value! - kpi.industryAvg).toFixed(2));
          if (kpi.isInverse) {
            isPositive = diff < -0.1;
            isNegative = diff > 0.1;
          } else {
            isPositive = diff > 0.1;
            isNegative = diff < -0.1;
          }
        }

        return (
          <div
            key={kpi.key}
            className="relative flex flex-col justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
          >
            {/* Header: Label + Tooltip Trigger */}
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                {kpi.name}
              </span>
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveTooltip(kpi.key)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  onClick={() => setActiveTooltip(activeTooltip === kpi.key ? null : kpi.key)}
                  className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={`About ${kpi.name}`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>

                {activeTooltip === kpi.key && (
                  <div className="absolute right-0 top-6 z-50 w-56 p-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-lg shadow-xl text-[11px] leading-relaxed animate-in fade-in">
                    <p className="font-semibold mb-1 text-slate-200">{kpi.name}</p>
                    <p className="text-slate-300 mb-1.5">{kpi.explanation}</p>
                    <div className="pt-1 border-t border-slate-700 text-slate-400 font-mono text-[10px]">
                      Formula: {kpi.formula}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Metric Display with Tabular Figures */}
            <div className="my-1">
              {hasData ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                    {kpi.value!.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    {kpi.unit}
                  </span>
                </div>
              ) : (
                <div className="text-sm font-semibold text-slate-400 dark:text-slate-500 py-1 italic">
                  Not provided
                </div>
              )}
            </div>

            {/* Benchmark & Trend Footer */}
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
              {hasData ? (
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1 font-medium">
                    {isPositive ? (
                      <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 tabular-nums">
                        <TrendingUp className="w-3 h-3" />
                        {diff > 0 ? `+${diff}%` : `${diff}%`}
                      </span>
                    ) : isNegative ? (
                      <span className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400 tabular-nums">
                        <TrendingDown className="w-3 h-3" />
                        {diff > 0 ? `+${diff}%` : `${diff}%`}
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-slate-500 tabular-nums">
                        <Minus className="w-3 h-3" />
                        On avg
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                    Avg {kpi.industryAvg}%
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Supply send & delivery data
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
