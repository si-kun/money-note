"use server";

import { ApiResponse } from "@/app/types/api/api";
import { TransactionsFormType } from "@/app/types/zod/transaction";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const createTransaction = async (
  data: TransactionsFormType
): Promise<ApiResponse<null>> => {
  try {
    const { type, historyId, categoryId, amount, memo } = data;
    const userId = "test-user-id";

    // incomeの場合
    if (type === "INCOME") {
      await prisma.income.create({
        data: {
          categoryId,
          amount,
          memo,
          userId: userId,
        },
      });
    }
    // expenseの場合
    else if (type === "PAYMENT") {
      const payment = await prisma.payment.create({
        data: {
          categoryId,
          amount,
          memo,
          userId: userId,
        },
      });

      if (payment && historyId) {
        await prisma.shoppingHistory.update({
          where: { id: historyId },
          data: { paymentId: payment.id, date: payment.paymentDate },
        });
      }
    } else {
      return {
        success: false,
        message: "必要な取引データが提供されていません。",
        data: null,
      };
    }

    revalidatePath("/", "page");

    return {
      success: true,
      message: `${type === "INCOME" ? "収入" : "支出"}を登録しました`,
      data: null,
    };
  } catch (error) {
    console.error("取引の作成中にエラーが発生しました:", error);
    return {
      success: false,
      message: "取引の作成に失敗しました。",
      data: null,
    };
  }
};
