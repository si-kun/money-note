"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const deleteHistory = async (
  historyId: string
): Promise<ApiResponse<null>> => {
  try {
    await prisma.$transaction(async (tx) => {
      // 削除する履歴を取得
      const history = await tx.shoppingHistory.findUnique({
        where: { id: historyId },
        include: { items: true },
      });

      if (!history) {
        throw new Error("履歴が見つかりません");
      }

      // 関連する在庫の数量を更新
      for (const item of history.items) {
        if (item.stockId) {
          await tx.stock.update({
            where: { id: item.stockId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // 履歴を削除
      await tx.shoppingHistory.delete({
        where: { id: historyId },
      });
    });
    revalidatePath("/shopping/history");
    return {
      success: true,
      data: null,
      message: "履歴が削除されました",
    };
  } catch (error) {
    console.error("履歴の削除に失敗:", error);
    if (error instanceof Error) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
    return {
      success: false,
      data: null,
      message: "履歴の削除に失敗しました",
    };
  }
};
