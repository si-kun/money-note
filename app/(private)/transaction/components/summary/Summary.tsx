import { List } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCard from "./SummaryCard";
import BreakdownList from "../form/BreakdownList";
import TransactionForm from "../form/TransactionForm";
import { IncomeWithCategory, PaymentWithCategory } from "@/app/types/transaction/transaction";
import { Category } from "@/generated/prisma/client";
interface SummaryProps {
  date: string;
  dailyIncome: IncomeWithCategory[];
  dailyPayment: PaymentWithCategory[];
  dailyIncomeTotal: number;
  dailyPaymentTotal: number;
  categories: Category[];
}

const Summary = ({
  date,
  dailyIncome,
  dailyPayment,
  dailyIncomeTotal,
  dailyPaymentTotal,
  categories,
}: SummaryProps) => {

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>日付:{date}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* 収入、支出、残高のカード */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between gap-4">
            <SummaryCard title={"収入"} amount={dailyIncomeTotal} />
            <SummaryCard title={"支出"} amount={dailyPaymentTotal} />
          </div>
          <SummaryCard title={"残高"} amount={dailyIncomeTotal - dailyPaymentTotal} />
        </div>

        {/* 追加ボタン */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 py-1">
            <List />
            <span className="font-semibold">内訳</span>
          </div>
          <TransactionForm date={date} categories={categories} />
        </div>

        {/* 内訳リスト */}
        <BreakdownList date={date}
        dailyIncome={dailyIncome}
        dailyPayment={dailyPayment}
        categories={categories}
        />
      </CardContent>
    </Card>
  );
};

export default Summary;
