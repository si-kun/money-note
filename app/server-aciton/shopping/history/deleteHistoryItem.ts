"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

interface DeleteHistoryItemProps {
    historyId: string;
    itemId: string;
}

export const deleteHistoryItem = async (
  {historyId,itemId}:DeleteHistoryItemProps
): Promise<ApiResponse<null>> => {
  try {
    await prisma.$transaction(async (tx) => {
      // 履歴の対象アイテムを取得
      const targetItem = await tx.shoppingCartItem.findUnique({
        where: { id: itemId },
      });

      // 対象のアイテムが存在しなかったらエラー
      if (!targetItem) {
        throw new Error("対象のアイテムが見つかりませんでした");
      }

      // stockIdがある場合は在庫数を減少
      if (targetItem.stockId) {
        await tx.stock.update({
          where: { id: targetItem.stockId },
          data: {
            quantity: {
              decrement: targetItem.quantity,
            },
          },
        });
      }

      // アイテムを削除
      await tx.shoppingCartItem.delete({
        where: { id: itemId },
      });

      // アイテムを削除した後、1件もアイテムがない場合、履歴を削除する
      const targetHistory = await tx.shoppingHistory.findUnique({
        where: { id: historyId },
        include: {
          items: true,
        },
      })

      if(!targetHistory) {
        throw new Error("対象の履歴が見つかりませんでした");
      }

      if(targetHistory.items.length === 0) {
        await tx.shoppingHistory.delete({
          where: { id: historyId },
        });
      }
    });

    revalidatePath("/shopping/history");

    return {
      success: true,
      data: null,
      message: "履歴アイテムを削除しました",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting history item:", error.message);
      return {
        success: false,
        data: null,
        message: error.message || "履歴アイテムの削除中にエラーが発生しました",
      };
    }
    console.error("Error deleting history item:", error);
    return {
      success: false,
      data: null,
      message: "履歴アイテムの削除中にエラーが発生しました",
    };
  }
};
