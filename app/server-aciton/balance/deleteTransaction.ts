"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const deleteTransaction = async (
  id: string,
  type: "INCOME" | "PAYMENT"
): Promise<ApiResponse<null>> => {
  try {
    if (type === "INCOME") {
      await prisma.income.delete({
        where: { id },
      });
    }

    if (type === "PAYMENT") {
      // カテゴリーが買い物リストの場合、関連する履歴も削除
      const history = await prisma.shoppingHistory.findUnique({
        where: { paymentId: id },
        include: { items: true },
      });

      // 在庫を減らす
      if (history) {
        await prisma.$transaction(async (tx) => {
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

          await tx.payment.delete({
            where: { id },
          });
        });
      } else {
        await prisma.payment.delete({
          where: { id },
        });
      }
    }

    revalidatePath("/");

    return {
      success: true,
      message: "取引が正常に削除されました。",
      data: null,
    };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return {
      success: false,
      message: "取引の削除に失敗しました。",
      data: null,
    };
  }
};
