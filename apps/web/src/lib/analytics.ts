"use client";

import { useEffect, useRef } from "react";

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY?.trim() ?? "";
const ENABLE_LOCAL_ANALYTICS_DEBUG = process.env.NEXT_PUBLIC_ENABLE_LOCAL_ANALYTICS_DEBUG === "true";

export type AnalyticsEventName =
  | "weekly_readout_viewed"
  | "prior_week_compared"
  | "measurement_plan_viewed"
  | "workstream_section_viewed"
  | "evidence_pack_opened"
  | "source_reference_clicked"
  | "experiment_backlog_item_viewed";

type AnalyticsSurface = "weekly_readout" | "measurement_plan" | "evidence_pack";

export type AnalyticsEventPropertiesMap = {
  weekly_readout_viewed: {
    report_date: string;
    surface: AnalyticsSurface;
    archive_mode: boolean;
  };
  prior_week_compared: {
    report_date: string;
    surface: AnalyticsSurface;
    archive_mode: true;
  };
  measurement_plan_viewed: {
    surface: AnalyticsSurface;
  };
  workstream_section_viewed: {
    report_date: string;
    workstream: string;
    surface: AnalyticsSurface;
    archive_mode: boolean;
  };
  evidence_pack_opened: {
    report_date: string;
    workstream: string;
    recommendation_id: string;
    surface: AnalyticsSurface;
    archive_mode: boolean;
  };
  source_reference_clicked: {
    report_date: string;
    workstream: string;
    recommendation_id: string;
    evidence_source: string;
    surface: AnalyticsSurface;
    archive_mode: boolean;
  };
  experiment_backlog_item_viewed: {
    experiment_name: string;
    surface: AnalyticsSurface;
  };
};

export type AnalyticsUserProperties = {
  app_name?: string;
  project_type?: string;
  current_surface?: AnalyticsSurface;
  analytics_mode?: "amplitude" | "local_debug" | "disabled";
};

type AnalyticsMode = NonNullable<AnalyticsUserProperties["analytics_mode"]>;

type AmplitudeModule = typeof import("@amplitude/analytics-browser");

let amplitudeModulePromise: Promise<AmplitudeModule | null> | null = null;
let initializationPromise: Promise<void> | null = null;

function analyticsMode(): AnalyticsMode {
  if (AMPLITUDE_API_KEY) {
    return "amplitude";
  }

  if (ENABLE_LOCAL_ANALYTICS_DEBUG) {
    return "local_debug";
  }

  return "disabled";
}

async function getAmplitudeModule(): Promise<AmplitudeModule | null> {
  if (typeof window === "undefined" || !AMPLITUDE_API_KEY) {
    return null;
  }

  amplitudeModulePromise ??= import("@amplitude/analytics-browser");
  return amplitudeModulePromise;
}

function logLocalAnalytics(eventName: string, payload: Record<string, unknown>) {
  if (!ENABLE_LOCAL_ANALYTICS_DEBUG) {
    return;
  }

  console.info("[shieldpulse-analytics]", eventName, payload);
}

export async function initAnalytics(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  initializationPromise ??= (async () => {
    const amplitude = await getAmplitudeModule();

    if (!amplitude) {
      logLocalAnalytics("analytics_init", { analytics_mode: analyticsMode() });
      return;
    }

    amplitude.init(AMPLITUDE_API_KEY, {
      autocapture: false,
      defaultTracking: false,
      logLevel: ENABLE_LOCAL_ANALYTICS_DEBUG ? amplitude.Types.LogLevel.Debug : amplitude.Types.LogLevel.Warn
    });

    const identify = new amplitude.Identify();
    identify.set("app_name", "ShieldPulse");
    identify.set("project_type", "portfolio_case_study");
    identify.set("analytics_mode", analyticsMode());
    amplitude.identify(identify);
  })();

  await initializationPromise;
}

export async function identifyAnalyticsUser(properties: AnalyticsUserProperties): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  await initAnalytics();
  const amplitude = await getAmplitudeModule();

  if (!amplitude) {
    logLocalAnalytics("identify", properties);
    return;
  }

  const identify = new amplitude.Identify();

  Object.entries(properties).forEach(([key, value]) => {
    if (value) {
      identify.set(key, value);
    }
  });

  amplitude.identify(identify);
}

export async function trackAnalyticsEvent<T extends AnalyticsEventName>(
  eventName: T,
  properties: AnalyticsEventPropertiesMap[T]
): Promise<void> {
  await initAnalytics();

  const amplitude = await getAmplitudeModule();

  if (!amplitude) {
    logLocalAnalytics(eventName, properties);
    return;
  }

  amplitude.track(eventName, properties);
}

export function useTrackOnceOnView<T extends AnalyticsEventName>(
  eventName: T,
  properties: AnalyticsEventPropertiesMap[T],
  dependencyKey: string,
  options: IntersectionObserverInit = { threshold: 0.45 }
) {
  const ref = useRef<HTMLElement | null>(null);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || hasTrackedRef.current || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      if (!entry?.isIntersecting || hasTrackedRef.current) {
        return;
      }

      hasTrackedRef.current = true;
      void trackAnalyticsEvent(eventName, properties);
      observer.disconnect();
    }, options);

    observer.observe(node);

    return () => observer.disconnect();
  }, [dependencyKey, eventName, options, properties]);

  return ref;
}
