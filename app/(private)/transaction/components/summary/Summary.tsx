import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCard from "./SummaryCard";
import BreakdownList from "../form/BreakdownList";
import BreakdownHeader from "../features/BreakdownHeader";
import { SummaryProps } from "./types";

const Summary = ({ dailyData, categories }: SummaryProps) => {
  const {
    date,
    dailyIncomeTotal,
    dailyPaymentTotal,
    dailyIncome,
    dailyPayment,
  } = dailyData;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-2 lg:px-6">
        <CardTitle>日付:{date}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden px-2 lg:px-6">
        {/* 収入、支出、残高のカード */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between gap-4">
            <SummaryCard title={"収入"} amount={dailyIncomeTotal} />
            <SummaryCard title={"支出"} amount={dailyPaymentTotal} />
          </div>
          <SummaryCard
            title={"残高"}
            amount={dailyIncomeTotal - dailyPaymentTotal}
          />
        </div>

        {/* 内訳追加 */}
        <BreakdownHeader date={date} categories={categories} />

        {/* 内訳リスト */}
        <BreakdownList
          date={date}
          dailyIncome={dailyIncome}
          dailyPayment={dailyPayment}
          categories={categories}
        />
      </CardContent>
    </Card>
  );
};

export default Summary;
