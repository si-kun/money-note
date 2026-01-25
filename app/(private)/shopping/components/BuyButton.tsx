"use client";

import { buyShoppingCart } from "@/app/server-aciton/shopping/cart/buyShoppingCart";
import { ShoppingCartWithItems } from "@/app/server-aciton/shopping/cart/getShoppingCart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BuyButtonProps {
    selectedCart: ShoppingCartWithItems;
}

const BuyButton = ({selectedCart}:BuyButtonProps) => {

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
      disabled={!selectedCart.items.some((item) => item.checked)}
      variant={"secondary"}
      className="bg-green-500 hover:bg-green-400 disabled:bg-slate-400 mt-4 ml-auto block"
      onClick={() => handlebuyItems()}
    >
      チェックしたアイテムを購入
    </Button>
  );
};

export default BuyButton;
