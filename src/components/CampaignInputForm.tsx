import React, { useState } from 'react';
import { CampaignMetrics, FullCampaignAnalysis } from '../types/campaign';
import { DEMO_CAMPAIGN } from '../data/demoCampaign';
import {
  FileEdit,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useToast } from './Toast';

interface CampaignInputFormProps {
  onAnalyze: (payload: {
    campaignName: string;
    subject: string;
    body: string;
    previewText?: string;
    senderName?: string;
    senderEmail?: string;
    metrics?: CampaignMetrics;
  }) => void;
  isLoading: boolean;
  initialData?: FullCampaignAnalysis;
}

export const CampaignInputForm: React.FC<CampaignInputFormProps> = ({
  onAnalyze,
  isLoading,
  initialData,
}) => {
  const { toast } = useToast();
  const [campaignName, setCampaignName] = useState(initialData?.campaignName || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [previewText, setPreviewText] = useState(initialData?.previewText || '');
  const [senderName, setSenderName] = useState(initialData?.senderName || '');
  const [senderEmail, setSenderEmail] = useState(initialData?.senderEmail || '');
  const [body, setBody] = useState(initialData?.body || '');

  // Optional Metrics
  const [showMetrics, setShowMetrics] = useState(!!initialData?.metrics);
  const [sent, setSent] = useState<string>(initialData?.metrics?.sent?.toString() || '');
  const [delivered, setDelivered] = useState<string>(initialData?.metrics?.delivered?.toString() || '');
  const [opens, setOpens] = useState<string>(initialData?.metrics?.opens?.toString() || '');
  const [clicks, setClicks] = useState<string>(initialData?.metrics?.clicks?.toString() || '');
  const [conversions, setConversions] = useState<string>(initialData?.metrics?.conversions?.toString() || '');
  const [unsubscribes, setUnsubscribes] = useState<string>(initialData?.metrics?.unsubscribes?.toString() || '');
  const [bounces, setBounces] = useState<string>(initialData?.metrics?.bounces?.toString() || '');

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const charCount = subject.length;

  const handleLoadDemo = () => {
    setCampaignName(DEMO_CAMPAIGN.campaignName);
    setSubject(DEMO_CAMPAIGN.subject);
    setPreviewText(DEMO_CAMPAIGN.previewText || '');
    setSenderName(DEMO_CAMPAIGN.senderName || '');
    setSenderEmail(DEMO_CAMPAIGN.senderEmail || '');
    setBody(DEMO_CAMPAIGN.body);
    setShowMetrics(true);
    setSent(DEMO_CAMPAIGN.metrics?.sent?.toString() || '');
    setDelivered(DEMO_CAMPAIGN.metrics?.delivered?.toString() || '');
    setOpens(DEMO_CAMPAIGN.metrics?.opens?.toString() || '');
    setClicks(DEMO_CAMPAIGN.metrics?.clicks?.toString() || '');
    setConversions(DEMO_CAMPAIGN.metrics?.conversions?.toString() || '');
    setUnsubscribes(DEMO_CAMPAIGN.metrics?.unsubscribes?.toString() || '');
    setBounces(DEMO_CAMPAIGN.metrics?.bounces?.toString() || '');
    toast('Loaded Demo Campaign "Summer Product Launch"', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast('Please enter a subject line to analyze', 'error');
      return;
    }
    if (!body.trim()) {
      toast('Please paste the email body text to analyze', 'error');
      return;
    }

    let parsedMetrics: CampaignMetrics | undefined = undefined;
    if (showMetrics && (sent || delivered || opens || clicks)) {
      parsedMetrics = {
        sent: sent ? parseInt(sent, 10) : undefined,
        delivered: delivered ? parseInt(delivered, 10) : undefined,
        opens: opens ? parseInt(opens, 10) : undefined,
        clicks: clicks ? parseInt(clicks, 10) : undefined,
        conversions: conversions ? parseInt(conversions, 10) : undefined,
        unsubscribes: unsubscribes ? parseInt(unsubscribes, 10) : undefined,
        bounces: bounces ? parseInt(bounces, 10) : undefined,
      };
    }

    onAnalyze({
      campaignName: campaignName.trim() || 'Untitled Campaign',
      subject: subject.trim(),
      body: body.trim(),
      previewText: previewText.trim() || undefined,
      senderName: senderName.trim() || undefined,
      senderEmail: senderEmail.trim() || undefined,
      metrics: parsedMetrics,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-indigo-500" />
            Email Campaign Input & Auditor
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Paste your email content and optional performance metrics to trigger deep AI diagnosis
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          Load Demo Campaign
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campaign Name + Sender Lockup */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              placeholder="e.g. Summer Product Launch"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Sender Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Elena from Lumina"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Sender Email (Optional)
            </label>
            <input
              type="email"
              placeholder="e.g. team@brand.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Subject Line Input */}
        <div>
          <div className="flex items-center justify-between mb-1 text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Email Subject Line <span className="text-rose-500">*</span>
            </label>
            <span className="font-mono text-[11px] text-slate-400 tabular-nums">
              {charCount} characters · {charCount <= 50 ? 'Optimal mobile length' : 'May truncate'}
            </span>
          </div>
          <input
            type="text"
            required
            placeholder="e.g. Your exclusive early access starts today"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 dark:text-white"
          />
        </div>

        {/* Preview / Preheader Text */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Preview Text / Preheader (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Unlock 35% off the new SolarWave Collection before public release."
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Email Body Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1 text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Email Body Content <span className="text-rose-500">*</span>
            </label>
            <span className="font-mono text-[11px] text-slate-400 tabular-nums">
              {wordCount} words
            </span>
          </div>
          <textarea
            required
            rows={10}
            placeholder="Paste complete email body here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-3.5 text-xs font-sans leading-relaxed bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Optional Performance Metrics Collapsible */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowMetrics(!showMetrics)}
            className="flex items-center justify-between w-full p-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Campaign Performance Metrics (Optional)
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span>{showMetrics ? 'Hide Metrics Form' : 'Add Historical Metrics'}</span>
              {showMetrics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {showMetrics && (
            <div className="p-4 mt-2 bg-slate-50/70 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Supplying verified metrics allows MailLens to compute exact Open Rate, CTR, CTOR, and compare against industry benchmarks. If omitted, MailLens analyzes text structure without hallucinating numbers.
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Emails Sent
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="10000"
                    value={sent}
                    onChange={(e) => setSent(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Delivered
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="9850"
                    value={delivered}
                    onChange={(e) => setDelivered(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Unique Opens
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="3420"
                    value={opens}
                    onChange={(e) => setOpens(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Unique Clicks
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="684"
                    value={clicks}
                    onChange={(e) => setClicks(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Conversions
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="137"
                    value={conversions}
                    onChange={(e) => setConversions(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Unsubscribes
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="42"
                    value={unsubscribes}
                    onChange={(e) => setUnsubscribes(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Bounces
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="150"
                    value={bounces}
                    onChange={(e) => setBounces(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'Analyzing Campaign...' : 'Analyze Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};
