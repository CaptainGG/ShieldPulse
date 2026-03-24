import { getMockReport, mockCurrentReport, mockMeasurementPlan } from "@/lib/mock-data";
import { MeasurementPlan, WeeklyInsightReport } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

async function safeJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return (await response.json()) as T;
}

function isWeeklyInsightReport(payload: unknown): payload is WeeklyInsightReport {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Partial<WeeklyInsightReport>;
  return Array.isArray(candidate.kpis) && Array.isArray(candidate.workstreams) && typeof candidate.reportDate === "string";
}

export async function getLatestReport(): Promise<WeeklyInsightReport> {
  try {
    const payload = await safeJson<unknown>(`${API_BASE_URL}/api/v1/digest/latest`, {
      next: { revalidate: 300 }
    });

    return isWeeklyInsightReport(payload) ? payload : mockCurrentReport;
  } catch {
    return mockCurrentReport;
  }
}

export async function getReportByDate(date: string): Promise<WeeklyInsightReport> {
  try {
    const payload = await safeJson<unknown>(`${API_BASE_URL}/api/v1/digest/history?date=${date}`, {
      next: { revalidate: 300 }
    });

    return isWeeklyInsightReport(payload) ? payload : getMockReport(date);
  } catch {
    return getMockReport(date);
  }
}

export async function getMeasurementPlan(): Promise<MeasurementPlan> {
  return mockMeasurementPlan;
}
