"use client"

import { useMemo } from "react";
import { ShoppingCartItemTable } from "./shoppingCartData-table";
import SelectedCart from "@/components/select/SelectedCart";
import { ColumnDef } from "@tanstack/react-table";
import { ShoppingCartItemWithStock } from "./shoppingColumns";
import { lowStockSelectedCart } from "@/app/server-aciton/shopping/cart/lowStockSelectedCart";
import { toast } from "sonner";
import { ShoppingCartWithItems } from "@/app/types/shopping/shopping";

interface LowStockTableProps {
  items: ShoppingCartItemWithStock[];
  availableCarts: ShoppingCartWithItems[];
}

const LowStockTable = ({ items, availableCarts }: LowStockTableProps) => {

    const columns = useMemo((): ColumnDef<ShoppingCartItemWithStock>[] => [
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
          id: "selectedCart",
          header: "カート選択",
          cell: ({ row }) => {
            const handleCartSelect = async (cartId: string) => {
              if (!cartId) return;
             const result = await lowStockSelectedCart(row.original, cartId);
              if (result.success) {
                toast.success(result.message);
              } else {
                toast.error(result.message);
              }
            };
            return (
              <SelectedCart
                carts={availableCarts}
                selectedCartId={row.original.cartId}
                onCartSelect={handleCartSelect}
                autoSubmit={true}
                row={row.original}
              />
            );
          },
        },
      ], [availableCarts]);

  return (
    <ShoppingCartItemTable
      items={items}
      columns={columns}
    />
  );
};

export default LowStockTable;
