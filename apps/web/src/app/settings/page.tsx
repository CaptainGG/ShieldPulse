import { SettingsPageContent } from "@/components/settings-page-content";
import { getMeasurementPlan } from "@/lib/api";

export default async function SettingsPage() {
  const plan = await getMeasurementPlan();

  return <SettingsPageContent plan={plan} />;
}
