import { getShoppingHistory } from "@/app/server-aciton/shopping/history/getShoppingHistory";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingItemTable } from "../../components/shoppingData-table";
import { historyColumns } from "../components/historyColumn";

interface HistroyDetailPage {
    params: Promise<{
        id: string;
    }>
}

const HistroyDetailPage = async({params}:HistroyDetailPage) => {

    const {id} = await params;

    const historyResponse = await getShoppingHistory();
    const histories = historyResponse?.data || [];

    const selectedHistory = histories.find((history) => history.id === id);

    if (!selectedHistory) {
        return (
            <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">履歴が見つかりません</p>
            </CardContent>
          </Card>
        )
    }

  return (
    <Card className="h-full">
      <CardHeader className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>{selectedHistory.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectedHistory.items?.length || 0}件のアイテム
          </p>
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        <ShoppingItemTable items={selectedHistory.items || []} columns={historyColumns} />
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-end">
          合計金額: {selectedHistory.totalPrice?.toLocaleString()}円
        </div>
      </CardFooter>
    </Card>
  )
}

export default HistroyDetailPage