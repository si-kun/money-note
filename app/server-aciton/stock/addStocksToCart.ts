"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { ShoppingCartItem } from "@prisma/client";

export type AddStockItem = Pick<
  ShoppingCartItem,
  "itemName" | "quantity" | "unit" | "unitPrice" | "stockId" | "memo"
>;

interface AddStocksToCar {
  cartId: string;
  items: AddStockItem[];
}

export const addStocksToCart = async ({
  cartId,
  items,
}: AddStocksToCar): Promise<ApiResponse<null>> => {
  try {
    await prisma.shoppingCartItem.createMany({
      data: items.map((item) => ({
        itemName: item.itemName,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        cartId: cartId,
        stockId: item.stockId,
      })),
    });

    return {
      success: true,
      message: "カートに追加しました。",
      data: null,
    };
  } catch (error) {
    console.error("Error adding stocks to cart:", error);
    return {
      success: false,
      message: "カートへの追加に失敗しました。",
      data: null,
    };
  }
};
