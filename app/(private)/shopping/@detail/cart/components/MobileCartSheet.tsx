"use client"

import { ShoppingCartWithItems } from "@/app/types/shopping/shopping";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import LowStockTable from "./LowStockTable";
import NomalCartTable from "./NomalCartTable";
import BuyButton from "../../../components/BuyButton";

interface MobileCartSheetProps {
  isSheetOpen: boolean;
  setIsSheetOpen: Dispatch<SetStateAction<boolean>>;
  cart: ShoppingCartWithItems;
  carts: ShoppingCartWithItems[];
}

const MobileCartSheet = ({
  isSheetOpen,
  setIsSheetOpen,
  cart,
  carts,
}: MobileCartSheetProps) => {
  const availableCarts = carts.filter((cart) => cart.name !== "在庫不足");

  const isLowStockCart = cart.name === "在庫不足";

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent className="p-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{cart.name}</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Card className="h-full">
          <CardHeader className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>{cart.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {cart.items?.length || 0}件のアイテム
              </p>
            </div>
            {!isLowStockCart && (
              <Link href={"/stock"}>
                <Button variant={"secondary"}>商品を追加</Button>
              </Link>
            )}
          </CardHeader>
          <CardContent className="overflow-y-auto">
            {isLowStockCart ? (
              <LowStockTable
                items={cart.items || []}
                availableCarts={availableCarts}
              />
            ) : (
              <NomalCartTable items={cart.items || []} />
            )}
            {/* 「在庫不足」カートでは非表示 */}
            {!isLowStockCart && <BuyButton selectedCart={cart} />}
          </CardContent>
        </Card>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileCartSheet;
