import { SubscriptionResponse } from "@/app/server-action/transaction/getSubscription";
import { IncomeWithCategory, PaymentWithCategory } from "@/app/types/transaction/transaction";
import { Category } from "@/generated/prisma/client";

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

export type MonthryTabsContentProps = Pick<SummarySectionProps, "monthlyData">;

export type SummaryProps = Omit<SummarySectionProps,"monthlyData">
