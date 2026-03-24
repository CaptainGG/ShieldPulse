export type WorkstreamSlug = "acquisition" | "activation" | "protection" | "retention";

export type KpiMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  note: string;
};

export type EvidenceItem = {
  id: string;
  source: string;
  title: string;
  summary: string;
  url: string;
  capturedAt: string;
  evidenceType: string;
  confidenceScore: number;
  metric: string;
  change: string;
};

export type Recommendation = {
  id: string;
  label: string;
  confidence: number;
  rationale: string;
  impact: "high impact" | "medium impact" | "watch item";
  supportingEvidenceIds: string[];
};

export type WorkstreamInsight = {
  id: string;
  workstream: WorkstreamSlug;
  headline: string;
  keyTension: string;
  summary: string;
  updatedAt: string;
  recommendations: Recommendation[];
  evidence: EvidenceItem[];
};

export type WeeklyInsightReport = {
  reportDate: string;
  generatedAt: string;
  editionLabel: string;
  timeframeLabel: string;
  overview: string;
  northStar: string;
  previousReportDate: string;
  kpis: KpiMetric[];
  workstreams: WorkstreamInsight[];
};

export type EventSpec = {
  event: string;
  whyItMatters: string;
  owner: string;
};

export type FunnelStep = {
  step: string;
  metric: string;
  benchmark: string;
};

export type InstrumentationGap = {
  issue: string;
  risk: string;
  fix: string;
};

export type Guardrail = {
  title: string;
  guidance: string;
};

export type ExperimentPlan = {
  name: string;
  hypothesis: string;
  successMetric: string;
  expectedLift: string;
};

export type AnalyticsInstrumentationEvent = {
  name: string;
  trigger: string;
  amplitudeSurface: string;
  keyProperties: string[];
};

export type AnalyticsInstrumentationProperty = {
  property: string;
  description: string;
  example: string;
};

export type AnalyticsInstrumentationPlan = {
  summary: string;
  cohortDimensions: string[];
  events: AnalyticsInstrumentationEvent[];
  exampleProperties: AnalyticsInstrumentationProperty[];
};

export type MeasurementPlan = {
  title: string;
  summary: string;
  trackedEvents: EventSpec[];
  funnelSteps: FunnelStep[];
  instrumentationGaps: InstrumentationGap[];
  guardrails: Guardrail[];
  experiments: ExperimentPlan[];
  analyticsInstrumentation: AnalyticsInstrumentationPlan;
};

export const workstreamMeta: Record<
  WorkstreamSlug,
  { label: string; accent: string; description: string }
> = {
  acquisition: {
    label: "Acquisition",
    accent: "#6bd2c1",
    description: "Store conversion, install quality, and creative performance."
  },
  activation: {
    label: "Activation",
    accent: "#ffbf69",
    description: "Onboarding completion, permission trust, and time to first value."
  },
  protection: {
    label: "Protection Usage",
    accent: "#7dd3fc",
    description: "Scan completion, habit formation, and weekly protected devices."
  },
  retention: {
    label: "Retention & Revenue",
    accent: "#fb7185",
    description: "Trial starts, paid conversion, churn risk, and rating health."
  }
};
