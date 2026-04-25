"use client";

import ActionsCell from "@/components/dataTable/ActionsCell";
import { ColumnDef } from "@tanstack/react-table";
import { deleteShoppingCartItem } from "@/app/server-action/shopping/cart/deleteShoppinCartItem";
import { toast } from "sonner";
import CheckboxCell from "./CheckboxCell";
import EditShopping from "../../../components/EditShopping";
import { ShoppingCartItemWithStock } from "@/app/types/shopping/shopping";

export const columns: ColumnDef<ShoppingCartItemWithStock>[] = [
  {
    accessorKey: "checked",
    header: "選択",
    cell: ({ row }) => <CheckboxCell row={row} />,
  },
  {
    header: "商品名",
    cell: ({ row }) => row.original.stock?.name ?? row.original.itemName,
  },
  {
    accessorKey: "quantity",
    header: "購入予定数",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.quantity}</span>
      </div>
    ),
  },
  {
    accessorKey: "unitPrice",
    header: "値段",
    cell: ({ row }) => `${row.original.unitPrice?.toLocaleString()}円`,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const handleDelete = async () => {
        try {
          const result = await deleteShoppingCartItem(
            row.original.id,
            row.original.cartId
          );
          if (result.success) {
            toast.success("Item deleted successfully");
          }
        } catch (error) {
          console.error("Error deleting shopping cart item:", error);
        }
      };
      return (
        <ActionsCell onClickDelete={handleDelete} row={row} dialogDescription="商品情報を編集">
          {({ row, setIsDialogOpen }) => (
            <EditShopping row={row} setIsDialogOpen={setIsDialogOpen} />
          )}
        </ActionsCell>
      );
    },
  },
];