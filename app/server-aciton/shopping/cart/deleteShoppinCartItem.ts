"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const deleteShoppingCartItem = async (
  itemId: string,
  cartId: string | null
): Promise<ApiResponse<null>> => {
  try {
    // 1. 削除と同時に stock 情報も取得
    const deleteItem = await prisma.shoppingCartItem.delete({
      where: { id: itemId },
      include: { stock: true },
    });

    // 2. アイテムが在庫不足かどうかチェック
    if (
      deleteItem.stock &&
      deleteItem.stock.minQuantity !== null &&
      deleteItem.stock.quantity < deleteItem.stock.minQuantity
    ) {
      // 3. 在庫不足カートを取得または作成
      let lowStockCart = await prisma.shoppingCart.findFirst({
        where: {
          name: "在庫不足",
          userId: "test-user-id",
        },
      });

      if (!lowStockCart) {
        lowStockCart = await prisma.shoppingCart.create({
          data: {
            name: "在庫不足",
            userId: "test-user-id",
          },
        });
      }

      // 4. 在庫不足カートにアイテムを追加
      await prisma.shoppingCartItem.create({
        data: {
          itemName: deleteItem.itemName,
          quantity: deleteItem.quantity,
          unit: deleteItem.unit,
          unitPrice: deleteItem.unitPrice,
          checked: false,
          memo: deleteItem.memo,
          cartId: lowStockCart.id,
          stockId: deleteItem.stockId,
        },
      });
    }

    // 5. カートの中身が空になったらカート自体も削除
    if (cartId) {
      const remainingItems = await prisma.shoppingCartItem.count({
        where: { cartId },
      });

      if (remainingItems === 0) {
        await prisma.shoppingCart.delete({
          where: { id: cartId },
        });
      }
    }

    revalidatePath("/shopping");

    return {
      success: true,
      message: "アイテムを削除しました",
      data: null,
    };
  } catch (error) {
    console.error("Error deleting shopping cart:", error);
    return {
      success: false,
      message: "Error deleting shopping cart",
      data: null,
    };
  }
};
