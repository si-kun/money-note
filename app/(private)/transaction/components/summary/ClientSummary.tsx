"use client";

import { SubscriptionResponse } from "@/app/server-action/transaction/getSubscription";
import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/transaction/transaction";
import { Category } from "@/generated/prisma/client";
import { useIsMobile } from "@/hooks/use-mobile";
import SummarySection from "./SummarySection";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter, useSearchParams } from "next/navigation";
import BreakdownList from "../form/BreakdownList";

export interface SummarySectionProps {
  // 月次データ
  year: number;
  month: number;
  incomeError: string | null;
  paymentError: string | null;
  monthlyIncomeTotal: number;
  monthlyPaymentTotal: number;
  monthlySubscription: SubscriptionResponse;

  // 日次データ
  date: string;
  dailyIncome: IncomeWithCategory[];
  dailyPayment: PaymentWithCategory[];
  dailyIncomeTotal: number;
  dailyPaymentTotal: number;

  // カテゴリー
  categories: Category[];
}

const ClientSummary = ({
  year,
  month,
  incomeError,
  paymentError,
  monthlyIncomeTotal,
  monthlyPaymentTotal,
  monthlySubscription,

  // 日次データ
  date,
  dailyIncome,
  dailyPayment,
  dailyIncomeTotal,
  dailyPaymentTotal,

  // カテゴリー
  categories,
}: SummarySectionProps) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const openDate = searchParams.get("date")

  const handleCloseSheet = () => {
    router.push(`/?year=${year}&month=${month}`);
  }

  return (
    <>
      {isMobile ? (
        <Sheet open={!!openDate} onOpenChange={handleCloseSheet}>
          <SheetContent side="bottom" className="h-[80vh] px-4">
            <SheetHeader className="px-0">
              <SheetTitle>{date}</SheetTitle>
              <SheetDescription>
                {date}の詳細情報
              </SheetDescription>
            </SheetHeader>
            <BreakdownList
              date={date}
              dailyIncome={dailyIncome}
              dailyPayment={dailyPayment}
              categories={categories}
            />
          </SheetContent>
        </Sheet>
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
