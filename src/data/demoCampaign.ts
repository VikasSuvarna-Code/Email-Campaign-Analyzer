import { FullCampaignAnalysis } from '../types/campaign';
import { calculateCampaignRates } from '../utils/metrics';

const demoMetrics = {
  sent: 10000,
  delivered: 9850,
  opens: 3420,
  clicks: 684,
  conversions: 137,
  unsubscribes: 42,
  bounces: 150,
};

const demoRates = calculateCampaignRates(demoMetrics);

export const DEMO_CAMPAIGN: FullCampaignAnalysis = {
  id: 'demo-summer-product-launch',
  campaignName: 'Summer Product Launch',
  subject: 'Your exclusive early access starts today',
  previewText: 'Unlock 35% off the new SolarWave Collection before public release.',
  senderName: 'Elena Vance from Lumina Gear',
  senderEmail: 'elena@luminagear.com',
  body: `Hi Alex,

The wait is finally over! As one of our most valued VIP community members, you get first dibs on the brand-new SolarWave Collection 24 hours before everyone else.

We designed this collection using aerospace-grade recycled titanium and breathable merino weave, engineered specifically for high-output summer adventures. Every piece is water-resistant, ultra-lightweight, and tested in extreme desert heat.

Limited time offer!!! Take 35% off your order with code VIPEARLY at checkout.

Act now to claim your reserved size before stock depletes:

[Click Here]

We also want to remind you that our inventory is strictly capped at 500 units per colorway for this initial production run, so popular sizes typically sell out within the first 6 hours of our private release window.

If you have any questions about fit or sizing, just reply to this email directly—our concierge team is standing by to help you choose the right gear.

Warm regards,
Elena Vance
Head of Product, Lumina Gear

P.S. Free worldwide carbon-neutral shipping is included on all VIP early access orders over $100.`,
  metrics: demoMetrics,
  calculatedRates: demoRates,
  isDemo: true,
  analyzedAt: '2026-09-29T22:30:00Z',
  healthScore: {
    overall: 82,
    status: 'Good',
    summaryRationale: 'Strong value proposition and healthy 34.72% open rate with 20.00% CTOR. Identified areas for improvement include generic CTA button text ("Click Here"), high-urgency spam-risk punctuation ("Limited time offer!!!"), and missing clear return policy guarantee.',
    breakdown: {
      subjectLine: {
        score: 86,
        label: 'Strong curiosity and VIP exclusivity',
        explanation: 'The phrase "exclusive early access starts today" taps into prestige and promptness without triggering major spam filters.'
      },
      emailContent: {
        score: 79,
        label: 'Compelling narrative with minor friction',
        explanation: 'Clear storytelling and material benefits, but contains a dense middle paragraph and overzealous punctuation.'
      },
      ctaQuality: {
        score: 68,
        label: 'Vague anchor wording',
        explanation: 'Using "Click Here" reduces conversion intent compared to action-oriented phrasing like "Claim Your SolarWave Gear".'
      },
      readability: {
        score: 88,
        label: 'Grade 7.4 (Accessible & Scannable)',
        explanation: 'Short introductory sentences and clear paragraph progression keep reading friction minimal.'
      },
      personalization: {
        score: 84,
        label: 'Good token utilization',
        explanation: 'First-name merge token used naturally with community-tier acknowledgement.'
      },
      engagementSignals: {
        score: 89,
        label: 'High CTOR (20.0%)',
        explanation: '1 in 5 subscribers who opened the email clicked through, indicating strong audience alignment.'
      },
      conversionPotential: {
        score: 80,
        label: 'Healthy conversion velocity (1.39%)',
        explanation: 'Clear VIP discount incentive drives checkouts, though adding a visual product summary would lift conversion rate.'
      }
    }
  },
  subjectAnalysis: {
    currentSubject: 'Your exclusive early access starts today',
    length: 42,
    wordCount: 6,
    clarityScore: 92,
    relevanceScore: 88,
    curiosityScore: 85,
    urgencyScore: 78,
    personalizationScore: 72,
    emotionalAppeal: 'VIP Privilege & Exclusivity',
    ctaStrength: 'Implied immediate action',
    spamRiskRating: 'Low',
    spamRiskKeywords: [],
    strengths: [
      'Under 50 characters, ensuring 100% visibility on mobile inboxes',
      'Personal possessive ("Your") creates direct psychological ownership',
      'Avoids trigger words like "FREE $$$" or all-caps shouting'
    ],
    suggestions: [
      {
        subject: 'Alex, early VIP access to SolarWave is open (24h head start)',
        whyItWorks: 'Pairs personal token with the concrete product name and a specific timeframe instead of generic early access.',
        whatChanged: 'Added subscriber name, collection name, and 24-hour boundary.',
        angle: 'Urgent + Direct Personalization',
        characterCount: 61
      },
      {
        subject: 'Inside: First look at the recycled titanium SolarWave series',
        whyItWorks: 'Highlights the most tangible and premium product feature (recycled titanium) to spark material curiosity.',
        whatChanged: 'Shifted focus from sales event to product craftsmanship.',
        angle: 'Curiosity & Material Value',
        characterCount: 60
      },
      {
        subject: 'Your 35% VIP launch code is waiting (SolarWave)',
        whyItWorks: 'Lead with the tangible monetary reward while keeping the exclusive tone.',
        whatChanged: 'Explicitly surfaced the 35% discount in the subject line.',
        angle: 'Direct Benefit / Offer',
        characterCount: 48
      },
      {
        subject: 'The SolarWave drop is live for VIP members',
        whyItWorks: 'Minimalist street-style drop framing that resonates with outdoor/lifestyle enthusiasts.',
        whatChanged: 'Shorter, conversational drop syntax.',
        angle: 'Minimalist / Modern Drop',
        characterCount: 42
      }
    ]
  },
  contentAnalysis: {
    readabilityGradeLevel: '7th Grade (Flesch-Kincaid: 74.2)',
    readingTimeSeconds: 48,
    wordCount: 198,
    sentenceCount: 11,
    avgSentenceLength: 18,
    paragraphCount: 7,
    tone: 'Confident, enthusiastic, and exclusive',
    personalizationDepth: 'First name greeting + VIP segment context',
    valuePropositionClarity: 'High: Recycled titanium & merino weave specs are concrete',
    ctaClarity: 'Needs attention: Generic "Click Here" anchor text',
    contentStructureGrade: 'A-',
    mobileReadabilityAssessment: 'Great: Single column layout with generous white space and legible sentence blocks.',
    jargonIdentified: ['Colorway', 'High-output', 'Merino weave'],
    potentialSpamPhrases: ['Limited time offer!!!'],
    missingInformation: ['Specific return/exchange policy window', 'Starting price points of key items'],
    annotations: [
      {
        id: 'ann-1',
        quote: 'Limited time offer!!!',
        type: 'spam_risk',
        severity: 'warning',
        label: 'Excessive Punctuation & Urgency Cliché',
        explanation: 'Triple exclamation marks paired with "limited time offer" trigger aggressive filtering in Outlook and Gmail Spam Assassin heuristics. Consider replacing with specific deadline phrasing.',
        suggestedReplacement: 'Exclusive launch perk: Save 35% with code VIPEARLY through Thursday midnight.'
      },
      {
        id: 'ann-2',
        quote: '[Click Here]',
        type: 'cta',
        severity: 'critical',
        label: 'Low-Intent CTA Anchor',
        explanation: 'Generic "Click Here" links depress click-through momentum and provide zero context on assistive screen readers. Action-oriented verbs with the promised payoff perform significantly higher.',
        suggestedReplacement: 'Explore the SolarWave Collection →'
      },
      {
        id: 'ann-3',
        quote: 'We designed this collection using aerospace-grade recycled titanium and breathable merino weave, engineered specifically for high-output summer adventures. Every piece is water-resistant, ultra-lightweight, and tested in extreme desert heat.',
        type: 'readability',
        severity: 'suggestion',
        label: 'Feature-Dense Paragraph',
        explanation: 'Two multi-clause sentences packed with specifications can lead to skimming. Formatting into 3 quick bullet points boosts retention by ~24%.',
        suggestedReplacement: '• Aerospace-grade recycled titanium hardware\n• Breathable merino weave for desert heat\n• 100% water-resistant & ultra-lightweight'
      },
      {
        id: 'ann-4',
        quote: 'just reply to this email directly—our concierge team is standing by',
        type: 'clarity',
        severity: 'positive',
        label: 'High-Trust Engagement Signal',
        explanation: 'Inviting direct replies directly increases sender domain reputation and inbox placement across Gmail/Yahoo postmasters.',
      }
    ]
  },
  insights: {
    strengths: [
      {
        title: 'Exceptional Click-to-Open Ratio (20.00%)',
        detail: '684 clicks from 3,420 opens demonstrates that once subscribers opened the email, the core product offering generated strong intent.',
        evidence: '684 clicks / 3,420 opens = 20.00% CTOR vs 12.1% industry baseline.'
      },
      {
        title: 'Negligible Bounce Rate (1.50%)',
        detail: 'List hygiene is sound with 9,850 delivered out of 10,000 sent.',
        evidence: '150 bounces across 10,000 sends (1.50%).'
      },
      {
        title: 'Authentic VIP Recognition',
        detail: 'Opening sentence acknowledges subscriber tenure and delivers tangible utility (24-hour head start).',
        evidence: '"As one of our most valued VIP community members..."'
      }
    ],
    weaknesses: [
      {
        title: 'Generic Call-to-Action Anchor',
        detail: 'Using "[Click Here]" rather than a descriptive benefit button creates cognitive friction at the decisive click moment.',
        evidence: 'Email body CTA is verbatim "[Click Here]".'
      },
      {
        title: 'Aggressive Urgency Punctuation',
        detail: 'Triple exclamation marks in "Limited time offer!!!" increase the probability of promotional tab relegation.',
        evidence: 'Found "Limited time offer!!!" in paragraph 3.'
      }
    ],
    opportunities: [
      {
        title: 'Bulletize Product Highlights',
        detail: 'Transforming the titanium and merino weave specifications into a 3-point bullet list will allow mobile skimmers to absorb the unique selling points faster.',
        evidence: 'Middle paragraph contains 37 words across dense multi-clause sentences.'
      },
      {
        title: 'Test Tier-Specific Urgency Countdown',
        detail: 'A/B testing a live countdown timer or strict hour cutoff (e.g., "Ends in 24 Hours") vs vague "Limited time" is projected to increase click conversion.',
        evidence: 'Campaign already has 500-unit cap that could be visually surfaced.'
      }
    ],
    risks: [
      {
        title: 'Missing Clear Return Policy',
        detail: 'For early product drops with new material specs, lack of reassurance on free exchanges can introduce checkout hesitation.',
        evidence: 'Email references sizing queries but omits return policy reassurance.'
      },
      {
        title: 'Unsubscribe Spike Risk if Frequency Increases',
        detail: '42 unsubscribes (0.43%) is slightly elevated above the 0.25% luxury retail benchmark.',
        evidence: '42 unsubscribes / 9,850 delivered = 0.43%.'
      }
    ]
  },
  recommendations: [
    {
      id: 'rec-1',
      recommendation: 'Upgrade Call-to-Action from "[Click Here]" to High-Intent Action Verb',
      reason: 'Generic "Click Here" forces the reader to guess where they will land, suppressing click momentum.',
      expectedAreaOfImprovement: 'Click-Through Rate (CTR) and Click-to-Open Rate (CTOR)',
      priority: 'High',
      suggestedExperiment: 'A/B test "[Click Here]" against a high-contrast button labeled "Shop the SolarWave Drop →".'
    },
    {
      id: 'rec-2',
      recommendation: 'Remove Multiple Exclamation Points to Safeguard Inbox Deliverability',
      reason: 'Punctuation bursts like "Limited time offer!!!" trigger modern spam heuristic flags and depress primary inbox delivery.',
      expectedAreaOfImprovement: 'Primary Inbox Placement and Open Rate stability',
      priority: 'High',
      suggestedExperiment: 'Test standard punctuation with deadline detail: "VIP access: Save 35% with code VIPEARLY through Thursday."'
    },
    {
      id: 'rec-3',
      recommendation: 'Break Technical Specifications into a 3-Point Bullet Stack',
      reason: 'Over 65% of promotional emails are opened on mobile devices where dense text blocks are skimmed over in under 3 seconds.',
      expectedAreaOfImprovement: 'Reading Completion & Dwell Time',
      priority: 'Medium',
      suggestedExperiment: 'Test paragraph format vs 3 clean bullet points highlighting Titanium, Merino Weave, and Desert Testing.'
    },
    {
      id: 'rec-4',
      recommendation: 'Add Sizing Exchange Guarantee Adjacent to CTA',
      reason: 'Outdoor apparel buyers hesitate when buying new silhouettes without explicit fit guarantees.',
      expectedAreaOfImprovement: 'On-site Conversion Rate from Email Traffic',
      priority: 'Medium',
      suggestedExperiment: 'Add micro-copy under the CTA button: "Free 30-day size exchanges & prepaid return labels."'
    }
  ],
  predictedEngagement: {
    likelyHighPerformingSegments: [
      'Repeat VIP purchasers with >2 previous orders',
      'Subscribers who opened previous outdoor seasonal drops',
      'Users clicking between 7:00 AM – 9:30 AM local time'
    ],
    atRiskSegments: [
      'Subscribers inactive for >90 days (higher unsubscribe probability)',
      'Subscribers accessing via older corporate Outlook desktop clients without modern CSS support'
    ],
    deviceBehaviorEstimate: {
      desktopShare: 38,
      mobileShare: 62,
      notes: 'Mobile opens dominate early morning hours; ensure button target is at least 48px high for thumb taps.'
    },
    timingHypothesis: 'Tuesday or Thursday 8:00 AM recipient local time delivers highest CTOR for exclusive apparel releases.'
  }
};
