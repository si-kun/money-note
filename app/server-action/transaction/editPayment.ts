"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

interface EditPayment {
  data: {
    id: string;
    title?: string;
    categoryId: string;
    amount: number;
    memo?: string;
  };
}

export const editPayment = async ({
  data,
}: EditPayment): Promise<ApiResponse<null>> => {
  try {
    await prisma.$transaction(async (tx) => {

      const oldCategory = await tx.payment.findUnique({
        where: {
          id: data.id,
        },
        select: {
          categoryId: true,
        },
      })

      await tx.payment.update({
        where: {
          id: data.id,
        },
        data: {
          title: data.title,
          amount: data.amount,
          categoryId: data.categoryId,
          memo: data.memo,
        },
      });

      await tx.shoppingHistory.updateMany({
        where: {
          paymentId: data.id,
        },
        data: {
          name: data.title || "",
          totalPrice: data.amount || 0,
        }
      })

      // カテゴリーが変更され、1件もない場合かつ買い物カテゴリーではない場合、該当のカテゴリーを削除
      if(oldCategory?.categoryId !== data.categoryId) {
        const count = await tx.payment.count({
          where: {
            categoryId: oldCategory?.categoryId,
          }
        })

        const oldCategoryName = await tx.category.findUnique({
          where: {
            id: oldCategory?.categoryId,
          },
          select: {
            name: true,
          }
        })

        if(count === 0 && oldCategoryName?.name !== "買い物") {
          await tx.category.delete({
            where: {
              id: oldCategory?.categoryId,
            }
          })
        }
      }
    });

    revalidatePath("/");

    return {
      success: true,
      message: "支出の編集に成功しました。",
      data: null,
    };
  } catch (error) {
    console.error("Error editing payment:", error);
    return {
      success: false,
      message: "支出の編集に失敗しました。",
      data: null,
    };
  }
};
