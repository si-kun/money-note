"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";
import { revalidatePath } from "next/cache";

export const deleteShoppingCartItem = async (
  itemId: string,
  cartId: string | null
): Promise<ApiResponse<null>> => {
  try {

    const user = await getAuthUser();
    const userId = user.id;

    // 1. 削除と同時に stock 情報も取得
    await prisma.$transaction(async (tx) => {

    const deleteItem = await tx.shoppingCartItem.delete({
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
      let lowStockCart = await tx.shoppingCart.findFirst({
        where: {
          name: "在庫不足",
          userId,
        },
      });

      if (!lowStockCart) {
        lowStockCart = await tx.shoppingCart.create({
          data: {
            name: "在庫不足",
            userId,
          },
        });
      }

      // 4. 在庫不足カートにアイテムを追加
      await tx.shoppingCartItem.create({
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
      const remainingItems = await tx.shoppingCartItem.count({
        where: { cartId },
      });

      if (remainingItems === 0) {
        await tx.shoppingCart.delete({
          where: { id: cartId },
        });
      }
    }
  })


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
      message: "アイテムの削除中にエラーが発生しました",
      data: null,
    };
  }
};
