"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Stock } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const stockListColumns: ColumnDef<Stock>[] = [
  {
    id: "select",
    header: "選択",
    cell: ({ row }) => {
      return (
        <Checkbox
          className="data-[state=checked]:bg-green-400 data-[state=checked]:border-none"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "商品名",
  },
  {
    accessorKey: "quantity",
    header: "在庫数",
  },
  {
    accessorKey: "unitPrice",
    header: "単価",
  },
];
