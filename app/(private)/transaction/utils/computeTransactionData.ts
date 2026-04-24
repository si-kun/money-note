import { ApiResponse } from "@/app/types/api/api";
import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/transaction/transaction";
import { format, getMonth, getYear } from "date-fns";

interface ComputeTransactionDataProps {
  incomeResult: ApiResponse<IncomeWithCategory[]>;
  paymentResult: ApiResponse<PaymentWithCategory[]>;
  year: number;
  month: number;
  date: string;
}

export const computeTransactionData = ({
  incomeResult,
  paymentResult,
  year,
  month,
  date,
}: ComputeTransactionDataProps) => {
  // income,paymentそれぞれの合計金額
  const monthlyIncomeTotal = incomeResult.success
    ? incomeResult.data
        .filter((item) => {
          const date = new Date(item.incomeDate);
          return getYear(date) === year && getMonth(date) + 1 === month;
        })
        .reduce((total, item) => total + item.amount, 0)
    : 0;

  const monthlyPaymentTotal = paymentResult.success
    ? paymentResult.data
        .filter((item) => {
          const date = new Date(item.paymentDate);
          return getYear(date) === year && getMonth(date) + 1 === month;
        })
        .reduce((total, item) => total + item.amount, 0)
    : 0;

  // 当日のデータを取得
  const dailyIncome = incomeResult.data.filter(
    (income) => format(new Date(income.incomeDate), "yyyy-MM-dd") === date
  );
  const dailyPayment = paymentResult.data.filter(
    (payment) => format(new Date(payment.paymentDate), "yyyy-MM-dd") === date
  );

  // 合計金額を計算
  const dailyIncomeTotal = dailyIncome.reduce(
    (total, item) => total + item.amount,
    0
  );
  const dailyPaymentTotal = dailyPayment.reduce(
    (total, item) => total + item.amount,
    0
  );

  return {
    monthlyIncomeTotal,
    monthlyPaymentTotal,
    dailyIncome,
    dailyPayment,
    dailyIncomeTotal,
    dailyPaymentTotal,
  };
};
