"use client";

import { updateShoppingChecked } from "@/app/server-aciton/shopping/updateShoppingChecked";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ShoppingCartItem } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<ShoppingCartItem>[] = [
  {
    accessorKey: "checked",
    header: "選択",
    cell: ({ row }) => (
      <Checkbox
        className="data-[state=checked]:bg-green-400 data-[state=checked]:border-none"
        checked={row.original.checked}
        onCheckedChange={async () => {
          console.log(
            "チェック変更開始:",
            row.original.id,
            !row.original.checked
          );
          const result = await updateShoppingChecked(
            row.original.id,
            !row.original.checked
          );
          console.log("Server Actionの結果:", result);
          window.dispatchEvent(new Event("shoppingCartUpdated"));
          console.log("イベント発火完了");
        }}
      />
    ),
  },
  {
    accessorKey: "itemName",
    header: "商品名",
  },
  {
    accessorKey: "quantity",
    header: "個数(購入個数)",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.quantity}</span>
        <Input type="number"  className="w-[60px]" />
      </div>
    ),
  },
  {
    accessorKey: "unitPrice",
    header: "値段",
    cell: ({ row }) => `${row.original.unitPrice?.toLocaleString()}円`,
  },
];
