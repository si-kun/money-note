"use client";

import { Stock, StockCategory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import HeaderButton from "../../subscriptions/components/HeaderButton";
import ActionsCell from "@/components/dataTable/ActionsCell";
import { deleteStock } from "@/app/server-aciton/stock/deleteStock";
import { toast } from "sonner";
import StockForm from "./StockForm";

import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import StockQuantityButtons from "./StockQuantityButtons";
import { ShoppingCartWithItems } from "@/app/server-aciton/shopping/cart/getShoppingCart";
import CategorySelect from "./CategorySelect";

// TableMetaの型を拡張
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    carts?: ShoppingCartWithItems[];
    categories?: StockCategory[];
  }
}

export const stockColumns: ColumnDef<Stock>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row, table }) => {
      const carts = table.options.meta?.carts || [];
      const stock = row.original;

      // カートに存在する在庫は選択不可にする
      const isInCart = carts.some((cart) =>
        cart.items.some((item:ShoppingCartWithItems) => item.stockId === stock.id)
      );

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={isInCart}
        />
      );
    },
    size: 50,
  },
  {
    accessorKey: "name",
    header: "商品名",
    size: 200,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return <HeaderButton column={column} text="在庫数" isSorted={isSorted} />;
    },
    size: 50,
    cell: ({ row }) => {
      return <StockQuantityButtons row={row.original} />;
    },
  },
  {
    accessorKey: "unitPrice",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <HeaderButton column={column} text="商品単価" isSorted={isSorted} />
      );
    },
    size: 50,
    cell: ({ row }) => {
      const unitPrice = Number(row.getValue("unitPrice"));
      return <div>{unitPrice.toLocaleString()}円</div>;
    },
  },

  {
    accessorKey: "minQuantity",
    header: "最小在庫設定数",
    size: 50,
    cell: ({ row }) => {
      const minQuantity = Number(row.getValue("minQuantity"));
      const unit = row.original.unit;
      return (
        <div>
          {minQuantity}
          {unit}
        </div>
      );
    },
  },
  {
    id: "stockCategory",
    accessorKey: "stockCategoryId",
    header: "カテゴリー",
    cell: ({ row, table }) => {
      const categories = table.options.meta?.categories || [];

      return (
        <CategorySelect
          categories={categories}
          stockName={row.original.name}
          stockId={row.original.id}
          categoryId={row.original.stockCategoryId  || undefined}
        />
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async () => {
        try {
          await deleteStock(row.original.id);
          toast.success("Stock deleted successfully");
        } catch (error) {
          console.error("Error deleting stock:", error);
        }
      };
      return (
        <ActionsCell row={row} onClickDelete={handleDelete}>
          {({ row, setIsDialogOpen }) => (
            <StockForm row={row} setIsDialogOpen={setIsDialogOpen} />
          )}
        </ActionsCell>
      );
    },
  },
  {
    accessorKey: "cartSelection",
    header: "カート",
    cell: ({ row, table }) => {
      const carts = table.options.meta?.carts || [];
      const stock = row.original;

      const cartWithStock = carts.find((cart) => {
        return cart.items.some((item:ShoppingCartWithItems["item"][number]) => item.stockId === stock.id);
      });

      return (
        <div>
          {cartWithStock ? (
            <Link
              href={`/shopping/cart/${cartWithStock.id}`}
              className="text-blue-600 hover:underline font-medium"
            >
              {cartWithStock.name}
            </Link>
          ) : (
            <span>-</span>
          )}
        </div>
      );
    },
  },
];
