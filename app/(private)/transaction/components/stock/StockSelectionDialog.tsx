import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Stock } from "@prisma/client";
import { getAllStock } from "@/app/server-aciton/stock/getAllStock";
import { StockListDataTable } from "./StockListDataTable";
import { stockListColumns } from "./stockListColumns";

interface StockSelectionDialogProps {
    onSelect: (selectedStocks: Stock[]) => void;
}

const StockSelectionDialog = ({onSelect}:StockSelectionDialogProps) => {
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [stockOpen, setStockOpen] = useState(false);

  useEffect(() => {
    if (stockOpen === true) {
      const fetchStockData = async () => {
        try {
          const result = await getAllStock();
          if (result.success && result.data) {
            setStockData(result.data);
          }
        } catch (error) {
          console.error("Error fetching stock data:", error);
        }
      };
      fetchStockData();
    }
  }, [stockOpen]);

  return (
    <Dialog open={stockOpen} onOpenChange={setStockOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={"secondary"}>
          リストから追加
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[40vw]">
        <DialogHeader>
          <DialogTitle>在庫一覧</DialogTitle>
          <DialogDescription>
            在庫から商品を選択してください。
          </DialogDescription>
        </DialogHeader>
        <StockListDataTable
          data={stockData}
          columns={stockListColumns}
          onSelectionChange={(selectedRows) => {
            onSelect(selectedRows);
            setStockOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StockSelectionDialog;
