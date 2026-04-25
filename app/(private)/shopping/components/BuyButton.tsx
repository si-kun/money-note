"use client";

import { buyShoppingCart } from "@/app/server-action/shopping/cart/buyShoppingCart";
import { pendingAtom } from "@/app/store/shopping/cartAtom";
import { ShoppingCartWithItems } from "@/app/types/shopping/shopping";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import { toast } from "sonner";

interface BuyButtonProps {
    selectedCart: ShoppingCartWithItems;
}

const BuyButton = ({selectedCart}:BuyButtonProps) => {

  const isPending = useAtomValue(pendingAtom)

  const handlebuyItems = async () => {
    try {
      const result =  await buyShoppingCart(selectedCart);
      if(result.success) {
        window.dispatchEvent(new Event("historyUpdate"))
        toast.success("購入が完了しました");
      } else {
        toast.error(result.message || "購入に失敗しました");
      }
    } catch (error) {
      console.error("Error buying items:", error);
    }
  };

  return (
    <Button
      disabled={
        isPending > 0 || !selectedCart.items.some((item) => item.checked)
      }
      variant={"secondary"}
      className="bg-green-500 hover:bg-green-400 disabled:bg-slate-400 mt-4 ml-auto block"
      onClick={() => handlebuyItems()}
    >
      {isPending ? "処理中" : "チェックしたアイテムを購入"}
    </Button>
  );
};

export default BuyButton;
