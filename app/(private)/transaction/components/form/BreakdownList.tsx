import { Card, CardContent } from "@/components/ui/card";
import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/balance/balance";

import EditTransactionForm from "./EditTransactionForm";
import { Category } from "@prisma/client";

interface BreakdownList {
  date: string;
  dailyIncome: IncomeWithCategory[];
  dailyPayment: PaymentWithCategory[];
  categories: Category[];
}

const BreakdownList = ({ date, dailyIncome, dailyPayment,categories }: BreakdownList) => {
  return (
    <div className="flex flex-col h-full max-h-full flex-1 gap-3 py-1 overflow-y-auto">
      {dailyIncome?.map((income) => (
        <Card className="bg-blue-200" key={income.id}>
          <CardContent className="flex items-center">
            <span className="w-[30%]">{income.category.name}</span>
            <span className="w-[40%]">{income.title || ""}</span>
            <span className="ml-auto">¥{income.amount.toLocaleString()}</span>
            <EditTransactionForm
              transaction={income}
              date={date}
              type={"INCOME"}
              categories={categories}
            />
          </CardContent>
        </Card>
      ))}

      {dailyPayment?.map((payment) => (
        <Card className="bg-red-200" key={payment.id}>
          <CardContent className="flex items-center">
            <span className="w-[30%]">【{payment.category.name}】</span>
            <span className="w-[40%]">{payment.title || ""}</span>
            <span className="ml-auto">¥{payment.amount.toLocaleString()}</span>
            <EditTransactionForm
              transaction={payment}
              date={date}
              type={"PAYMENT"}
              categories={categories}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BreakdownList;
