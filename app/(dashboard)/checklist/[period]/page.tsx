import { notFound } from "next/navigation";
import { ChecklistDashboard } from "@/domains/checklist/components/checklist-dashboard";
import { CHECKLIST_PERIOD_BY_SLUG, parseChecklistPeriod } from "@/domains/checklist/routing";

type Props = { params: Promise<{ period: string }> };

export function generateStaticParams() {
  return Object.keys(CHECKLIST_PERIOD_BY_SLUG).map((period) => ({ period }));
}

export default async function ChecklistPage({ params }: Props) {
  const { period: periodSlug } = await params;
  const period = parseChecklistPeriod(periodSlug);
  if (!period) notFound();

  return <ChecklistDashboard key={period} period={period} />;
}

