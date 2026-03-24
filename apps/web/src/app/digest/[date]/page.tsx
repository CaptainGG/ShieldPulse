import { DigestExperience } from "@/components/digest-experience";
import { getReportByDate } from "@/lib/api";

type Props = {
  params: {
    date: string;
  };
};

export default async function DigestHistoryPage({ params }: Props) {
  const report = await getReportByDate(params.date);

  return <DigestExperience report={report} isArchive />;
}
