"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteDialog from "./DeleteDialog";
import { ShoppingCartWithItems } from "@/app/types/shopping/shopping";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileCartSheet from "../@detail/cart/components/MobileCartSheet";
import { useEffect, useRef, useState } from "react";

interface CartListProps {
  cart: ShoppingCartWithItems;
  carts: ShoppingCartWithItems[];
}

const CartList = ({ cart,carts }: CartListProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const prevIsMobileRef = useRef<boolean | undefined>(undefined)

  const router = useRouter();

  const isMobile = useIsMobile();

  const handleClickLink = () => {
    if (isMobile) {
      return setIsSheetOpen(true);
    } else {
      router.push(`/shopping/cart/${cart.id}`);
    }
  };

  useEffect(() => {
    if(prevIsMobileRef.current === false && isMobile === true) {
      router.push("/shopping/cart");
    }
    prevIsMobileRef.current = isMobile
  },[isMobile])

  return (
    <>
      <Card
        key={cart.id}
        className="cursor-pointer hover:bg-accent transition-colors"
        onClick={handleClickLink}
      >
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base">{cart.name}</CardTitle>
          <DeleteDialog name={cart.name} id={cart.id} />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {cart.items?.length || 0}件の商品がカートに入っています
          </p>
        </CardContent>
      </Card>

      <MobileCartSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        cart={cart}
        carts={carts}
      />
    </>
  );
};

export default CartList;
