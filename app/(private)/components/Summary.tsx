"use client";
import { List } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCard from "./SummaryCard";
import BreakdownList from "./BreakdownList";
import TransactionForm from "./TransactionForm";
import { SelectedData } from "@/app/types/balance/balance";
interface SummaryProps {
  selectedDate: SelectedData;
}

const Summary = ({ selectedDate }: SummaryProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>日付:{selectedDate?.date}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* 収入、支出、残高のカード */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between gap-4">
            <SummaryCard title={"収入"} amount={selectedDate.totalIncome} />
            <SummaryCard title={"支出"} amount={selectedDate.totalPayment} />
          </div>
          <SummaryCard title={"残高"} amount={selectedDate.balance} />
        </div>

        {/* 追加ボタン */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 py-1">
            <List />
            <span className="font-semibold">内訳</span>
          </div>
          <TransactionForm selectedDate={selectedDate} />
        </div>

        {/* 内訳リスト */}
        <BreakdownList selectedDate={selectedDate} />
      </CardContent>
    </Card>
  );
};

export default Summary;
