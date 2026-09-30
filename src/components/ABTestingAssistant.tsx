import React, { useState } from 'react';
import { ABTestPlan, ABTestTarget, FullCampaignAnalysis } from '../types/campaign';
import {
  Split,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Target,
  BarChart,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from './Toast';

interface ABTestingAssistantProps {
  campaign: FullCampaignAnalysis;
}

export const ABTestingAssistant: React.FC<ABTestingAssistantProps> = ({ campaign }) => {
  const { toast } = useToast();
  const [targetElement, setTargetElement] = useState<ABTestTarget>('subject');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedVariant, setCopiedVariant] = useState<'A' | 'B' | null>(null);

  // Initial plan state
  const [currentPlan, setCurrentPlan] = useState<ABTestPlan>({
    element: 'subject',
    testName: 'Exclusivity vs Concrete Product Benefit',
    variantA: {
      label: 'Variant A (Control)',
      content: campaign.subject,
      focus: 'VIP Privilege & Exclusivity Framing',
    },
    variantB: {
      label: 'Variant B (Challenger)',
      content: 'Alex, 35% off the new SolarWave drop (Titanium & Merino)',
      focus: 'Direct monetary discount + material specifications',
    },
    hypothesis:
      'Leading with the concrete 35% discount and recycled titanium specs will lift unique open rates by 18% over generic exclusivity phrasing.',
    primaryMetric: 'Unique Open Rate',
    secondaryMetrics: ['Click-Through Rate (CTR)', 'Unsubscribe Rate'],
    explanation:
      'Evaluates whether VIP recipients respond more to status privilege or concrete material and discount incentives.',
    recommendedSampleSplit:
      '15% Variant A / 15% Variant B test sample; remaining 70% receives winner after 4 hours',
  });

  const handleGenerate = async (element: ABTestTarget = targetElement) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-ab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          element,
          subject: campaign.subject,
          body: campaign.body,
          campaignName: campaign.campaignName,
        }),
      });

      if (!res.ok) throw new Error('A/B test generation failed');
      const plan: ABTestPlan = await res.json();
      setCurrentPlan(plan);
      toast(`Generated A/B test for ${element}!`, 'success');
    } catch (err) {
      toast('Failed to generate A/B test. Using heuristic protocol.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyVariant = (text: string, variant: 'A' | 'B') => {
    navigator.clipboard.writeText(text);
    setCopiedVariant(variant);
    toast(`Copied Variant ${variant} content!`, 'success');
    setTimeout(() => setCopiedVariant(null), 2000);
  };

  const elements: Array<{ id: ABTestTarget; label: string; desc: string }> = [
    { id: 'subject', label: 'Subject Line', desc: 'Test open rates and inbox hooks' },
    { id: 'cta', label: 'Call to Action', desc: 'Test click intent & CTOR' },
    { id: 'opening', label: 'Email Opening', desc: 'Test hook engagement & scroll depth' },
    { id: 'body', label: 'Body Structure', desc: 'Test reading format & bullet points' },
    { id: 'offer', label: 'Offer Framing', desc: 'Test discount vs dollar voucher' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Split className="w-4 h-4 text-indigo-500" />
            A/B Testing Experiment Generator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Statistical experiment framing, hypotheses, and multi-variant branch generator
          </p>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Single-variable discipline
        </span>
      </div>

      {/* Target Element Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
          Select Variable to Experiment On:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {elements.map((el) => {
            const isSelected = targetElement === el.id;
            return (
              <button
                key={el.id}
                onClick={() => {
                  setTargetElement(el.id);
                  handleGenerate(el.id);
                }}
                className={`p-3 text-left rounded-xl border transition-all ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-xs ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {el.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {el.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Experiment Details Card */}
      <div className="p-5 bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Active Experiment Design
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {currentPlan.testName}
            </h4>
          </div>

          <button
            onClick={() => handleGenerate(targetElement)}
            disabled={isLoading}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Designing Experiment...' : 'Regenerate Experiment'}
          </button>
        </div>

        {/* Side by side Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Variant A */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                {currentPlan.variantA.label}
              </span>
              <button
                onClick={() => handleCopyVariant(currentPlan.variantA.content, 'A')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
                title="Copy Variant A"
                aria-label="Copy Variant A"
              >
                {copiedVariant === 'A' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white whitespace-pre-wrap font-sans">
              {currentPlan.variantA.content}
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Angle: </span>
              {currentPlan.variantA.focus}
            </div>
          </div>

          {/* Variant B */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-indigo-300 dark:border-indigo-700 ring-1 ring-indigo-400/20 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                {currentPlan.variantB.label}
              </span>
              <button
                onClick={() => handleCopyVariant(currentPlan.variantB.content, 'B')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
                title="Copy Variant B"
                aria-label="Copy Variant B"
              >
                {copiedVariant === 'B' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900/60 text-xs font-medium text-slate-900 dark:text-white whitespace-pre-wrap font-sans">
              {currentPlan.variantB.content}
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Angle: </span>
              {currentPlan.variantB.focus}
            </div>
          </div>
        </div>

        {/* Hypothesis & Metrics Guidance */}
        <div className="space-y-3 pt-2 text-xs">
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              Hypothesis Under Test
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              "{currentPlan.hypothesis}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">
                Primary Metric
              </div>
              <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">
                {currentPlan.primaryMetric}
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">
                Secondary Guardrails
              </div>
              <div className="font-medium text-slate-700 dark:text-slate-300 text-xs mt-0.5">
                {currentPlan.secondaryMetrics.join(' · ')}
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">
                Recommended Sample
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                {currentPlan.recommendedSampleSplit}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            What this measures: {currentPlan.explanation}
          </div>
        </div>
      </div>
    </div>
  );
};
