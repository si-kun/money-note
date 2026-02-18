import SummaryCard from "./SummaryCard";
import { TabsContent } from "@/components/ui/tabs";

import SubscriptionCard from "@/app/(private)/subscriptions/components/SubscriptionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionResponse } from "@/app/server-aciton/balance/getSubscription";

interface MonthryTabsContentProps {
  year: number;
  month: number;
  incomeError: string | null;
  paymentError: string | null;
  monthlyIncomeTotal: number;
  monthlyPaymentTotal: number;
  monthlySubscription: SubscriptionResponse;
}

const MonthryTabsContent = ({
  year,
  month,
  incomeError,
  paymentError,
  monthlyIncomeTotal,
  monthlyPaymentTotal,
  monthlySubscription,
}: MonthryTabsContentProps) => {
  return (
    <TabsContent value="month" className="flex-1 overflow-hidden">
      <Card className="h-full">
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
    </TabsContent>
  );
};

export default MonthryTabsContent;
