import { format } from "date-fns";
import { getIncome } from "../server-aciton/balance/getIncome";
import { getPayment } from "../server-aciton/balance/getPayment";
import { getSubscription } from "../server-aciton/balance/getSubscription";
import CalendareSection from "./transaction/components/calendar/CalendareSection";
import SummarySection from "./transaction/components/summary/SummarySection";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ year: string; month: string; date: string }>;
}) {
  const {
    year: yearParam,
    month: monthParam,
    date: dateParam,
  } = await searchParams;

  const today = new Date();
  const year = Number(yearParam) || today.getFullYear();
  const month = Number(monthParam) || today.getMonth() + 1;
  const date = dateParam || format(today, "yyyy-MM-dd");

  // サーバーでデータを取得
  const incomeResult = await getIncome({ year, month });
  const paymentResult = await getPayment({ year, month });

  const monthlySubscription = await getSubscription({ year, month });

  // エラーテキスト
  const incomeError =
    incomeResult.success === false ? incomeResult.message : null;
  const paymentError =
    paymentResult.success === false ? paymentResult.message : null;

  // income,paymentそれぞれの合計金額
  const monthlyIncomeTotal = incomeResult.success
    ? incomeResult.data.reduce((total, item) => total + item.amount, 0)
    : 0;

  const monthlyPaymentTotal = paymentResult.success
    ? paymentResult.data.reduce((total, item) => total + item.amount, 0)
    : 0;

  // 当日のデータを取得
  const dailyIncome = incomeResult.data.filter(
    (income) => income.incomeDate.toISOString().split("T")[0] === date
  );
  const dailyPayment = paymentResult.data.filter(
    (payment) => payment.paymentDate.toISOString().split("T")[0] === date
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

  return (
    <div className="w-full h-full flex gap-4 overflow-hidden">
      <CalendareSection
        initialIncomeData={incomeResult.data}
        initialPaymentData={paymentResult.data}
        today={today}
        initialMonth={month}
        initialYear={year}
      />
      <SummarySection
        // 月次データ
        year={year}
        month={month}
        incomeError={incomeError}
        paymentError={paymentError}
        monthlyIncomeTotal={monthlyIncomeTotal}
        monthlyPaymentTotal={monthlyPaymentTotal}
        monthlySubscription={monthlySubscription.data}
        // 日次データ
        date={date}
        dailyIncome={dailyIncome}
        dailyPayment={dailyPayment}
        dailyIncomeTotal={dailyIncomeTotal}
        dailyPaymentTotal={dailyPaymentTotal}
      />
    </div>
  );
}
