"use server";

import { ApiResponse } from "@/app/types/api/api";
import { ShoppingHistoryWithItems } from "./getShoppingHistory";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { ShoppingCart } from "@prisma/client";

export const buyShoppingCart = async (
  cart: ShoppingCart,
): Promise<ApiResponse<ShoppingHistoryWithItems | null>> => {
  try {
    // チェックがtrueのShoppingCartItemを取得
    const cartItems = await prisma.shoppingCartItem.findMany({
      where: {
        cartId: cart.id,
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
        name: cart.name,
        date: new Date(),
        userId: "test-user-id",
        totalPrice,
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

    // カートの中身が空になったらカート自体も削除する
    const remainingItems = await prisma.shoppingCartItem.count({
      where: {
        cartId: cart.id,
      },
    });
    if (remainingItems === 0) {
      await prisma.shoppingCart.delete({
        where: {
          id: cart.id
        },
      });
    }

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
