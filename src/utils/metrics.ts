import { CampaignMetrics, CalculatedRates, MetricBenchmark } from '../types/campaign';

export function calculateCampaignRates(metrics?: CampaignMetrics): CalculatedRates {
  if (!metrics) {
    return {};
  }

  const {
    sent = 0,
    delivered = 0,
    opens = 0,
    clicks = 0,
    conversions = 0,
    unsubscribes = 0,
    bounces = 0,
  } = metrics;

  const rates: CalculatedRates = {};

  // Open Rate = Opens / Delivered * 100
  if (delivered > 0 && opens !== undefined) {
    rates.openRate = Math.min(100, Math.max(0, Number(((opens / delivered) * 100).toFixed(2))));
  }

  // CTR = Clicks / Delivered * 100
  if (delivered > 0 && clicks !== undefined) {
    rates.ctr = Math.min(100, Math.max(0, Number(((clicks / delivered) * 100).toFixed(2))));
  }

  // CTOR = Clicks / Opens * 100
  if (opens > 0 && clicks !== undefined) {
    rates.ctor = Math.min(100, Math.max(0, Number(((clicks / opens) * 100).toFixed(2))));
  }

  // Conversion Rate = Conversions / Delivered * 100
  if (delivered > 0 && conversions !== undefined) {
    rates.conversionRate = Math.min(100, Math.max(0, Number(((conversions / delivered) * 100).toFixed(2))));
  }

  // Bounce Rate = Bounces / Sent * 100
  if (sent > 0 && bounces !== undefined) {
    rates.bounceRate = Math.min(100, Math.max(0, Number(((bounces / sent) * 100).toFixed(2))));
  } else if (sent > 0 && delivered > 0 && sent >= delivered) {
    const computedBounces = sent - delivered;
    rates.bounceRate = Math.min(100, Math.max(0, Number(((computedBounces / sent) * 100).toFixed(2))));
  }

  // Unsubscribe Rate = Unsubscribes / Delivered * 100
  if (delivered > 0 && unsubscribes !== undefined) {
    rates.unsubscribeRate = Math.min(100, Math.max(0, Number(((unsubscribes / delivered) * 100).toFixed(2))));
  }

  // Delivery Rate = Delivered / Sent * 100
  if (sent > 0 && delivered > 0) {
    rates.deliveryRate = Math.min(100, Math.max(0, Number(((delivered / sent) * 100).toFixed(2))));
  }

  return rates;
}

export const INDUSTRY_BENCHMARKS = {
  openRate: 21.5,
  ctr: 2.6,
  ctor: 12.1,
  conversionRate: 1.4,
  bounceRate: 1.1,
  unsubscribeRate: 0.25,
};

export function getMetricBenchmarks(rates: CalculatedRates): MetricBenchmark[] {
  const benchmarks: MetricBenchmark[] = [];

  if (rates.openRate !== undefined) {
    benchmarks.push({
      metric: 'Open Rate',
      value: rates.openRate,
      industryAvg: INDUSTRY_BENCHMARKS.openRate,
      status: rates.openRate > INDUSTRY_BENCHMARKS.openRate * 1.1 ? 'above' : rates.openRate < INDUSTRY_BENCHMARKS.openRate * 0.9 ? 'below' : 'average',
      unit: '%',
    });
  }

  if (rates.ctr !== undefined) {
    benchmarks.push({
      metric: 'Click-Through Rate (CTR)',
      value: rates.ctr,
      industryAvg: INDUSTRY_BENCHMARKS.ctr,
      status: rates.ctr > INDUSTRY_BENCHMARKS.ctr * 1.1 ? 'above' : rates.ctr < INDUSTRY_BENCHMARKS.ctr * 0.9 ? 'below' : 'average',
      unit: '%',
    });
  }

  if (rates.ctor !== undefined) {
    benchmarks.push({
      metric: 'Click-to-Open Rate (CTOR)',
      value: rates.ctor,
      industryAvg: INDUSTRY_BENCHMARKS.ctor,
      status: rates.ctor > INDUSTRY_BENCHMARKS.ctor * 1.1 ? 'above' : rates.ctor < INDUSTRY_BENCHMARKS.ctor * 0.9 ? 'below' : 'average',
      unit: '%',
    });
  }

  if (rates.conversionRate !== undefined) {
    benchmarks.push({
      metric: 'Conversion Rate',
      value: rates.conversionRate,
      industryAvg: INDUSTRY_BENCHMARKS.conversionRate,
      status: rates.conversionRate > INDUSTRY_BENCHMARKS.conversionRate * 1.1 ? 'above' : rates.conversionRate < INDUSTRY_BENCHMARKS.conversionRate * 0.9 ? 'below' : 'average',
      unit: '%',
    });
  }

  if (rates.bounceRate !== undefined) {
    benchmarks.push({
      metric: 'Bounce Rate',
      value: rates.bounceRate,
      industryAvg: INDUSTRY_BENCHMARKS.bounceRate,
      // For bounce rate, lower is better
      status: rates.bounceRate < INDUSTRY_BENCHMARKS.bounceRate * 0.9 ? 'above' : rates.bounceRate > INDUSTRY_BENCHMARKS.bounceRate * 1.2 ? 'below' : 'average',
      unit: '%',
    });
  }

  if (rates.unsubscribeRate !== undefined) {
    benchmarks.push({
      metric: 'Unsubscribe Rate',
      value: rates.unsubscribeRate,
      industryAvg: INDUSTRY_BENCHMARKS.unsubscribeRate,
      // For unsubscribe rate, lower is better
      status: rates.unsubscribeRate < INDUSTRY_BENCHMARKS.unsubscribeRate * 0.9 ? 'above' : rates.unsubscribeRate > INDUSTRY_BENCHMARKS.unsubscribeRate * 1.2 ? 'below' : 'average',
      unit: '%',
    });
  }

  return benchmarks;
}

export function formatNumber(val: number | undefined): string {
  if (val === undefined || val === null || isNaN(val)) return '—';
  return new Intl.NumberFormat('en-US').format(val);
}

export function formatPercent(val: number | undefined): string {
  if (val === undefined || val === null || isNaN(val)) return 'Not provided';
  return `${val.toFixed(2)}%`;
}
