"use client";

import { ShoppingCartItemWithStock } from "@/app/(private)/shopping/cart/components/shoppingColumns";
import {
  getShoppingCart,
  ShoppingCartWithItems,
} from "@/app/server-aciton/shopping/cart/getShoppingCart";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SelectedCartProps {
  onCartSelect?: (cartId: string) => void;
  selectedCartId?: string | null;
  setSelectedCartId?: Dispatch<SetStateAction<string | null>>;
  autoSubmit?: boolean;
  row?: ShoppingCartItemWithStock;
}

const SelectedCart = ({
  onCartSelect,
  autoSubmit,
  selectedCartId,
  setSelectedCartId,
}: SelectedCartProps) => {
  const [carts, setCarts] = useState<ShoppingCartWithItems[]>([]);

  useEffect(() => {
    const getCarts = async () => {
      try {
        const response = await getShoppingCart();
        if (response.success) {
          const data = response.data.filter((cart) => cart.name !== "在庫不足");
          setCarts(data || []);
        }
      } catch (error) {
        console.error("Error fetching carts:", error);
      }
    };
    getCarts();
  }, []);

  return (
    <Select
      value={selectedCartId ?? "カートに入っていません"}
      onValueChange={(value) => {
        if (setSelectedCartId) {
          setSelectedCartId?.(value);
        }
        if(autoSubmit && onCartSelect) {
          onCartSelect(value);
        }
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="カートに入っていません" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Carts</SelectLabel>
          {carts.map((cart) => (
            <SelectItem key={cart.id} value={cart.id}>
              {cart.name} ({cart.items.length || 0}件)
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectedCart;
