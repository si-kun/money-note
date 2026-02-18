import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Summary from "./Summary";
import MonthryTabsContent from "./MonthryTabsContent";
import { SubscriptionResponse } from "@/app/server-aciton/balance/getSubscription";
import { IncomeWithCategory, PaymentWithCategory } from "@/app/types/balance/balance";

interface SummarySectionProps {
  year: number;
  month: number;
  date: string;
  incomeError: string | null;
  paymentError: string | null;
  monthlyIncomeTotal: number;
  monthlyPaymentTotal: number;
  monthlySubscription: SubscriptionResponse;

  // 日次データ
  dailyIncome: IncomeWithCategory[];
  dailyPayment: PaymentWithCategory[];
  dailyIncomeTotal: number;
  dailyPaymentTotal: number;
}

const SummarySection = ({
  year,
  month,
  date,
  incomeError,
  paymentError,
  monthlyIncomeTotal,
  monthlyPaymentTotal,
  monthlySubscription,
  dailyIncome,
  dailyPayment,
  dailyIncomeTotal,
  dailyPaymentTotal,
}: SummarySectionProps) => {
  return (
    <Tabs defaultValue="day" className="flex-1 flex flex-col">
      <TabsList>
        <TabsTrigger value="day">日次</TabsTrigger>
        <TabsTrigger value="month">月次</TabsTrigger>
      </TabsList>
      <TabsContent value="day" className="flex-1 overflow-hidden">
        <Summary
          date={date}
          dailyIncome={dailyIncome}
          dailyPayment={dailyPayment}
          dailyIncomeTotal={dailyIncomeTotal}
          dailyPaymentTotal={dailyPaymentTotal}
        />
      </TabsContent>
      <MonthryTabsContent
        year={year}
        month={month}
        incomeError={incomeError}
        paymentError={paymentError}
        monthlyIncomeTotal={monthlyIncomeTotal}
        monthlyPaymentTotal={monthlyPaymentTotal}
        monthlySubscription={monthlySubscription}
      />
    </Tabs>
  );
};

export default SummarySection;
