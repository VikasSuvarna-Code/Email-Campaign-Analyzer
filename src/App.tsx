import React, { useState, useEffect } from 'react';
import { FullCampaignAnalysis, CampaignMetrics, ActionableRecommendation, CSVRow } from './types/campaign';
import { DEMO_CAMPAIGN } from './data/demoCampaign';
import { ToastProvider, useToast } from './components/Toast';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { KpiGrid } from './components/KpiGrid';
import { HealthScoreSection } from './components/HealthScoreSection';
import { SubjectLineAnalyzer } from './components/SubjectLineAnalyzer';
import { EmailContentAnalyzer } from './components/EmailContentAnalyzer';
import { CampaignMetricsAnalyzer } from './components/CampaignMetricsAnalyzer';
import { ABTestingAssistant } from './components/ABTestingAssistant';
import { RecommendationsList } from './components/RecommendationsList';
import { AIInsightsPanel } from './components/AIInsightsPanel';
import { EmailPreview } from './components/EmailPreview';
import { CsvUploader } from './components/CsvUploader';
import { ReportModal } from './components/ReportModal';
import { EmailRewriteModal } from './components/EmailRewriteModal';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { CampaignInputForm } from './components/CampaignInputForm';
import { SettingsModal } from './components/SettingsModal';
import {
  Sparkles,
  ArrowRight,
  Eye,
  FileEdit,
  AlertCircle,
  Lightbulb,
  Split,
  FileText,
  BarChart3,
  Mail,
  Zap,
} from 'lucide-react';

function MailLensApp() {
  const { toast } = useToast();

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Campaigns state
  const [activeCampaign, setActiveCampaign] = useState<FullCampaignAnalysis>(DEMO_CAMPAIGN);
  const [campaignHistory, setCampaignHistory] = useState<FullCampaignAnalysis[]>([DEMO_CAMPAIGN]);

  // Modals state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isRewriteOpen, setIsRewriteOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAnalysisPayload, setPendingAnalysisPayload] = useState<any>(null);

  // Rewritten version storage
  const [improvedSubject, setImprovedSubject] = useState<string | undefined>();
  const [improvedBody, setImprovedBody] = useState<string | undefined>();

  // Switch active campaign
  const handleSelectCampaign = (id: string) => {
    const found = campaignHistory.find((c) => c.id === id);
    if (found) {
      setActiveCampaign(found);
      setImprovedSubject(undefined);
      setImprovedBody(undefined);
      toast(`Switched to campaign "${found.campaignName}"`, 'info');
    }
  };

  // Launch analysis pipeline
  const handleAnalyzeCampaign = (payload: {
    campaignName: string;
    subject: string;
    body: string;
    previewText?: string;
    senderName?: string;
    senderEmail?: string;
    metrics?: CampaignMetrics;
  }) => {
    setPendingAnalysisPayload(payload);
    setIsProcessing(true);
  };

  // Execute server API call upon processing overlay completion
  const handleProcessingComplete = async () => {
    setIsProcessing(false);
    if (!pendingAnalysisPayload) return;

    try {
      const res = await fetch('/api/analyze-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingAnalysisPayload),
      });

      if (!res.ok) throw new Error('Analysis failed');
      const analyzedData: FullCampaignAnalysis = await res.json();

      setCampaignHistory((prev) => [analyzedData, ...prev.filter((c) => c.id !== analyzedData.id)]);
      setActiveCampaign(analyzedData);
      setImprovedSubject(undefined);
      setImprovedBody(undefined);
      setCurrentTab('dashboard');
      toast('Campaign analysis complete!', 'success');
    } catch (err: any) {
      toast('Could not complete analysis. Check server connection.', 'error');
    } finally {
      setPendingAnalysisPayload(null);
    }
  };

  // Apply annotation replacement directly to active campaign body
  const handleApplyAnnotationReplacement = (original: string, replacement: string) => {
    const updatedBody = activeCampaign.body.replace(original, replacement);
    setActiveCampaign((prev) => ({
      ...prev,
      body: updatedBody,
    }));
    toast('Applied annotation fix to email body!', 'success');
  };

  // Apply alternative subject
  const handleApplySubject = (newSubject: string) => {
    setActiveCampaign((prev) => ({
      ...prev,
      subject: newSubject,
      subjectAnalysis: {
        ...prev.subjectAnalysis,
        currentSubject: newSubject,
        length: newSubject.length,
      },
    }));
    toast('Updated campaign subject line!', 'success');
  };

  // Apply AI rewrite
  const handleApplyImproved = (newSubj: string, newBody: string) => {
    setImprovedSubject(newSubj);
    setImprovedBody(newBody);
    setActiveCampaign((prev) => ({
      ...prev,
      subject: newSubj,
      body: newBody,
      subjectAnalysis: {
        ...prev.subjectAnalysis,
        currentSubject: newSubj,
        length: newSubj.length,
      },
    }));
  };

  // Load campaign from CSV row
  const handleSelectFromCSV = (row: Partial<CSVRow>) => {
    const newCampaign: FullCampaignAnalysis = {
      id: `csv-${Date.now()}`,
      campaignName: row.campaign || 'CSV Imported Campaign',
      subject: `Special VIP Announcement: ${row.campaign}`,
      body: `Hi there,\n\nWe wanted to share an exclusive update regarding ${row.campaign}.\n\nTake advantage of this limited window before access opens to the public.\n\n[Explore Collection →]\n\nWarm regards,\nThe Growth Team`,
      metrics: {
        sent: row.sent,
        delivered: row.delivered,
        opens: row.opens,
        clicks: row.clicks,
        conversions: row.conversions,
        unsubscribes: row.unsubscribes,
        bounces: row.bounces,
      },
      calculatedRates: {
        openRate: row.openRate,
        ctr: row.ctr,
        ctor: row.ctor,
        conversionRate: row.conversionRate,
        bounceRate: row.bounceRate,
        unsubscribeRate: row.unsubscribeRate,
      },
      healthScore: {
        overall: Math.min(95, Math.max(50, Math.round((row.openRate || 20) * 1.5 + (row.ctor || 15) * 1.8))),
        status: (row.openRate || 0) > 25 ? 'Optimal' : 'Good',
        summaryRationale: `Campaign historical metrics imported from CSV for ${row.campaign}. Delivered volume: ${row.delivered?.toLocaleString()} recipients.`,
        breakdown: {
          subjectLine: { score: 82, label: 'Subject structure', explanation: 'Historical subject placeholder.' },
          emailContent: { score: 78, label: 'Content baseline', explanation: 'Standard promotional cadence.' },
          ctaQuality: { score: 80, label: 'CTA action', explanation: 'Action oriented anchor.' },
          readability: { score: 85, label: 'Readability', explanation: 'Scannable copy length.' },
          personalization: { score: 75, label: 'Audience segment', explanation: 'VIP cohort targeting.' },
          engagementSignals: { score: Math.min(98, Math.round((row.ctor || 12) * 4.5)), label: `CTOR ${row.ctor}%`, explanation: 'Verified subscriber click intent.' },
          conversionPotential: { score: Math.min(95, Math.round((row.conversionRate || 1.2) * 45)), label: `Conv. Rate ${row.conversionRate}%`, explanation: 'Historical checkout rate.' },
        },
      },
      subjectAnalysis: {
        currentSubject: `Special VIP Announcement: ${row.campaign}`,
        length: 32 + (row.campaign?.length || 0),
        wordCount: 5,
        clarityScore: 88,
        relevanceScore: 85,
        curiosityScore: 80,
        urgencyScore: 74,
        personalizationScore: 70,
        emotionalAppeal: 'Direct utility & exclusivity',
        ctaStrength: 'Action prompt',
        spamRiskRating: 'Low',
        spamRiskKeywords: [],
        strengths: ['Concise and clearly contextualized'],
        suggestions: [
          {
            subject: `Alex, your private access: ${row.campaign}`,
            whyItWorks: 'Adds personal token and exclusivity marker.',
            whatChanged: 'Added name and private framing.',
            angle: 'VIP Personal',
            characterCount: 38,
          },
          {
            subject: `Inside: Everything new in ${row.campaign}`,
            whyItWorks: 'Opens curiosity gap.',
            whatChanged: 'Inverted to preview angle.',
            angle: 'Curiosity Gap',
            characterCount: 35,
          },
        ],
      },
      contentAnalysis: {
        readabilityGradeLevel: '7th Grade (Easy to read)',
        readingTimeSeconds: 25,
        wordCount: 55,
        sentenceCount: 4,
        avgSentenceLength: 14,
        paragraphCount: 4,
        tone: 'Direct & Professional',
        personalizationDepth: 'Greeting salutation',
        valuePropositionClarity: 'Clear offer focus',
        ctaClarity: 'Prominent link button',
        contentStructureGrade: 'A',
        mobileReadabilityAssessment: 'High: Short bursts',
        jargonIdentified: [],
        potentialSpamPhrases: [],
        missingInformation: [],
        annotations: [],
      },
      insights: {
        strengths: [
          {
            title: `Solid Verified Open Rate (${row.openRate}%)`,
            detail: `Generated ${row.opens?.toLocaleString()} opens out of ${row.delivered?.toLocaleString()} delivered.`,
            evidence: `Raw data: ${row.opens} / ${row.delivered}`,
          },
        ],
        weaknesses: [
          {
            title: 'Unsubscribe Monitor',
            detail: `${row.unsubscribes} unsubscribes recorded.`,
            evidence: `${row.unsubscribes} total opt-outs.`,
          },
        ],
        opportunities: [
          {
            title: 'Test Follow-up Resend to Non-Openers',
            detail: 'A resend with alternative subject line recovers 8-12% additional opens.',
            evidence: 'Standard non-opener segment recovery.',
          },
        ],
        risks: [
          {
            title: 'List Saturation Alert',
            detail: 'Maintain frequency caps to protect domain reputation.',
            evidence: `${row.sent?.toLocaleString()} volume send.`,
          },
        ],
      },
      recommendations: [
        {
          id: 'rec-csv-1',
          recommendation: 'Segment by Engagement Velocity',
          reason: 'Subscribers who converted on this drop have 3x higher re-order likelihood.',
          expectedAreaOfImprovement: 'Conversion Rate',
          priority: 'High',
          suggestedExperiment: 'Send a complementary VIP cross-sell within 72 hours of purchase.',
        },
      ],
      predictedEngagement: {
        likelyHighPerformingSegments: ['Recent purchasers from this batch'],
        atRiskSegments: ['Recipients who bounced'],
        deviceBehaviorEstimate: { desktopShare: 40, mobileShare: 60, notes: 'Typical e-commerce profile.' },
        timingHypothesis: 'Morning hours deliver peak opens.',
      },
      analyzedAt: new Date().toISOString(),
    };

    setCampaignHistory((prev) => [newCampaign, ...prev]);
    setActiveCampaign(newCampaign);
    setCurrentTab('dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <Header
        currentCampaign={activeCampaign}
        campaignList={campaignHistory.map((c) => ({
          id: c.id,
          name: c.campaignName,
          isDemo: c.isDemo,
        }))}
        onSelectCampaign={handleSelectCampaign}
        onOpenNewAnalysis={() => setCurrentTab('analyzer')}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          recommendationsCount={activeCampaign.recommendations?.length || 0}
          hasMetrics={!!activeCampaign.metrics?.sent}
        />

        {/* Main Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Missing Data Notification Banner if metrics were omitted */}
          {activeCampaign.missingDataNotice && (
            <div className="flex items-center justify-between p-3.5 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{activeCampaign.missingDataNotice}</span>
              </div>
              <button
                onClick={() => setCurrentTab('analyzer')}
                className="font-semibold underline hover:no-underline ml-3 shrink-0"
              >
                Add Metrics Now
              </button>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Campaign Title & Quick Actions Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {activeCampaign.campaignName}
                    </h1>
                    {activeCampaign.isDemo && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        Demo Data
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>Subject: "{activeCampaign.subject}"</span>
                    <span>·</span>
                    <span>Analyzed {new Date(activeCampaign.analyzedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsRewriteOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Improve Email
                  </button>

                  <button
                    onClick={() => setIsReportOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <KpiGrid metrics={activeCampaign.metrics} rates={activeCampaign.calculatedRates} />

              {/* Central AI Campaign Health Score */}
              <HealthScoreSection
                healthScore={activeCampaign.healthScore}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />

              {/* Subject Line & Content Summaries */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                  <SubjectLineAnalyzer
                    analysis={activeCampaign.subjectAnalysis}
                    onApplySubject={handleApplySubject}
                  />
                </div>
                <div className="lg:col-span-6">
                  <AIInsightsPanel insights={activeCampaign.insights} />
                </div>
              </div>

              {/* Actionable Recommendations */}
              <RecommendationsList
                recommendations={activeCampaign.recommendations}
                onLaunchExperiment={(rec) => {
                  setCurrentTab('ab_test');
                  toast(`Created experiment protocol for: "${rec.recommendation}"`, 'info');
                }}
              />

              {/* Quick Preview Anchor */}
              <EmailPreview
                campaign={activeCampaign}
                improvedSubject={improvedSubject}
                improvedBody={improvedBody}
              />
            </div>
          )}

          {/* TAB 2: CAMPAIGN INPUT / EDITOR */}
          {currentTab === 'analyzer' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <CampaignInputForm
                onAnalyze={handleAnalyzeCampaign}
                isLoading={isProcessing}
                initialData={activeCampaign}
              />
            </div>
          )}

          {/* TAB 3: EMAIL CONTENT & ANNOTATIONS */}
          {currentTab === 'content' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Email Content & Linguistic Diagnostic
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Examine paragraph density, spam triggers, readability grades, and inline friction
                  </p>
                </div>

                <button
                  onClick={() => setIsRewriteOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Rewrite with AI
                </button>
              </div>

              <EmailContentAnalyzer
                contentAnalysis={activeCampaign.contentAnalysis}
                emailBody={activeCampaign.body}
                onApplyAnnotationReplacement={handleApplyAnnotationReplacement}
              />

              <EmailPreview
                campaign={activeCampaign}
                improvedSubject={improvedSubject}
                improvedBody={improvedBody}
              />
            </div>
          )}

          {/* TAB 4: CAMPAIGN METRICS & FUNNEL */}
          {currentTab === 'metrics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Campaign Metrics & Conversion Funnel
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comprehensive stage breakdown from email sent through checkout conversion
                  </p>
                </div>
              </div>

              <KpiGrid metrics={activeCampaign.metrics} rates={activeCampaign.calculatedRates} />

              <CampaignMetricsAnalyzer
                metrics={activeCampaign.metrics}
                rates={activeCampaign.calculatedRates}
                onOpenInput={() => setCurrentTab('analyzer')}
              />
            </div>
          )}

          {/* TAB 5: A/B TESTING ASSISTANT */}
          {currentTab === 'ab_test' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    A/B Experimentation Studio
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generate multi-variant hypotheses to test subject lines, CTAs, offers, and opening hooks
                  </p>
                </div>
              </div>

              <ABTestingAssistant campaign={activeCampaign} />
            </div>
          )}

          {/* TAB 6: AI RECOMMENDATIONS */}
          {currentTab === 'recommendations' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Actionable Recommendations Roadmap
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Evidence-backed improvements prioritized by conversion leverage
                  </p>
                </div>
              </div>

              <RecommendationsList
                recommendations={activeCampaign.recommendations}
                onLaunchExperiment={(rec) => {
                  setCurrentTab('ab_test');
                  toast(`Launched A/B test setup for: "${rec.recommendation}"`, 'info');
                }}
              />

              <AIInsightsPanel insights={activeCampaign.insights} />
            </div>
          )}

          {/* TAB 7: CSV UPLOAD & MULTI-RUN */}
          {currentTab === 'csv' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Multi-Campaign Performance CSV
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload cross-campaign metrics to benchmark and identify underperforming cohorts
                  </p>
                </div>
              </div>

              <CsvUploader onSelectCampaignForAnalysis={handleSelectFromCSV} />
            </div>
          )}

          {/* TAB 8: REPORTS & EXPORT */}
          {currentTab === 'reports' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Campaign Reports & Export Suite
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generate, export, or print executive marketing analysis reports
                  </p>
                </div>
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Open Full Report Modal
                </button>
              </div>

              <div className="p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Ready to Generate Analysis Report
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                    Your report for "{activeCampaign.campaignName}" is compiled and ready for PDF export, clipboard copying, or team distribution.
                  </p>
                </div>
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  View & Export Full Report
                </button>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {currentTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <SettingsModal />
            </div>
          )}
        </main>
      </div>

      {/* Processing Animation Overlay */}
      <ProcessingOverlay
        isOpen={isProcessing}
        onComplete={handleProcessingComplete}
      />

      {/* AI Email Rewrite Modal */}
      <EmailRewriteModal
        isOpen={isRewriteOpen}
        onClose={() => setIsRewriteOpen(false)}
        originalSubject={activeCampaign.subject}
        originalBody={activeCampaign.body}
        onApplyImproved={handleApplyImproved}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        campaign={activeCampaign}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MailLensApp />
    </ToastProvider>
  );
}
