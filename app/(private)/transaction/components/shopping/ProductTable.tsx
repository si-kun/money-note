import { ProductValue } from "@/app/types/transaction/transaction";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface ProductTableProps {
  productsValue: ProductValue[];
  onCheckedChange: (id: string, checked: boolean) => void;
  updateProduct:(id: string, field: "quantity" | "price", value: number) => void
  handleDeleteProduct: (id: string) => void;
}

const ProductTable = ({
  productsValue,
  onCheckedChange,
  updateProduct,
  handleDeleteProduct,
}: ProductTableProps) => {
  return (
    <Table>
      <TableCaption>
        内訳として追加する商品の一覧です。
        <br />
        在庫に追加する場合はチェックを入れてください。
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>登録</TableHead>
          <TableHead className="w-[120px]">商品名</TableHead>
          <TableHead className="w-[100px]">個数</TableHead>
          <TableHead className="w-[100px]">値段</TableHead>
          <TableHead className="text-right w-[100px]">合計</TableHead>
          <TableHead>削除</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {productsValue.map((product) => {
          const totalPrice = product.quantity * product.price;

          return (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                <Checkbox
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  checked={product.stockAdd}
                  onCheckedChange={(checked) => onCheckedChange(product.id, checked === true)}
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={product.quantity || ""}
                  placeholder="0"
                  min={0}
                  onChange={(e) =>
                    updateProduct(
                      product.id,
                      "quantity",
                      Number(e.target.value)
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="0"
                  min={0}
                  value={product.price || ""}
                  onChange={(e) =>
                    updateProduct(product.id, "price", Number(e.target.value))
                  }
                />
              </TableCell>
              <TableCell className="text-right">
                ¥{totalPrice.toLocaleString()}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleDeleteProduct(product.id)}
                  type="button"
                  variant={"outline"}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
