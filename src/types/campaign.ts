export interface CampaignMetrics {
  sent?: number;
  delivered?: number;
  opens?: number;
  clicks?: number;
  replies?: number;
  unsubscribes?: number;
  conversions?: number;
  bounces?: number;
}

export interface CalculatedRates {
  openRate?: number;
  ctr?: number;
  ctor?: number;
  conversionRate?: number;
  bounceRate?: number;
  unsubscribeRate?: number;
  deliveryRate?: number;
}

export interface MetricBenchmark {
  metric: string;
  value: number;
  industryAvg: number;
  status: 'above' | 'average' | 'below';
  unit: string;
}

export interface ScoreCategory {
  score: number; // 0-100
  label: string;
  explanation: string;
}

export interface CampaignHealthScore {
  overall: number; // 0-100
  status: 'Optimal' | 'Good' | 'Needs Attention' | 'Critical';
  breakdown: {
    subjectLine: ScoreCategory;
    emailContent: ScoreCategory;
    ctaQuality: ScoreCategory;
    readability: ScoreCategory;
    personalization: ScoreCategory;
    engagementSignals: ScoreCategory;
    conversionPotential: ScoreCategory;
  };
  summaryRationale: string;
}

export interface SubjectAlternative {
  subject: string;
  whyItWorks: string;
  whatChanged: string;
  angle: string;
  characterCount: number;
}

export interface SubjectLineAnalysis {
  currentSubject: string;
  length: number;
  wordCount: number;
  clarityScore: number;
  relevanceScore: number;
  curiosityScore: number;
  urgencyScore: number;
  personalizationScore: number;
  emotionalAppeal: string;
  ctaStrength: string;
  spamRiskRating: 'Low' | 'Moderate' | 'High';
  spamRiskKeywords: string[];
  strengths: string[];
  suggestions: SubjectAlternative[];
}

export interface ContentAnnotation {
  id: string;
  quote: string;
  type: 'spam_risk' | 'urgency' | 'clarity' | 'cta' | 'readability' | 'missing_info';
  severity: 'warning' | 'critical' | 'suggestion' | 'positive';
  label: string;
  explanation: string;
  suggestedReplacement?: string;
}

export interface EmailContentAnalysis {
  readabilityGradeLevel: string;
  readingTimeSeconds: number;
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  paragraphCount: number;
  tone: string;
  personalizationDepth: string;
  valuePropositionClarity: string;
  ctaClarity: string;
  contentStructureGrade: string;
  mobileReadabilityAssessment: string;
  jargonIdentified: string[];
  potentialSpamPhrases: string[];
  missingInformation: string[];
  annotations: ContentAnnotation[];
}

export interface ActionableRecommendation {
  id: string;
  recommendation: string;
  reason: string;
  expectedAreaOfImprovement: string;
  priority: 'High' | 'Medium' | 'Low';
  suggestedExperiment: string;
}

export interface InsightItem {
  title: string;
  detail: string;
  evidence: string;
}

export interface AIInsights {
  strengths: InsightItem[];
  weaknesses: InsightItem[];
  opportunities: InsightItem[];
  risks: InsightItem[];
}

export interface PredictedEngagement {
  likelyHighPerformingSegments: string[];
  atRiskSegments: string[];
  deviceBehaviorEstimate: {
    desktopShare: number;
    mobileShare: number;
    notes: string;
  };
  timingHypothesis: string;
}

export interface FullCampaignAnalysis {
  id: string;
  campaignName: string;
  subject: string;
  previewText?: string;
  senderName?: string;
  senderEmail?: string;
  body: string;
  metrics?: CampaignMetrics;
  calculatedRates: CalculatedRates;
  healthScore: CampaignHealthScore;
  subjectAnalysis: SubjectLineAnalysis;
  contentAnalysis: EmailContentAnalysis;
  insights: AIInsights;
  recommendations: ActionableRecommendation[];
  predictedEngagement: PredictedEngagement;
  missingDataNotice?: string;
  analyzedAt: string;
  isDemo?: boolean;
}

export type EmailTone = 'professional' | 'friendly' | 'persuasive' | 'minimal' | 'urgent' | 'conversational';

export interface ImprovedEmailResult {
  originalText: string;
  improvedSubject: string;
  improvedBody: string;
  toneUsed: EmailTone;
  majorChanges: string[];
  whyBetter: string;
}

export type ABTestTarget = 'subject' | 'cta' | 'opening' | 'body' | 'offer';

export interface ABTestPlan {
  element: ABTestTarget;
  testName: string;
  variantA: {
    label: string;
    content: string;
    focus: string;
  };
  variantB: {
    label: string;
    content: string;
    focus: string;
  };
  hypothesis: string;
  primaryMetric: string;
  secondaryMetrics: string[];
  explanation: string;
  recommendedSampleSplit: string;
}

export interface CSVRow {
  campaign: string;
  sent: number;
  delivered: number;
  opens: number;
  clicks: number;
  conversions: number;
  unsubscribes: number;
  bounces: number;
  openRate: number;
  ctr: number;
  ctor: number;
  conversionRate: number;
  bounceRate: number;
  unsubscribeRate: number;
}
