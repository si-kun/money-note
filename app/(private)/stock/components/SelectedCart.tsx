import { ShoppingCartWithItems } from "@/app/server-aciton/shopping/getShoppingCart";

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
  carts: ShoppingCartWithItems[];
  selectedCartId?: string | null;
  setSelectedCartId?: Dispatch<SetStateAction<string | null>>
}

const SelectedCart = ({ carts,selectedCartId,setSelectedCartId }: SelectedCartProps) => {
  return (
    <Select value={selectedCartId ?? undefined} onValueChange={(value) => setSelectedCartId?.(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="カートに入っていません" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Carts</SelectLabel>
            {carts.map((cart) => (
              <SelectItem key={cart.id} value={cart.id} >
                {cart.name} ({cart.items.length || 0}件)
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectedCart;
