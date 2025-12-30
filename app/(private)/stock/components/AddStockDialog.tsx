import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stock } from "@prisma/client";
import { Table } from "@tanstack/react-table";
import SelectedCart from "./SelectedCart";
import { ShoppingCartWithItems } from "@/app/server-aciton/shopping/getShoppingCart";
import { useState } from "react";
import { addStocksToCart } from "@/app/server-aciton/stock/addStocksToCart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface AddStockDialogProps {
  table: Table<Stock>;
  carts: ShoppingCartWithItems[];
}

const AddStockDialog = ({ table, carts }: AddStockDialogProps) => {
  const router = useRouter();

  const selectedRows = table.getSelectedRowModel().rows;
  const [selectedCartId, setSelectedCartId] = useState<string | null>(null);

  const [newCartMode, setNewCartMode] = useState(false);
  const [newCartName, setNewCartName] = useState("");

  // ダイアログ開閉
  const [isOpen, setIsOpen] = useState(false);

  console.log(selectedRows);

  const handleAddToCart = async () => {
    if (newCartMode && !newCartName.trim()) {
      toast.error("カート名を入力してください");
      return;
    }

    // 既存カート選択モードの場合のチェック
    if (!newCartMode && !selectedCartId) {
      toast.error("カートを選択してください");
      return;
    }

    try {
      const result = await addStocksToCart({
        cartId: newCartMode ? undefined : selectedCartId || undefined,
        cartName: newCartMode ? newCartName : undefined,
        items: selectedRows.map((row) => {
          return {
            itemName: row.original.name,
            quantity: 1,
            unit: row.original.unit,
            unitPrice: row.original.unitPrice ?? 0,
            stockId: row.original.id,
            memo: null,
          };
        }),
      });

      if (result.success) {
        toast.success(result.message);
        router.refresh();
        table.resetRowSelection();
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error adding items to cart:", error);
      toast.error("エラーが発生しました。");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={selectedRows.length === 0}
          className="bg-green-500 hover:bg-green-400 disabled:bg-slate-400"
          variant={"secondary"}
          type="button"
        >
          選択したアイテムをカートに追加
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>カートに追加</DialogTitle>
          <DialogDescription>
            アイテムを追加するカートと数量を指定してください。
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Label>カート選択を選択、または新規作成</Label>
              <Switch onCheckedChange={setNewCartMode} />
            </div>
            {newCartMode ? (
              <Input
                placeholder="新しいカートの名前を入力"
                value={newCartName}
                onChange={(e) => setNewCartName(e.target.value)}
              />
            ) : (
              <SelectedCart
                carts={carts}
                selectedCartId={selectedCartId}
                setSelectedCartId={setSelectedCartId}
              />
            )}
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t-4 border-slate-500">
            {selectedRows.map((row) => (
              <div key={row.id} className="flex items-center gap-4">
                <span className="flex-1">{row.original.name}</span>
                <Input
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="w-20"
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddToCart} type="submit">
            アイテムを追加する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockDialog;
