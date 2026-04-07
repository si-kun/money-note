"use client";

import { ShoppingCartWithItems } from "@/app/types/shopping/shopping";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
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
      <SheetContent
        className="p-4 overflow-y-auto h-[80vh] flex flex-col"
        side="bottom"
      >
        <SheetHeader className="p-0">
          <SheetTitle>{cart.name}</SheetTitle>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {cart.items?.length || 0}件のアイテム
            </p>
          </div>

          {/* 商品追加ボタン */}
          {!isLowStockCart && (
            <Link href={"/stock"}>
              <Button variant={"secondary"}>商品を追加</Button>
            </Link>
          )}
        </SheetHeader>

        {/* テーブル */}
        <div className="overflow-y-auto flex-1">
          {isLowStockCart ? (
            <LowStockTable
              items={cart.items || []}
              availableCarts={availableCarts}
            />
          ) : (
            <NomalCartTable items={cart.items || []} />
          )}
        </div>
        {/* 「在庫不足」カートでは非表示 */}
        {!isLowStockCart && <BuyButton selectedCart={cart} />}
      </SheetContent>
    </Sheet>
  );
};

export default MobileCartSheet;
