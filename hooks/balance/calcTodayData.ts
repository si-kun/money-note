import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/balance/balance";

interface CalcTodayDataParams {
  today: Date;
  year: number;
  month: number;
  incomeData: IncomeWithCategory[];
  paymentData: PaymentWithCategory[];
}

// 当日のデータを選択
export const calcTodayData = ({
  today,
  year,
  month,
  incomeData,
  paymentData,
}: CalcTodayDataParams) => {
  const todayKey = today.toISOString().split("T")[0];
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;

  let targetDate: string;

  if (year === todayYear && month === todayMonth) {
    targetDate = todayKey;
  } else {
    targetDate = `${year}-${String(month).padStart(2, "0")}-01`;
  }

  const selectedIncomes = incomeData.filter((income) => {
    return income.incomeDate.toISOString().split("T")[0] === targetDate;
  });

  const selectedPayments = paymentData.filter((payment) => {
    return payment.paymentDate.toISOString().split("T")[0] === targetDate;
  });
  const totalIncome = selectedIncomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );
  const totalPayment = selectedPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  return {
    date: targetDate,
    incomes: selectedIncomes,
    payments: selectedPayments,
    totalIncome,
    totalPayment,
    balance: totalIncome - totalPayment,
  };
};
