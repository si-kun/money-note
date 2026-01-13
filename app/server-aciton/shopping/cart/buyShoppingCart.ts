"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { ShoppingCart } from "@prisma/client";

export const buyShoppingCart = async (
  cart: ShoppingCart
): Promise<ApiResponse<null>> => {
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

    // 買い物カテゴリーを取得
    const shoppingCategory = await prisma.category.findFirst({
      where: {
        name: "買い物",
      },
    });

    // カテゴリが見つからない場合はエラー
    if (!shoppingCategory) {
      return {
        success: false,
        message: "買い物カテゴリが見つかりません。管理者に連絡してください。",
        data: null,
      };
    }

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

    // paymentを作成
    const payment = await prisma.payment.create({
      data: {
        amount: totalPrice,
        paymentDate: history.date,
        userId: "test-user-id",
        categoryId: shoppingCategory.id,
      },
    });

    // historyにpaymentIdを保存
    await prisma.shoppingHistory.update({
      where: {
        id: history.id,
      },
      data: {
        paymentId: payment.id,
      },
    });

    await prisma.shoppingCartItem.updateMany({
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
        await prisma.stock.update({
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
    const remainingItems = await prisma.shoppingCartItem.count({
      where: {
        cartId: cart.id,
      },
    });
    if (remainingItems === 0) {
      await prisma.shoppingCart.delete({
        where: {
          id: cart.id,
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
