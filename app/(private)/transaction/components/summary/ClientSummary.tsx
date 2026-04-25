"use client";

import { SubscriptionResponse } from "@/app/server-action/transaction/getSubscription";
import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/transaction/transaction";
import { Category } from "@/generated/prisma/client";
import { useIsMobile } from "@/hooks/use-mobile";
import SummarySection from "./SummarySection";
import { useRouter, useSearchParams } from "next/navigation";
import MobileBreakdownSheet from "./MobileBreakdownSheet";

export interface SummarySectionProps {
  // 月次データ
  monthlyData: {
    year: number;
    month: number;
    incomeError: string | null;
    paymentError: string | null;
    monthlyIncomeTotal: number;
    monthlyPaymentTotal: number;
    monthlySubscription: SubscriptionResponse;
  };
  dailyData: {
    // 日次データ
    date: string;
    dailyIncome: IncomeWithCategory[];
    dailyPayment: PaymentWithCategory[];
    dailyIncomeTotal: number;
    dailyPaymentTotal: number;
  };
  // カテゴリー
  categories: Category[];
}

const ClientSummary = ({
  monthlyData,
  dailyData,
  categories,
}: SummarySectionProps) => {
  const {
    year,
    month,
    incomeError,
    paymentError,
    monthlyIncomeTotal,
    monthlyPaymentTotal,
    monthlySubscription,
  } = monthlyData;

  const {
    date,
    dailyIncome,
    dailyPayment,
    dailyIncomeTotal,
    dailyPaymentTotal,
  } = dailyData;

  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const openDate = searchParams.get("date");

  const handleCloseSheet = () => {
    router.push(`/?year=${year}&month=${month}`);
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
          // 月次データ
          year={year}
          month={month}
          incomeError={incomeError}
          paymentError={paymentError}
          monthlyIncomeTotal={monthlyIncomeTotal}
          monthlyPaymentTotal={monthlyPaymentTotal}
          monthlySubscription={monthlySubscription}
          // 日次データ
          date={date}
          dailyIncome={dailyIncome}
          dailyPayment={dailyPayment}
          dailyIncomeTotal={dailyIncomeTotal}
          dailyPaymentTotal={dailyPaymentTotal}
          // カテゴリー
          categories={categories}
        />
      )}
    </>
  );
};

export default ClientSummary;
