import React, { useState } from 'react';
import { FullCampaignAnalysis } from '../types/campaign';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Download,
  X,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useToast } from './Toast';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: FullCampaignAnalysis;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  campaign,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateReportMarkdown = () => {
    return `# MailLens AI – Campaign Analysis Report
Generated: ${new Date(campaign.analyzedAt).toLocaleString()}
Campaign: ${campaign.campaignName}

## 1. Executive Summary & Health Score
Overall Health Score: ${campaign.healthScore.overall}/100 (${campaign.healthScore.status})
Summary: ${campaign.healthScore.summaryRationale}

### Category Score Breakdown
- Subject Line: ${campaign.healthScore.breakdown.subjectLine.score}/100 - ${campaign.healthScore.breakdown.subjectLine.label}
- Email Content: ${campaign.healthScore.breakdown.emailContent.score}/100 - ${campaign.healthScore.breakdown.emailContent.label}
- CTA Quality: ${campaign.healthScore.breakdown.ctaQuality.score}/100 - ${campaign.healthScore.breakdown.ctaQuality.label}
- Readability: ${campaign.healthScore.breakdown.readability.score}/100 - ${campaign.healthScore.breakdown.readability.label}
- Personalization: ${campaign.healthScore.breakdown.personalization.score}/100 - ${campaign.healthScore.breakdown.personalization.label}
- Engagement Signals: ${campaign.healthScore.breakdown.engagementSignals.score}/100 - ${campaign.healthScore.breakdown.engagementSignals.label}
- Conversion Potential: ${campaign.healthScore.breakdown.conversionPotential.score}/100 - ${campaign.healthScore.breakdown.conversionPotential.label}

## 2. Key Performance Metrics
- Sent: ${campaign.metrics?.sent?.toLocaleString() || 'Not provided'}
- Delivered: ${campaign.metrics?.delivered?.toLocaleString() || 'Not provided'}
- Open Rate: ${campaign.calculatedRates.openRate ? `${campaign.calculatedRates.openRate}%` : 'Not provided'}
- CTR: ${campaign.calculatedRates.ctr ? `${campaign.calculatedRates.ctr}%` : 'Not provided'}
- CTOR: ${campaign.calculatedRates.ctor ? `${campaign.calculatedRates.ctor}%` : 'Not provided'}
- Conversion Rate: ${campaign.calculatedRates.conversionRate ? `${campaign.calculatedRates.conversionRate}%` : 'Not provided'}
- Bounce Rate: ${campaign.calculatedRates.bounceRate ? `${campaign.calculatedRates.bounceRate}%` : 'Not provided'}
- Unsubscribe Rate: ${campaign.calculatedRates.unsubscribeRate ? `${campaign.calculatedRates.unsubscribeRate}%` : 'Not provided'}

## 3. Subject Line Diagnostic
Current Subject: "${campaign.subjectAnalysis.currentSubject}"
Length: ${campaign.subjectAnalysis.length} characters (${campaign.subjectAnalysis.wordCount} words)
Spam Risk: ${campaign.subjectAnalysis.spamRiskRating}

AI Alternative Suggestions:
${campaign.subjectAnalysis.suggestions.map((s, i) => `${i + 1}. "${s.subject}" (Angle: ${s.angle})\n   Reason: ${s.whyItWorks}`).join('\n')}

## 4. Content Analysis
- Readability: ${campaign.contentAnalysis.readabilityGradeLevel}
- Reading Time: ~${campaign.contentAnalysis.readingTimeSeconds} seconds
- Word Count: ${campaign.contentAnalysis.wordCount} words
- Tone: ${campaign.contentAnalysis.tone}
- Potential Spam-Risk Phrases: ${campaign.contentAnalysis.potentialSpamPhrases.join(', ') || 'None detected'}

## 5. Strengths & Weaknesses
### Observed Strengths
${campaign.insights.strengths.map(s => `- ${s.title}: ${s.detail} (Evidence: ${s.evidence})`).join('\n')}

### Friction & Weaknesses
${campaign.insights.weaknesses.map(w => `- ${w.title}: ${w.detail} (Evidence: ${w.evidence})`).join('\n')}

## 6. Actionable Recommendations
${campaign.recommendations.map((r, i) => `${i + 1}. [${r.priority} Priority] ${r.recommendation}
   Target: ${r.expectedAreaOfImprovement}
   Reason: ${r.reason}
   Suggested Experiment: ${r.suggestedExperiment}`).join('\n\n')}

---
MailLens AI – Turn every email campaign into actionable insight.
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportMarkdown());
    setCopied(true);
    toast('Full campaign report copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generateReportMarkdown()], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `MailLens_Report_${campaign.campaignName.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast('Report downloaded as Markdown file', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Comprehensive Campaign Report
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {campaign.campaignName} · Analyzed on {new Date(campaign.analyzedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Export Format: Markdown / Print Ready
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Report'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Report Preview Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800 dark:text-slate-200 font-sans">
          {/* Executive Summary */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                1. Executive Summary & Health Score
              </span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                Score: {campaign.healthScore.overall}/100 ({campaign.healthScore.status})
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {campaign.healthScore.summaryRationale}
            </p>
          </div>

          {/* Metrics summary */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">
              2. Key Campaign Metrics
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-slate-400 text-[10px]">Open Rate</div>
                <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {campaign.calculatedRates.openRate ? `${campaign.calculatedRates.openRate}%` : 'Not provided'}
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-slate-400 text-[10px]">Click-Through (CTR)</div>
                <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {campaign.calculatedRates.ctr ? `${campaign.calculatedRates.ctr}%` : 'Not provided'}
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-slate-400 text-[10px]">Click-to-Open (CTOR)</div>
                <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {campaign.calculatedRates.ctor ? `${campaign.calculatedRates.ctor}%` : 'Not provided'}
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-slate-400 text-[10px]">Conversion Rate</div>
                <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {campaign.calculatedRates.conversionRate ? `${campaign.calculatedRates.conversionRate}%` : 'Not provided'}
                </div>
              </div>
            </div>
          </div>

          {/* Subject Line & Content */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">
              3. Subject Line Diagnostic
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">
                "{campaign.subjectAnalysis.currentSubject}"
              </div>
              <div className="text-[11px] text-slate-500">
                Length: {campaign.subjectAnalysis.length} chars · Spam Risk: {campaign.subjectAnalysis.spamRiskRating}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">
              4. Actionable Experiment Roadmap
            </div>
            <div className="space-y-2">
              {campaign.recommendations.map((r, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {r.priority}
                    </span>
                    <span>{r.recommendation}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {r.suggestedExperiment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400">
            MailLens AI · Enterprise Email Analytics Suite
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
