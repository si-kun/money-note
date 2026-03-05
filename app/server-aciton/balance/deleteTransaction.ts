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
      const oldCategory = await prisma.income.findUnique({
        where: {
          id,
        },
        select: {
          categoryId: true,
        },
      });

      await prisma.income.delete({
        where: { id },
      });

      // 1件もなければ該当カテゴリーを削除
      const count = await prisma.income.count({
        where: {
          categoryId: oldCategory?.categoryId,
        },
      });
      if (count === 0) {
        await prisma.category.delete({
          where: {
            id: oldCategory?.categoryId,
          },
        });
      }
    }

    if (type === "PAYMENT") {
      await prisma.$transaction(async (tx) => {
        const oldCategory = await tx.payment.findUnique({
          where: {
            id,
          },
          select: {
            categoryId: true,
          },
        });

        // カテゴリーが買い物リストの場合、関連する履歴も削除
        const history = await tx.shoppingHistory.findUnique({
          where: { paymentId: id },
          include: { items: true },
        });

        // 在庫を減らす
        if (history) {
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
        } else {
          await tx.payment.delete({
            where: { id },
          });
        }

        // カテゴリーが1件もない、買い物カテゴリーではない場合、カテゴリーを削除する
        if (oldCategory?.categoryId) {
          const count = await tx.payment.count({
            where: {
              categoryId: oldCategory?.categoryId,
            },
          });

          const category = await tx.category.findUnique({
            where: {
              id: oldCategory?.categoryId,
            },
          });

          if (count === 0 && category?.name !== "買い物") {
            await tx.category.delete({
              where: {
                id: oldCategory?.categoryId,
              },
            });
          }
        }
      });
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
