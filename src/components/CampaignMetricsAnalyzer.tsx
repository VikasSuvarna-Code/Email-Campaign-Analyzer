import React from 'react';
import { CampaignMetrics, CalculatedRates } from '../types/campaign';
import { getMetricBenchmarks, formatNumber } from '../utils/metrics';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface CampaignMetricsAnalyzerProps {
  metrics?: CampaignMetrics;
  rates: CalculatedRates;
  onOpenInput?: () => void;
}

export const CampaignMetricsAnalyzer: React.FC<CampaignMetricsAnalyzerProps> = ({
  metrics,
  rates,
  onOpenInput,
}) => {
  if (!metrics || metrics.sent === undefined || metrics.delivered === undefined) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center space-y-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Performance Metrics Provided Yet
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Enter your campaign numbers (sent, opens, clicks, conversions) or upload a CSV to see full funnel analytics, benchmark comparisons, and CTOR diagnostics.
        </p>
        <button
          onClick={onOpenInput}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
        >
          Add Campaign Metrics
        </button>
      </div>
    );
  }

  const benchmarks = getMetricBenchmarks(rates);

  // Conversion Funnel Stages
  const sent = metrics.sent || 0;
  const delivered = metrics.delivered || 0;
  const opens = metrics.opens || 0;
  const clicks = metrics.clicks || 0;
  const conversions = metrics.conversions || 0;

  const funnelStages = [
    { label: 'Emails Sent', count: sent, percentage: 100, color: 'bg-slate-700 dark:bg-slate-600' },
    {
      label: 'Delivered',
      count: delivered,
      percentage: sent > 0 ? (delivered / sent) * 100 : 0,
      dropoff: sent > 0 ? `${((sent - delivered) / sent * 100).toFixed(1)}% bounce` : undefined,
      color: 'bg-indigo-600',
    },
    {
      label: 'Opened',
      count: opens,
      percentage: delivered > 0 ? (opens / delivered) * 100 : 0,
      dropoff: delivered > 0 ? `${rates.openRate || 0}% open rate` : undefined,
      color: 'bg-indigo-500',
    },
    {
      label: 'Clicked',
      count: clicks,
      percentage: delivered > 0 ? (clicks / delivered) * 100 : 0,
      dropoff: opens > 0 ? `${rates.ctor || 0}% CTOR` : undefined,
      color: 'bg-sky-500',
    },
    {
      label: 'Converted',
      count: conversions,
      percentage: delivered > 0 ? (conversions / delivered) * 100 : 0,
      dropoff: clicks > 0 ? `${((conversions / clicks) * 100).toFixed(1)}% click-to-conv` : undefined,
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            Campaign Performance Funnel & Benchmark Suite
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strict calculations based on verified recipient volumes and interaction triggers
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>Sent: {formatNumber(metrics.sent)}</span>
          <span>·</span>
          <span>Delivered: {formatNumber(metrics.delivered)}</span>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            Conversion Flow Funnel
          </span>
          <span className="text-[11px] text-slate-400">
            End-to-end conversion efficiency
          </span>
        </div>

        <div className="space-y-3">
          {funnelStages.map((stage, idx) => {
            const widthPct = Math.max(4, Math.min(100, stage.percentage));
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {stage.label}
                  </span>
                  <div className="flex items-center gap-3">
                    {stage.dropoff && (
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                        {stage.dropoff}
                      </span>
                    )}
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatNumber(stage.count)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono tabular-nums w-12 text-right">
                      {stage.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-full transition-all duration-700`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benchmark Comparisons Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Industry Benchmark Comparison
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {benchmarks.map((bm, i) => {
            const isAbove = bm.status === 'above';
            const isBelow = bm.status === 'below';
            const maxVal = Math.max(bm.value, bm.industryAvg) * 1.3 || 10;
            const userBarWidth = Math.min(100, (bm.value / maxVal) * 100);
            const avgBarWidth = Math.min(100, (bm.industryAvg / maxVal) * 100);

            return (
              <div
                key={i}
                className="p-3.5 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {bm.metric}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border capitalize ${
                      isAbove
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                        : isBelow
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {isAbove ? 'Outperforming' : isBelow ? 'Underperforming' : 'Average'}
                  </span>
                </div>

                {/* Values Comparison */}
                <div className="space-y-2 text-xs">
                  {/* Your Metric */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-500">Your Campaign:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {bm.value.toFixed(2)}
                        {bm.unit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isAbove ? 'bg-emerald-500' : isBelow ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${userBarWidth}%` }}
                      />
                    </div>
                  </div>

                  {/* Benchmark */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-400">Industry Avg:</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        {bm.industryAvg.toFixed(2)}
                        {bm.unit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-400 dark:bg-slate-500 rounded-full"
                        style={{ width: `${avgBarWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverability & List Hygiene Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Deliverability & List Hygiene Health
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-slate-500">Delivery Rate</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
              {rates.deliveryRate ? `${rates.deliveryRate}%` : '—'}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
              Threshold: &gt;97% is healthy
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-slate-500">Bounce Count & Rate</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
              {formatNumber(metrics.bounces)} ({rates.bounceRate || 0}%)
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Target: &lt;2.0% hard bounce ceiling
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-slate-500">Unsubscribe Count & Rate</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
              {formatNumber(metrics.unsubscribes)} ({rates.unsubscribeRate || 0}%)
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Target: &lt;0.5% per broad send
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
