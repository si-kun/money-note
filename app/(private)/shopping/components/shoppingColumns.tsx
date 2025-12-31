"use client";

import { updateShoppingChecked } from "@/app/server-aciton/shopping/cart/updateShoppingChecked";
import ActionsCell from "@/components/dataTable/ActionsCell";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCartItem } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import EditShopping from "./EditShopping";
import { deleteShoppingCartItem } from "@/app/server-aciton/shopping/cart/deleteShoppinCartItem";
import { toast } from "sonner";

export const columns: ColumnDef<ShoppingCartItem>[] = [
  {
    accessorKey: "checked",
    header: "選択",
    cell: ({ row }) => (
      <Checkbox
        className="data-[state=checked]:bg-green-400 data-[state=checked]:border-none"
        checked={row.original.checked}
        onCheckedChange={async () => {
          await updateShoppingChecked(row.original.id, !row.original.checked);
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
        <ActionsCell onClickDelete={handleDelete} row={row}>
          {({ row, setIsDialogOpen }) => (
            <EditShopping row={row} setIsDialogOpen={setIsDialogOpen} />
          )}
        </ActionsCell>
      );
    },
  },
];
