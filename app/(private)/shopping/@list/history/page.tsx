import { getShoppingHistory } from "@/app/server-aciton/shopping/history/getShoppingHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import HistorydateSelect from "./components/HistorydateSelect";

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
        <Link key={history.id} href={`/shopping/history/${history.id}`}>
          <Card
            key={history.id}
            className="cursor-pointer hover:bg-accent transition-colors"
          >
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-base">{history.name}</CardTitle>
              <span>{new Date(history.date).toLocaleDateString()}</span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {history.items?.length || 0}件の商品を購入しました
              </p>
              {history.totalPrice && (
                <p className="text-sm font-semibold mt-1">
                  合計: ¥{history.totalPrice.toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default HistoryPage;
