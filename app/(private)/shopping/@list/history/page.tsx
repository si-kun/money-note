import { getShoppingHistory } from "@/app/server-action/shopping/history/getShoppingHistory";
import HistorydateSelect from "./components/HistorydateSelect";
import HistoryList from "../../@detail/history/components/HistoryList";

const HistoryPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) => {

    const params = await searchParams;

  const year = params.year
    ? Number(params.year)
    : new Date().getFullYear();
  const month = params.month
    ? Number(params.month)
    : new Date().getMonth() + 1;
  const fetchHistories = await getShoppingHistory({ year, month });
  return (
    <div className="mt-2 flex flex-col gap-4 flex-1 overflow-y-auto">
      <HistorydateSelect initialYear={year} initialMonth={month} />
      {fetchHistories.data.length === 0 && (
        <p className="text-sm text-muted-foreground">
          指定された年月の購入履歴はありません。
        </p>
      )}
      {fetchHistories.data.map((history) => (
        <HistoryList key={history.id} history={history} year={year} month={month} />
      ))}
    </div>
  );
};

export default HistoryPage;
