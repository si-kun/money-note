import { getIncome } from "../server-aciton/balance/getIncome";
import { getPayment } from "../server-aciton/balance/getPayment";
import HomeClient from "./components/HomeClient";

export default async function Home() {

  console.log("Home Server Component Rendered");

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  // サーバーでデータを取得
  const incomeResult = await getIncome({ year, month });
  const paymentResult = await getPayment({ year, month });

  return (
    <HomeClient
      initialIncomeData={incomeResult.data}
      initialPaymentData={paymentResult.data}
      initialYear={year}
      initialMonth={month}
    />
  );
}
