"use server";

import { ApiResponse } from "@/app/types/api/api";
import { ShoppingHistoryWithItems } from "./getShoppingHistory";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const buyShoppingCart = async (
  cartId: string
): Promise<ApiResponse<ShoppingHistoryWithItems | null>> => {
  try {
    // チェックがtrueのShoppingCartItemを取得
    const cartItems = await prisma.shoppingCartItem.findMany({
      where: {
        cartId,
        checked: true,
      },
    });

    // 合計金額を計算
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + (item.unitPrice ?? 0) * item.quantity;
    }, 0);

    // ShoppingHistoryに追加
    const history = await prisma.shoppingHistory.create({
      data: {
        date: new Date(),
        userId: "test-user-id",
        totalPrice,
        items: {
          create: cartItems.map((item) => ({
            itemName: item.itemName,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    await prisma.shoppingCartItem.updateMany({
      where: {
        id: {
          in: cartItems.map((item) => item.id),
        }
      },
      data: {
        cartId: null,
        historyId: history.id
      }
    })

    // ShoppingCartからチェックがtrueのアイテムを削除
    await prisma.shoppingCartItem.deleteMany({
      where: {
        cartId,
        checked: true,
      },
    });

    revalidatePath("/shopping");

    return {
      success: true,
      message: "Shopping cart purchased successfully.",
      data: null,
    };
  } catch (error) {
    console.error("Error buying shopping cart:", error);
    return {
      success: false,
      message: "Failed to buy shopping cart.",
      data: null,
    };
  }
};
