import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StockSelectionDialog from "./StockSelectionDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProductTable from "./ProductTable";
import { ProductValue } from "@/hooks/useTransactionForm";
import { Dispatch, SetStateAction } from "react";
import { Stock } from "@prisma/client";

interface ShoppingCartCardProps {
    productsValue: ProductValue[];
    addInputProduct: string;
    setAddInputProduct: Dispatch<SetStateAction<string>>;
    newAddProduct: () => void;
    
    onAddFromStock: (selectedStocks: Stock[]) => void;
    onCheckedChange: (id: string, checked: boolean) => void;
    onUpdateProduct: (id: string, field: "quantity" | "price", value: number) => void;
    onDeleteProduct: (id: string) => void;
}

const ShoppingCartCard = ({
  productsValue,
  addInputProduct,
  setAddInputProduct,
  newAddProduct,
  onAddFromStock,
  onCheckedChange,
  onUpdateProduct,
  onDeleteProduct,
}: ShoppingCartCardProps) => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>買い物リストを作成</CardTitle>
          <CardDescription>リストから選択。または手動で入力</CardDescription>
        </div>

        {/* 商品選択のダイアログ */}
        <StockSelectionDialog
          onSelect={(selectedRows) => {
            onAddFromStock(selectedRows);
          }}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="space-y-1">
          <Label htmlFor="ProductName">商品名を入力</Label>
          <div className="flex items-center gap-2">
            <Input
              id="ProductName"
              value={addInputProduct}
              onChange={(e) => setAddInputProduct(e.target.value)}
            />
            <Button type="button" onClick={newAddProduct} variant={"secondary"}>
              追加
            </Button>
          </div>
        </div>
        <Separator className="my-2" />

        {/* 買い物履歴に登録する商品一覧 */}
        <ProductTable
          productsValue={productsValue}
          onCheckedChange={onCheckedChange}
          updateProduct={onUpdateProduct}
          handleDeleteProduct={onDeleteProduct}
        />
      </CardContent>
    </Card>
  );
};

export default ShoppingCartCard;
