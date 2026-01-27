import {
  BalanceData,
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/balance/balance";

interface AggregateMonthlyDataParams {
  tempBalanceData: BalanceData;
}

interface AggregateMonthlyPaymentDataParams extends AggregateMonthlyDataParams {
  data: PaymentWithCategory[];
}
interface AggregateMonthlyIncomeDataParams extends AggregateMonthlyDataParams {
  data: IncomeWithCategory[];
}

export const aggregateMonthlyPaymentData = ({
  data,
  tempBalanceData,
}: AggregateMonthlyPaymentDataParams) => {
  data.forEach((payment) => {
    const datekey = payment.paymentDate.toISOString().split("T")[0];
    if (!tempBalanceData[datekey]) {
      tempBalanceData[datekey] = { income: 0, payment: 0, balance: 0 };
    }
    tempBalanceData[datekey].payment += payment.amount;
  });
  const monthlyPaymentTotal = data.reduce((acc,payment) => acc + payment.amount,0)

  return {monthlyPaymentTotal};
};

export const aggregateMonthlyIncomeData = ({
  data,
  tempBalanceData,
}: AggregateMonthlyIncomeDataParams) => {
  data.forEach((income) => {
    const datekey = income.incomeDate.toISOString().split("T")[0];
    if (!tempBalanceData[datekey]) {
      tempBalanceData[datekey] = { income: 0, payment: 0, balance: 0 };
    }
    tempBalanceData[datekey].income += income.amount;
  });
  const monthlyIncomeTotal = data.reduce((acc,income) => acc + income.amount,0)

  return {monthlyIncomeTotal};
};
