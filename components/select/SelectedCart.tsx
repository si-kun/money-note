
import { ShoppingCartItemWithStock } from "@/app/(private)/shopping/@detail/cart/components/shoppingColumns";
import { ShoppingCartWithItems } from "@/app/types/shopping/shopping";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

interface SelectedCartProps {
  onCartSelect?: (cartId: string) => void;
  selectedCartId?: string | null;
  setSelectedCartId?: Dispatch<SetStateAction<string | null>>;
  autoSubmit?: boolean;
  row?: ShoppingCartItemWithStock;
  carts: ShoppingCartWithItems[];
}

const SelectedCart = ({
  onCartSelect,
  autoSubmit,
  selectedCartId,
  setSelectedCartId,
  carts,
}: SelectedCartProps) => {

  // 在庫不足のカートは表示しない
   const filteredCarts = carts.filter((cart) => {
    return cart.name !== "在庫不足"
   })

   console.log("filteredCarts", filteredCarts)

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
          {filteredCarts.map((cart) => (
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
