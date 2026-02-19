
import { ShoppingCartItemWithStock } from "@/app/(private)/shopping/@detail/cart/components/shoppingColumns";
import { ShoppingCartWithItems } from "@/app/server-aciton/shopping/cart/getShoppingCart";


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
