"use client";

import { Stock } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import HeaderButton from "../../subscriptions/components/HeaderButton";
import ActionsCell from "@/components/dataTable/ActionsCell";
import StockForm from "./StockForm";
import { deleteStock } from "@/app/server-aciton/stock/deleteStock";
import { toast } from "sonner";

export const stockColumns: ColumnDef<Stock>[] = [
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
      const quantity = Number(row.getValue("quantity"));
      const unit = row.original.unit;
      return (
        <div>
          {quantity}
          {unit}
        </div>
      );
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
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async() => {
        try {
          await deleteStock(row.original.id);
          toast.success("Stock deleted successfully");
          window.dispatchEvent(new Event("stockUpdated"));
        } catch(error) {
          console.error("Error deleting stock:", error);
        }
      }
      return (
        <ActionsCell row={row} onClickDelete={handleDelete}>
          <StockForm row={row} />
        </ActionsCell>
      );
    },
  },
];
