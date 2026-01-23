"use server";

import { ApiResponse } from "@/app/types/api/api";
import { ShoppingCartItemInput } from "@/app/types/zod/shoppingCartItem";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

interface EditShoppingCartItem {
  itemId: string;
  data: ShoppingCartItemInput;
}

export const editShoppingCartItem = async ({
  itemId,
  data,
}: EditShoppingCartItem): Promise<ApiResponse<null>> => {
  try {
    await prisma.$transaction(async (tx) => {
      // 更新前の商品情報を取得
      const existingItem = await tx.shoppingCartItem.findUnique({
        where: {
          id: itemId,
        },
      });

      // 対象の在庫も更新する
      if (data.stockId) {
        const stockItem = await tx.stock.findUnique({
          where: {
            id: data.stockId,
          },
        });

        if (stockItem && existingItem) {
          const newStockQuantity =
            stockItem.quantity + (data.quantity - existingItem.quantity);

          if (newStockQuantity < 0) {
            throw new Error(
              `在庫数が0未満になるため更新できません:${newStockQuantity}`
            );
          }

          await tx.stock.updateMany({
            where: {
              id: stockItem.id,
            },
            data: {
              name: data.itemName,
              unit: data.unit,
              // 既存の数量から編集後の数量の差分を計算して更新
              quantity:
                stockItem.quantity + (data.quantity - existingItem.quantity),
            },
          });
        }
      }
      // 商品を更新する
      await tx.shoppingCartItem.update({
        where: {
          id: itemId,
        },
        data: {
          itemName: data.itemName,
          quantity: Number(data.quantity),
          unitPrice: data.unitPrice ?? null,
          unit: data.unit,
          memo: data.memo ?? null,
        },
      });
    });

    revalidatePath("/shopping", "layout");

    return {
      success: true,
      message: "ショッピングカートアイテムを編集しました",
      data: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error editing shopping cart item:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
    return {
      success: false,
      message: "ショッピングカートアイテムの編集中にエラーが発生しました",
      data: null,
    };
  }
};
