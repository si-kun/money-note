import { getAllYearData } from "@/app/server-aciton/statistics/getAllYearData";
import StatisticsClient from "./components/StatisticsClient";

export const dynamic = "force-dynamic";

interface StatisticsPageProps {
  searchParams: Promise<{
    year?: string;
  }>;
}

const StatisticsPage = async ({ searchParams }: StatisticsPageProps) => {
  const params = await searchParams;
  const today = new Date();

  const year = params.year ? Number(params.year) : today.getFullYear();

  const fetchData = await getAllYearData({
    year: year,
  });

  return <StatisticsClient data={fetchData.data} currentYear={year} />;
};

export default StatisticsPage;
