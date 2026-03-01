"use client";

import ActionsCell from "@/components/dataTable/ActionsCell";
import { ColumnDef } from "@tanstack/react-table";
import EditShopping from "../../../components/EditShopping";
import { deleteHistoryItem } from "@/app/server-aciton/shopping/history/deleteHistoryItem";
import { ShoppingCartItemWithStock } from "@/app/types/shopping/shopping";

export const historyEditColumns: ColumnDef<ShoppingCartItemWithStock>[] = [
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const handleDelete = async() => {
        try {
          await deleteHistoryItem({historyId: row.original.historyId!, itemId:row.original.id});
        } catch(error) {
          console.error("Error deleting history item:", error);
        }
      }

      return (
        <ActionsCell row={row} onClickDelete={handleDelete}>
          {({ row, setIsDialogOpen }) => (
            <EditShopping row={row} setIsDialogOpen={setIsDialogOpen} />
          )}
        </ActionsCell>
      );
    },
  },
];
