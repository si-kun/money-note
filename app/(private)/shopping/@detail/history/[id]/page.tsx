import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditHistoryDialog from "../components/EditHistoryDialog";
import { historyColumns } from "../components/historyColumn";
import { getShoppingHistoryId } from "@/app/server-aciton/shopping/history/getShoppingHistoryId";
import { ShoppinghistoryDataTable } from "../components/shoppingHistoryDataTable";
import HistoryDeleteButton from "../components/HistoryDeleteButton";

interface HistroyDetailPage {
  params: Promise<{
    id: string;
  }>;
}

const HistroyDetailPage = async ({ params }: HistroyDetailPage) => {
  const { id } = await params;

  const historyResponse = await getShoppingHistoryId(id);
  const history = historyResponse.data;

  if (!historyResponse.success || !history) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">履歴が見つかりません</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>{history.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {history.items.length || 0}件のアイテム
          </p>
        </div>
        <div className="flex items-center gap-2">
          <EditHistoryDialog selectedHistory={history} />
          <HistoryDeleteButton historyId={id} />
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        <ShoppinghistoryDataTable
          items={history.items || []}
          columns={historyColumns}
        />
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-end">
          合計金額: {history.totalPrice?.toLocaleString()}円
        </div>
      </CardFooter>
    </Card>
  );
};

export default HistroyDetailPage;
