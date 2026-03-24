import { MeasurementPlan, WeeklyInsightReport } from "@/lib/types";

export const mockCurrentReport: WeeklyInsightReport = {
  reportDate: "2026-03-20",
  generatedAt: "2026-03-20T08:00:00Z",
  editionLabel: "ShieldPulse weekly executive readout",
  timeframeLabel: "Week ending Mar 20, 2026",
  overview:
    "Acquisition momentum improved after the store creative refresh, but activation weakened once the revised permission explainer added another trust checkpoint before users saw their first scan complete.",
  northStar: "Weekly protected devices per activated account",
  previousReportDate: "2026-03-13",
  kpis: [
    {
      id: "store-conversion",
      label: "Store conversion",
      value: "12.8%",
      change: "+1.4 pts WoW",
      trend: "up",
      note: "iOS screenshots featuring scam-call protection drove the strongest lift."
    },
    {
      id: "onboarding-completion",
      label: "Onboarding completion",
      value: "68%",
      change: "-5.2 pts WoW",
      trend: "down",
      note: "Largest drop happens after the new permission explainer screen."
    },
    {
      id: "first-scan-completion",
      label: "First scan completion",
      value: "54%",
      change: "-8.1 pts WoW",
      trend: "down",
      note: "Early warning: scan starts stayed stable while completions fell sharply."
    },
    {
      id: "weekly-protected-devices",
      label: "Weekly protected devices",
      value: "142k",
      change: "+6.3% WoW",
      trend: "up",
      note: "Users who complete a first scan are coming back for repeat protection moments."
    },
    {
      id: "trial-start-rate",
      label: "Trial start rate",
      value: "9.4%",
      change: "-0.8 pts WoW",
      trend: "down",
      note: "Intent is softest among users who have not enabled real-time protection."
    },
    {
      id: "paid-conversion",
      label: "Paid conversion",
      value: "37.1%",
      change: "-1.6 pts WoW",
      trend: "down",
      note: "Permission friction is leaking into subscription confidence."
    }
  ],
  workstreams: [
    {
      id: "acquisition-2026-03-20",
      workstream: "acquisition",
      headline: "Store conversion is rebounding, with iOS creative outperforming Android by a widening margin.",
      keyTension: "Top-of-funnel quality improved, but Android visitors still arrive with weaker intent and lower trust.",
      summary:
        "The creative refresh is doing its job, especially when scam-call and phishing protection are made concrete in the store listing. The next step is carrying that same promise into Google Play experiments instead of treating both stores as one motion.",
      updatedAt: "2026-03-20T08:00:00Z",
      evidence: [
        {
          id: "acq-app-store-connect",
          source: "App Store Connect",
          title: "Product page conversion rose after the iOS screenshot refresh.",
          summary: "Install conversion moved from 11.2% to 13.4% after security-proof creative replaced generic trust messaging.",
          url: "https://developer.apple.com/app-store-connect/",
          capturedAt: "2026-03-20T07:10:00Z",
          evidenceType: "store analytics",
          confidenceScore: 0.96,
          metric: "Product page CVR",
          change: "+2.2 pts"
        },
        {
          id: "acq-google-play",
          source: "Google Play Console",
          title: "Android store performance improved, but lagged the iOS lift.",
          summary: "Google Play conversion rose from 8.9% to 10.1%, suggesting the creative story still undersells product value on Android.",
          url: "https://play.google.com/console/about/",
          capturedAt: "2026-03-20T07:12:00Z",
          evidenceType: "store analytics",
          confidenceScore: 0.91,
          metric: "Listing CVR",
          change: "+1.2 pts"
        },
        {
          id: "acq-amplitude-channel",
          source: "Amplitude",
          title: "Paid social traffic converted best when the landing promise matched the store creative.",
          summary: "Visitors sourced from scam-call protection ads were 19% more likely to install than generic privacy-themed campaigns.",
          url: "https://amplitude.com/",
          capturedAt: "2026-03-20T07:18:00Z",
          evidenceType: "funnel analysis",
          confidenceScore: 0.86,
          metric: "Install rate by campaign",
          change: "+19%"
        }
      ],
      recommendations: [
        {
          id: "acq-rec-1",
          label: "Run a Google Play creative test using the iOS scam-call protection proof points.",
          confidence: 0.79,
          rationale: "The iOS lift came from making protection concrete. Android likely needs the same clarity rather than broader security language.",
          impact: "high impact",
          supportingEvidenceIds: ["acq-app-store-connect", "acq-google-play"]
        },
        {
          id: "acq-rec-2",
          label: "Tighten paid acquisition messaging around one hero outcome per campaign.",
          confidence: 0.68,
          rationale: "Campaigns that matched the store promise produced better install quality and lower drop-off before account creation.",
          impact: "medium impact",
          supportingEvidenceIds: ["acq-amplitude-channel"]
        }
      ]
    },
    {
      id: "activation-2026-03-20",
      workstream: "activation",
      headline: "The revised permission explainer improved comprehension but delayed first value enough to hurt activation.",
      keyTension: "Users understand the ask better, yet too many now encounter trust friction before they see protection working.",
      summary:
        "This is the clearest early warning in the report. Users are still starting onboarding at healthy rates, but fewer reach first scan completion because the new sequence asks for notification and real-time protection permissions before demonstrating product value.",
      updatedAt: "2026-03-20T08:00:00Z",
      evidence: [
        {
          id: "act-amplitude-funnel",
          source: "Amplitude",
          title: "Onboarding completion dropped most at the permission explainer step.",
          summary: "Completion fell from 73% to 68%, with a 12% relative increase in exits after the new trust education screen.",
          url: "https://amplitude.com/",
          capturedAt: "2026-03-20T07:22:00Z",
          evidenceType: "funnel analysis",
          confidenceScore: 0.97,
          metric: "Onboarding completion",
          change: "-5.2 pts"
        },
        {
          id: "act-firebase-stability",
          source: "Firebase Crashlytics",
          title: "Crash-free sessions remained stable, ruling out a technical failure.",
          summary: "Crash-free sessions stayed above 99.2%, which points to product flow friction rather than a stability regression.",
          url: "https://firebase.google.com/products/crashlytics",
          capturedAt: "2026-03-20T07:25:00Z",
          evidenceType: "stability telemetry",
          confidenceScore: 0.93,
          metric: "Crash-free sessions",
          change: "-0.1 pts"
        },
        {
          id: "act-support-sentiment",
          source: "Support sentiment",
          title: "Permission confusion increased in chat transcripts and app reviews.",
          summary: "The most common complaint was not distrust of the app, but uncertainty about why protection needed to be enabled before the first scan.",
          url: "https://www.zendesk.com/",
          capturedAt: "2026-03-20T07:31:00Z",
          evidenceType: "qualitative insight",
          confidenceScore: 0.82,
          metric: "Permission confusion mentions",
          change: "+24%"
        }
      ],
      recommendations: [
        {
          id: "act-rec-1",
          label: "Move the first quick scan ahead of the real-time protection permission request.",
          confidence: 0.88,
          rationale: "Users are more likely to grant trust-heavy permissions once they have seen protection value in action.",
          impact: "high impact",
          supportingEvidenceIds: ["act-amplitude-funnel", "act-support-sentiment"]
        },
        {
          id: "act-rec-2",
          label: "Keep the explainer, but trigger it just-in-time with a single proof point.",
          confidence: 0.73,
          rationale: "The content is useful; the sequencing is the problem. A shorter, contextual ask should preserve understanding without adding flow drag.",
          impact: "medium impact",
          supportingEvidenceIds: ["act-amplitude-funnel", "act-firebase-stability"]
        }
      ]
    },
    {
      id: "protection-2026-03-20",
      workstream: "protection",
      headline: "Users who reach a successful first scan are engaging more deeply with weekly protection than last month.",
      keyTension: "Core product value is sticky once users feel it, but too few new installs are making it across the activation line.",
      summary:
        "The encouraging signal is that protection behavior looks healthy downstream. Scan recurrence, weekly active protection, and crash stability all support the view that the product itself is resonating once users get there.",
      updatedAt: "2026-03-20T08:00:00Z",
      evidence: [
        {
          id: "pro-amplitude-retention",
          source: "Amplitude",
          title: "Seven-day retained protection usage improved among first-scan completers.",
          summary: "Users who completed a first scan were 11% more likely to trigger a second protection action within seven days.",
          url: "https://amplitude.com/",
          capturedAt: "2026-03-20T07:38:00Z",
          evidenceType: "cohort retention",
          confidenceScore: 0.9,
          metric: "Repeat protection actions",
          change: "+11%"
        },
        {
          id: "pro-firebase-performance",
          source: "Firebase Performance",
          title: "Protection workflows stayed fast even during the creative-driven install lift.",
          summary: "Median first-scan completion time held at 19 seconds, which suggests usage friction is primarily sequencing rather than performance.",
          url: "https://firebase.google.com/products/performance",
          capturedAt: "2026-03-20T07:40:00Z",
          evidenceType: "performance telemetry",
          confidenceScore: 0.87,
          metric: "First scan duration",
          change: "flat"
        },
        {
          id: "pro-weekly-device",
          source: "Warehouse snapshot",
          title: "Weekly protected devices continued to climb despite softer activation.",
          summary: "Existing users are maintaining strong protection behavior, cushioning the activation regression at the total-device level.",
          url: "https://aws.amazon.com/redshift/",
          capturedAt: "2026-03-20T07:45:00Z",
          evidenceType: "core KPI",
          confidenceScore: 0.84,
          metric: "Weekly protected devices",
          change: "+6.3%"
        }
      ],
      recommendations: [
        {
          id: "pro-rec-1",
          label: "Add a post-scan habit loop that prompts users to enable one recurring protection feature.",
          confidence: 0.77,
          rationale: "Users already return after a successful scan. A structured follow-up action should make that behavior more durable.",
          impact: "medium impact",
          supportingEvidenceIds: ["pro-amplitude-retention", "pro-weekly-device"]
        },
        {
          id: "pro-rec-2",
          label: "Instrument time-to-first-safe-state as a core protection metric.",
          confidence: 0.71,
          rationale: "Current usage telemetry shows what happens after activation, but not how quickly users reach a trustworthy first outcome.",
          impact: "watch item",
          supportingEvidenceIds: ["pro-firebase-performance"]
        }
      ]
    },
    {
      id: "retention-2026-03-20",
      workstream: "retention",
      headline: "Subscription intent is still healthy, but paid conversion softens when users never grant deeper protection access.",
      keyTension: "Pricing is not the main constraint right now; trust and permission confidence are acting as revenue gates.",
      summary:
        "The paywall is not broadly underperforming. Instead, the users least exposed to product value are the same ones least likely to start or convert from trial, creating a direct link between activation friction and revenue softness.",
      updatedAt: "2026-03-20T08:00:00Z",
      evidence: [
        {
          id: "ret-amplitude-paywall",
          source: "Amplitude",
          title: "Paid conversion is materially higher for users who grant real-time protection access.",
          summary: "Users who enabled real-time protection converted from trial at 44%, versus 21% for users who never granted access.",
          url: "https://amplitude.com/",
          capturedAt: "2026-03-20T07:50:00Z",
          evidenceType: "conversion analysis",
          confidenceScore: 0.95,
          metric: "Trial-to-paid conversion",
          change: "2.1x gap"
        },
        {
          id: "ret-app-store-rating",
          source: "App Store & Play reviews",
          title: "Ratings remained solid, but reviews increasingly call out setup complexity.",
          summary: "Average rating held at 4.6, yet review text mentions setup steps more often than price objections.",
          url: "https://developer.apple.com/app-store-connect/",
          capturedAt: "2026-03-20T07:54:00Z",
          evidenceType: "voice of customer",
          confidenceScore: 0.81,
          metric: "Setup complexity mentions",
          change: "+18%"
        },
        {
          id: "ret-revenue-dashboard",
          source: "Revenue dashboard",
          title: "Trial starts dipped slightly even as store conversion rose.",
          summary: "More users entered the product, but fewer advanced into high-intent premium moments because too many stalled in activation.",
          url: "https://aws.amazon.com/redshift/",
          capturedAt: "2026-03-20T07:58:00Z",
          evidenceType: "revenue telemetry",
          confidenceScore: 0.9,
          metric: "Trial start rate",
          change: "-0.8 pts"
        }
      ],
      recommendations: [
        {
          id: "ret-rec-1",
          label: "Retime the premium ask to immediately follow a successful first scan outcome.",
          confidence: 0.86,
          rationale: "Users who have seen value and granted trust-heavy permissions convert at much stronger rates, suggesting the current paywall timing is too early for many users.",
          impact: "high impact",
          supportingEvidenceIds: ["ret-amplitude-paywall", "ret-revenue-dashboard"]
        },
        {
          id: "ret-rec-2",
          label: "Launch a win-back segment for stalled trial users who abandoned before enabling protection.",
          confidence: 0.7,
          rationale: "The drop appears behavioral rather than price-led, so education-focused recovery messaging should outperform discounting.",
          impact: "medium impact",
          supportingEvidenceIds: ["ret-app-store-rating", "ret-amplitude-paywall"]
        }
      ]
    }
  ]
};

export const mockPreviousReport: WeeklyInsightReport = {
  reportDate: "2026-03-13",
  generatedAt: "2026-03-13T08:00:00Z",
  editionLabel: "ShieldPulse weekly archive readout",
  timeframeLabel: "Week ending Mar 13, 2026",
  overview:
    "The business was balanced last week: acquisition was flatter, activation was healthier, and subscription intent was steadier because users reached first protection value more quickly.",
  northStar: "Weekly protected devices per activated account",
  previousReportDate: "2026-03-06",
  kpis: [
    {
      id: "store-conversion",
      label: "Store conversion",
      value: "11.4%",
      change: "+0.3 pts WoW",
      trend: "up",
      note: "Creative was more generic, but still improved slightly after metadata cleanup."
    },
    {
      id: "onboarding-completion",
      label: "Onboarding completion",
      value: "73%",
      change: "+0.6 pts WoW",
      trend: "up",
      note: "Users moved quickly from install to first protection value."
    },
    {
      id: "first-scan-completion",
      label: "First scan completion",
      value: "62%",
      change: "+1.1 pts WoW",
      trend: "up",
      note: "The old onboarding flow got more users to a successful first moment."
    },
    {
      id: "weekly-protected-devices",
      label: "Weekly protected devices",
      value: "133k",
      change: "+4.8% WoW",
      trend: "up",
      note: "Protection usage remained solid even before the creative lift."
    },
    {
      id: "trial-start-rate",
      label: "Trial start rate",
      value: "10.2%",
      change: "+0.2 pts WoW",
      trend: "up",
      note: "Premium intent tracked closely with stronger activation."
    },
    {
      id: "paid-conversion",
      label: "Paid conversion",
      value: "38.7%",
      change: "+0.5 pts WoW",
      trend: "up",
      note: "Users who reached a quick first scan converted at a stable rate."
    }
  ],
  workstreams: [
    {
      id: "acquisition-2026-03-13",
      workstream: "acquisition",
      headline: "Traffic quality was steady, but store messaging lacked a sharp hero narrative.",
      keyTension: "The funnel was healthier downstream, yet the top of funnel was still underselling the product.",
      summary:
        "This week served as the baseline before the creative refresh. Conversion was serviceable, but not distinctive enough to show the app's strongest differentiator in store.",
      updatedAt: "2026-03-13T08:00:00Z",
      evidence: [
        {
          id: "prev-acq-app-store",
          source: "App Store Connect",
          title: "Store conversion held steady before the creative refresh.",
          summary: "Conversion gains were modest when the listing focused on general antivirus language rather than specific mobile risks.",
          url: "https://developer.apple.com/app-store-connect/",
          capturedAt: "2026-03-13T07:10:00Z",
          evidenceType: "store analytics",
          confidenceScore: 0.9,
          metric: "Product page CVR",
          change: "+0.3 pts"
        }
      ],
      recommendations: [
        {
          id: "prev-acq-rec",
          label: "Test more specific mobile-risk messaging in the store listing.",
          confidence: 0.72,
          rationale: "The product had stronger downstream behavior than the store conversion suggested.",
          impact: "medium impact",
          supportingEvidenceIds: ["prev-acq-app-store"]
        }
      ]
    },
    {
      id: "activation-2026-03-13",
      workstream: "activation",
      headline: "Activation was healthy before the permission explainer redesign introduced extra friction.",
      keyTension: "Users moved quickly, but the team had limited visibility into which permission moments created hesitation.",
      summary:
        "This was the cleaner activation week. Users got to first value quickly, but instrumentation around the permission sequence was still shallow, which made it easy to miss future regressions.",
      updatedAt: "2026-03-13T08:00:00Z",
      evidence: [
        {
          id: "prev-act-amplitude",
          source: "Amplitude",
          title: "Onboarding and first scan completion both tracked above plan.",
          summary: "Users moved through the old flow with fewer trust-heavy interruptions.",
          url: "https://amplitude.com/",
          capturedAt: "2026-03-13T07:16:00Z",
          evidenceType: "funnel analysis",
          confidenceScore: 0.94,
          metric: "First scan completion",
          change: "+1.1 pts"
        }
      ],
      recommendations: [
        {
          id: "prev-act-rec",
          label: "Instrument permission-view, permission-denied, and scan-start events before further onboarding changes.",
          confidence: 0.8,
          rationale: "The healthy baseline made it clear more granular sequencing telemetry was needed before iterating on trust prompts.",
          impact: "watch item",
          supportingEvidenceIds: ["prev-act-amplitude"]
        }
      ]
    },
    {
      id: "protection-2026-03-13",
      workstream: "protection",
      headline: "Protection behavior was already durable once users completed their first scan.",
      keyTension: "Usage quality was not the constraint; getting more users there was always the bigger lever.",
      summary:
        "The core protection experience was proving itself even before acquisition improved. The current week's activation regression matters because it interrupts a funnel that was otherwise compounding well.",
      updatedAt: "2026-03-13T08:00:00Z",
      evidence: [
        {
          id: "prev-pro-retention",
          source: "Amplitude",
          title: "Repeat protection behavior stayed strong.",
          summary: "Users who completed a scan commonly returned for a second protection action within the same week.",
          url: "https://amplitude.com/",
          capturedAt: "2026-03-13T07:24:00Z",
          evidenceType: "retention analysis",
          confidenceScore: 0.88,
          metric: "Repeat protection actions",
          change: "+8%"
        }
      ],
      recommendations: [
        {
          id: "prev-pro-rec",
          label: "Preserve a fast time-to-value path while expanding deeper protection education.",
          confidence: 0.75,
          rationale: "The product was earning retention through quick value, which should remain the centerpiece of future onboarding work.",
          impact: "medium impact",
          supportingEvidenceIds: ["prev-pro-retention"]
        }
      ]
    },
    {
      id: "retention-2026-03-13",
      workstream: "retention",
      headline: "Revenue metrics were healthier when activation remained simple and trust cues came later.",
      keyTension: "Subscription performance improved when the premium moment followed value instead of preceding it.",
      summary:
        "The baseline week supports the current hypothesis: the revenue softness in the latest report is downstream of activation changes, not a standalone monetization problem.",
      updatedAt: "2026-03-13T08:00:00Z",
      evidence: [
        {
          id: "prev-ret-trial",
          source: "Revenue dashboard",
          title: "Trial start and trial-to-paid conversion were both ahead of this week's numbers.",
          summary: "Users reached premium consideration after seeing protection in action, which reduced trust-related hesitation.",
          url: "https://aws.amazon.com/redshift/",
          capturedAt: "2026-03-13T07:31:00Z",
          evidenceType: "revenue telemetry",
          confidenceScore: 0.9,
          metric: "Paid conversion",
          change: "+0.5 pts"
        }
      ],
      recommendations: [
        {
          id: "prev-ret-rec",
          label: "Use the old activation-to-paywall timing as the control in the next experiment.",
          confidence: 0.82,
          rationale: "The week-over-week comparison suggests the sequencing change is the most important variable to isolate.",
          impact: "high impact",
          supportingEvidenceIds: ["prev-ret-trial"]
        }
      ]
    }
  ]
};

export const mockMeasurementPlan: MeasurementPlan = {
  title: "ShieldPulse measurement plan",
  summary:
    "A compact mobile analytics plan built to show how a product analyst would instrument activation, track trust-sensitive protection usage, and connect feature behavior to subscription outcomes without over-collecting personal data.",
  trackedEvents: [
    {
      event: "store_listing_view / product_page_view",
      whyItMatters: "Lets acquisition analysis connect creative changes to qualified installs by store and campaign.",
      owner: "Growth + Product analytics"
    },
    {
      event: "install_started / install_completed",
      whyItMatters: "Separates store conversion from downstream product drop-off and highlights traffic quality issues.",
      owner: "Growth"
    },
    {
      event: "onboarding_completed",
      whyItMatters: "Core activation checkpoint for measuring whether users reach the protected state at all.",
      owner: "Mobile product"
    },
    {
      event: "permission_prompt_viewed / permission_granted_realtime",
      whyItMatters: "Captures the trust decision most tightly tied to protection depth and paid conversion.",
      owner: "Mobile product"
    },
    {
      event: "scan_started / scan_completed",
      whyItMatters: "Defines the first-value moment and supports time-to-value analysis.",
      owner: "Security product"
    },
    {
      event: "trial_started / subscription_converted / churn_risk_flagged",
      whyItMatters: "Connects product behavior and trust signals to monetization outcomes.",
      owner: "Lifecycle + Finance"
    }
  ],
  funnelSteps: [
    {
      step: "Store listing view -> install completed",
      metric: "Store conversion rate",
      benchmark: "12%+ healthy"
    },
    {
      step: "Install completed -> onboarding completed",
      metric: "Activation rate",
      benchmark: "70%+ target"
    },
    {
      step: "Onboarding completed -> first scan completed",
      metric: "Time to first value",
      benchmark: "< 2 min median"
    },
    {
      step: "First scan completed -> real-time protection enabled",
      metric: "Deep trust adoption",
      benchmark: "55%+ target"
    },
    {
      step: "Trial started -> subscription converted",
      metric: "Trial-to-paid conversion",
      benchmark: "40% target"
    }
  ],
  instrumentationGaps: [
    {
      issue: "Permission prompts are not segmented by surface or copy variant.",
      risk: "The team can see that trust friction exists, but not which screen or message is creating it.",
      fix: "Add prompt_viewed, prompt_denied, and prompt_accepted events with variant metadata."
    },
    {
      issue: "The current model tracks scan completion but not time to safe state.",
      risk: "Slow or hesitant activation experiences can hide behind stable completion rates.",
      fix: "Track time from install to first successful protection action and expose it in weekly reporting."
    },
    {
      issue: "Store analytics and in-product cohorts are not stitched at the campaign-story level.",
      risk: "Creative tests can look successful even when they drive lower-intent installs downstream.",
      fix: "Pass acquisition story tags into the product analytics layer and slice activation by creative promise."
    }
  ],
  guardrails: [
    {
      title: "Collect behavior, not sensitive content",
      guidance: "Track protection actions, conversion points, and prompt outcomes without storing scanned file names, message content, or personally identifying security artifacts."
    },
    {
      title: "Only keep metadata needed for product decisions",
      guidance: "Use retention windows and coarse attribution fields so analytics stays useful without becoming a shadow user database."
    },
    {
      title: "Limit event volume to decision-ready telemetry",
      guidance: "Prefer milestone events and curated properties over high-cardinality logging that increases cost without sharpening product choices."
    }
  ],
  experiments: [
    {
      name: "Scan before permission",
      hypothesis: "Showing a quick protection win before the real-time protection request will lift onboarding completion and first scan completion.",
      successMetric: "Onboarding completion and first scan completion",
      expectedLift: "+4 to +6 pts"
    },
    {
      name: "Permission copy by threat type",
      hypothesis: "Explaining real-time protection with scam-call examples will outperform generic safety copy on Android.",
      successMetric: "Permission grant rate",
      expectedLift: "+8% relative"
    },
    {
      name: "Paywall after first value",
      hypothesis: "Moving the premium ask to immediately after a successful first scan will recover trial starts and trial-to-paid conversion.",
      successMetric: "Trial start rate and trial-to-paid conversion",
      expectedLift: "+0.7 pts trial start, +2 pts paid conversion"
    }
  ]
};

export function getMockReport(date?: string): WeeklyInsightReport {
  if (!date || date === mockCurrentReport.reportDate) {
    return mockCurrentReport;
  }

  if (date === mockPreviousReport.reportDate) {
    return mockPreviousReport;
  }

  return {
    ...mockPreviousReport,
    reportDate: date,
    timeframeLabel: `Archive week ending ${date}`,
    editionLabel: `ShieldPulse archive readout · ${date}`
  };
}
