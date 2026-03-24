import { DigestExperience } from "@/components/digest-experience";
import { getLatestReport } from "@/lib/api";

export default async function HomePage() {
  const report = await getLatestReport();

  return <DigestExperience report={report} />;
}
