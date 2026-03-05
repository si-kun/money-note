"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

interface EditIncome {
  data: {
    id: string;
    title?: string;
    memo?: string;
    amount: number;
    categoryId: string;
  };
}

export const editIncome = async ({
  data,
}: EditIncome): Promise<ApiResponse<null>> => {
  try {

    const oldCategory = await prisma.income.findUnique({
      where: {
        id: data.id,
      },
      select: {
        categoryId: true,
      },
    })

    await prisma.income.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        memo: data.memo,
        amount: data.amount,
        categoryId: data.categoryId,
      },
    });

    // カテゴリーが変更された場合、1件もなければ該当のカテゴリーを削除する
    if(oldCategory?.categoryId !== data.categoryId) {
      const count = await prisma.income.count({
        where: {
          categoryId: oldCategory?.categoryId,
        }
      })

      if(count === 0) {
        await prisma.category.delete({
          where: {
            id: oldCategory?.categoryId,
          }
        })
      }
    }

    revalidatePath("/");

    return {
      success: true,
      message: "収入の編集に成功しました。",
      data: null,
    };
  } catch (error) {
    console.error("Error editing income:", error);
    return {
      success: false,
      message: "収入の編集に失敗しました。",
      data: null,
    };
  }
};
