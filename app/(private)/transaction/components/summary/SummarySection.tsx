import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Summary from "./Summary";
import MonthryTabsContent from "./MonthryTabsContent";
import { SubscriptionResponse } from "@/app/server-aciton/balance/getSubscription";
import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/balance/balance";
import { Category } from "@prisma/client";

interface SummarySectionProps {
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

const SummarySection = ({
  // 月次データ
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
  return (
    <Tabs defaultValue="day" className="flex-1 flex flex-col">
      <TabsList>
        <TabsTrigger value="day">日次</TabsTrigger>
        <TabsTrigger value="month">月次</TabsTrigger>
      </TabsList>

      {/* 日次 */}
      <TabsContent value="day" className="flex-1 overflow-hidden">
        <Summary
          date={date}
          dailyIncome={dailyIncome}
          dailyPayment={dailyPayment}
          dailyIncomeTotal={dailyIncomeTotal}
          dailyPaymentTotal={dailyPaymentTotal}
          categories={categories}
        />
      </TabsContent>

      {/* 月次 */}
      <TabsContent value="month" className="flex-1 overflow-hidden">
        <MonthryTabsContent
          year={year}
          month={month}
          incomeError={incomeError}
          paymentError={paymentError}
          monthlyIncomeTotal={monthlyIncomeTotal}
          monthlyPaymentTotal={monthlyPaymentTotal}
          monthlySubscription={monthlySubscription}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SummarySection;
