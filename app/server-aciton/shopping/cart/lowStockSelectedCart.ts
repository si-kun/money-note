"use server";

import { ShoppingCartItemWithStock } from "@/app/(private)/shopping/@detail/cart/components/shoppingColumns";
import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const lowStockSelectedCart = async (
  lowItem: ShoppingCartItemWithStock,
  newCartId: string
): Promise<ApiResponse<null>> => {
  try {
    // 在庫不足カートから指定したカートへアイテムを移動
    await prisma.shoppingCartItem.update({
      where: {
        id: lowItem.id,
      },
      data: {
        cartId: newCartId,
        checked: false,
      },
    });

    // カートが空になった場合、そのカートを削除
    const remainingItems = await prisma.shoppingCartItem.count({
      where: { cartId: lowItem.cartId },
    });

    if( remainingItems === 0 && lowItem.cartId) {
        await prisma.shoppingCart.delete({
            where: { id: lowItem.cartId },
        });
    }

    revalidatePath("/shopping");
    return {
      success: true,
      message: "アイテムをカートに追加しました",
      data: null,
    };
  } catch (error) {
    console.error("Error fetching low stock cart:", error);
    return {
      success: false,
      message: "Error fetching low stock cart",
      data: null,
    };
  }
};
