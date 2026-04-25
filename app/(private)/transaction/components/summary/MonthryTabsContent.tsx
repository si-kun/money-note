import SummaryCard from "./SummaryCard";

import SubscriptionCard from "@/app/(private)/subscriptions/components/SubscriptionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthryTabsContentProps } from "./types";

const MonthryTabsContent = ({ monthlyData }: MonthryTabsContentProps) => {
  const {
    year,
    month,
    incomeError,
    monthlyIncomeTotal,
    paymentError,
    monthlyPaymentTotal,
    monthlySubscription,
  } = monthlyData;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          {year}年{month}月
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 overflow-y-auto">
        {/* 収入、支出、残高のカード */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between gap-4">
            <SummaryCard
              title={"収入"}
              errorText={incomeError}
              amount={monthlyIncomeTotal}
            />
            <SummaryCard
              title={"支出"}
              errorText={paymentError}
              amount={monthlyPaymentTotal}
            />
          </div>
          <SubscriptionCard
            monthlySubscription={monthlySubscription}
            year={year}
            month={month}
          />
          <SummaryCard
            title={"残高"}
            amount={
              monthlyIncomeTotal -
              monthlyPaymentTotal -
              monthlySubscription.totalAmount
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthryTabsContent;
