"use server";

import { ApiResponse } from "@/app/types/api/api";
import { ShoppingCartItemInput } from "@/app/types/zod/shoppingCartItem";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

interface EditShoppingHistoryItem {
  itemId: string;
  data: ShoppingCartItemInput;
}

export const editShoppingHistoryItem = async ({
  itemId,
  data,
}: EditShoppingHistoryItem): Promise<ApiResponse<null>> => {
  try {
    await prisma.$transaction(async (tx) => {
      const existingItem = await tx.shoppingCartItem.findUnique({
        where: { id: itemId },
      });

      // 履歴アイテムの更新処理
      if (data.historyId) {
        await tx.shoppingCartItem.update({
          where: { id: itemId },
          data: {
            itemName: data.itemName,
            quantity: data.quantity,
            unit: data.unit,
            unitPrice: data.unitPrice,
            memo: data.memo || "",
            stockId: data.stockId || null,
          },
        });
      }

      // 履歴アイテム更新後に、他の履歴アイテムの名前も更新する
      if (data.stockId) {
        await tx.shoppingCartItem.updateMany({
          where: {
            stockId: data.stockId,
            NOT: {
              id: itemId,
            },
          },
          data: {
            itemName: data.itemName,
            unit: data.unit,
          },
        });
      }

      // stockIdと履歴IDが存在したら、在庫も更新する
      if (data.stockId) {
        const existingStock = await tx.stock.findUnique({
          where: { id: data.stockId },
        });

        if (existingItem && existingStock) {
          const diffQuantity = data.quantity - (existingItem.quantity || 0);

          const newQuantity = existingStock.quantity + diffQuantity;

          if (newQuantity < 0) {
            throw new Error("在庫数量がマイナスになるため、更新できません。");
          }

          await tx.stock.update({
            where: { id: data.stockId },
            data: {
              name: data.itemName,
              quantity: { increment: diffQuantity },
              unit: data.unit,
              unitPrice: data.unitPrice,
            },
          });
        }
      }
    });

    revalidatePath("/shopping/history");

    return {
      success: true,
      message: "履歴アイテムの編集に成功しました",
      data: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error editing shopping history item:", error.message);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
    return {
      success: false,
      message: "履歴アイテムの編集に失敗しました",
      data: null,
    };
  }
};
