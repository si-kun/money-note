import { format } from "date-fns";
import { getIncome } from "../server-action/transaction/getIncome";
import { getPayment } from "../server-action/transaction/getPayment";
import { getSubscription } from "../server-action/transaction/getSubscription";
import CalendareSection from "./transaction/components/calendar/CalendareSection";
import { getCategory } from "../server-action/transaction/getCategory";
import ClientSummary from "./transaction/components/summary/ClientSummary";
import { computeTransactionData } from "./transaction/utils/computeTransactionData";

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

  const categories = await getCategory();

  // エラーテキスト
  const incomeError =
    incomeResult.success === false ? incomeResult.message : null;
  const paymentError =
    paymentResult.success === false ? paymentResult.message : null;

  const {
    monthlyIncomeTotal,
    monthlyPaymentTotal,
    dailyIncome,
    dailyPayment,
    dailyIncomeTotal,
    dailyPaymentTotal,
  } = computeTransactionData({
    incomeResult,
    paymentResult,
    year,
    month,
    date,
  });

  return (
    <div className="w-full xl:h-full flex flex-col xl:flex-row gap-4 overflow-hidden">
      <CalendareSection
        initialIncomeData={incomeResult.data}
        initialPaymentData={paymentResult.data}
        initialMonth={month}
        initialYear={year}
      />
      <ClientSummary // 月次データ
        monthlyData={{
          year,
          month,
          incomeError,
          paymentError,
          monthlyIncomeTotal,
          monthlyPaymentTotal,
          monthlySubscription: monthlySubscription.data,
        }}
        dailyData={{
          date,
          dailyIncome,
          dailyPayment,
          dailyIncomeTotal,
          dailyPaymentTotal,
        }}
        // カテゴリー
        categories={categories.data}
      />
    </div>
  );
}
