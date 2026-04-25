import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Summary from "./Summary";
import MonthryTabsContent from "./MonthryTabsContent";
import { SummarySectionProps } from "./types";

const SummarySection = ({
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
      <TabsContent value="month" className="flex-1 h-full overflow-hidden">
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
