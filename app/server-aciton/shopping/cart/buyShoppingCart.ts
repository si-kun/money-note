"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { ShoppingCart } from "@prisma/client";

export const buyShoppingCart = async (
  cart: ShoppingCart
): Promise<ApiResponse<null>> => {

  const adjustedDate = new Date();
  adjustedDate.setHours(12, 0, 0, 0);

  try {

    await prisma.$transaction(async (tx) => {

    // チェックがtrueのShoppingCartItemを取得
    const cartItems = await tx.shoppingCartItem.findMany({
      where: {
        cartId: cart.id,
        checked: true,
      },
    });

    // 合計金額を計算
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + (item.unitPrice ?? 0) * item.quantity;
    }, 0);

    // 買い物カテゴリーを取得
    const shoppingCategory = await tx.category.findFirst({
      where: {
        name: "買い物",
      },
    });

    // カテゴリが見つからない場合はエラー
    if (!shoppingCategory) {
      throw new Error("カテゴリーが見つかりません。")
    }

    // ShoppingHistoryに追加
    const history = await tx.shoppingHistory.create({
      data: {
        name: cart.name,
        date: adjustedDate,
        userId: "test-user-id",
        totalPrice,
      },
      include: {
        items: true,
      },
    });

    // paymentを作成
    const payment = await tx.payment.create({
      data: {
        amount: totalPrice,
        paymentDate: history.date,
        userId: "test-user-id",
        categoryId: shoppingCategory.id,
      },
    });

    // historyにpaymentIdを保存
    await tx.shoppingHistory.update({
      where: {
        id: history.id,
      },
      data: {
        paymentId: payment.id,
      },
    });

    await tx.shoppingCartItem.updateMany({
      where: {
        id: {
          in: cartItems.map((item) => item.id),
        },
      },
      data: {
        cartId: null,
        historyId: history.id,
      },
    });

    // 在庫を増やす
    for (const item of cartItems) {
      if (item.stockId) {
        await tx.stock.update({
          where: {
            id: item.stockId,
          },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    // カートの中身が空になったらカート自体も削除する
    const remainingItems = await tx.shoppingCartItem.count({
      where: {
        cartId: cart.id,
      },
    });
    if (remainingItems === 0) {
      await tx.shoppingCart.delete({
        where: {
          id: cart.id,
        },
      });
    }
  })


    revalidatePath("/shopping", "layout");

    return {
      success: true,
      message: "Shopping cart purchased successfully.",
      data: null,
    };
  } catch (error) {
    console.error("Error buying shopping cart:", error);
    if(error instanceof Error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
    return {
      success: false,
      message: "Failed to buy shopping cart.",
      data: null,
    };
  }
};
