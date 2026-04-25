"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import SummarySection from "./SummarySection";
import { useRouter, useSearchParams } from "next/navigation";
import MobileBreakdownSheet from "./MobileBreakdownSheet";
import { SummarySectionProps } from "./types";

const ClientSummary = ({
  monthlyData,
  dailyData,
  categories,
}: SummarySectionProps) => {
  const { year, month } = monthlyData;

  const { date, dailyIncome, dailyPayment } = dailyData;

  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const openDate = searchParams.get("date");

  const handleCloseSheet = () => {
    router.push(`/?year=${year}&month=${month}`,{scroll: false});
  };

  return (
    <>
      {isMobile ? (
        <MobileBreakdownSheet
          openDate={openDate}
          handleCloseSheet={handleCloseSheet}
          date={date}
          dailyIncome={dailyIncome}
          dailyPayment={dailyPayment}
          categories={categories}
        />
      ) : (
        <SummarySection
          monthlyData={monthlyData}
          dailyData={dailyData}
          // カテゴリー
          categories={categories}
        />
      )}
    </>
  );
};

export default ClientSummary;
