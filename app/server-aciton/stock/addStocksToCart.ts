"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { ShoppingCartItem } from "@prisma/client";

export type AddStockItem = Pick<
  ShoppingCartItem,
  "itemName" | "quantity" | "unit" | "unitPrice" | "stockId" | "memo"
>;

interface AddStocksToCar {
  cartId?: string;
  cartName?: string;
  items: AddStockItem[];
}

export const addStocksToCart = async ({
  cartId,
  items,
  cartName,
}: AddStocksToCar): Promise<ApiResponse<null>> => {
  try {
    // 新規カートを作成の場合
    if (!cartId && cartName) {
      const newCart = await prisma.shoppingCart.create({
        data: {
          name: cartName,
          userId: "test-user-id",
        },
      });

      // 作成したカートにアイテムを追加
      await prisma.shoppingCartItem.createMany({
        data: items.map((item) => ({
          itemName: item.itemName,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          cartId: newCart.id,
          stockId: item.stockId,
        }))
      })
    }
    // 既存カートに追加の場合
    else {
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
    }

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
