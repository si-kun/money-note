"use client";

import { ShoppingCartItem } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const historyColumns: ColumnDef<ShoppingCartItem>[] = [
  {
    accessorKey: "itemName",
    header: "商品名",
  },
  {
    accessorKey: "quantity",
    header: "購入数",
  },
  {
    accessorKey: "unitPrice",
    header: "値段",
  },
  {
    id: "totalPrice",
    header: "合計金額",
    cell: ({ row }) => {
      const quantity = row.original.quantity ?? 0;
      const unitPrice = row.original.unitPrice ?? 0;
      const totalPrice = quantity * unitPrice;
      return `${totalPrice.toLocaleString()}円`;
    },
  },
];
