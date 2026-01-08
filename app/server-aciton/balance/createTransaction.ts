"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { Income, Payment } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface CreateTransaction {
  type: "income" | "payment";
  incomeData?: Omit<Income, "id" | "userId">;
  paymentData?: Omit<Payment, "id" | "userId">;
  historyId?: string | null;
}

export const createTransaction = async ({
  type,
  incomeData,
  paymentData,
  historyId,
}: CreateTransaction): Promise<ApiResponse<null>> => {
  try {
    const userId = "test-user-id";

    // incomeの場合
    if (type === "income" && incomeData) {
      await prisma.income.create({
        data: {
          ...incomeData,
          userId: userId,
        },
      });
    }
    // expenseの場合
    else if (type === "payment" && paymentData) {
      const payment =  await prisma.payment.create({
        data: {
          ...paymentData,
          userId: userId,
        },
      });

      if(payment && historyId) {
        await prisma.shoppingHistory.update({
          where: { id: historyId},
          data: {paymentId: payment.id,date: payment.paymentDate}
        })
      }
    } else {
      return {
        success: false,
        message: "必要な取引データが提供されていません。",
        data: null,
      };
    }

    revalidatePath("/");

    return {
      success: true,
      message: `${type === "income" ? "収入" : "支出"}を登録しました`,
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
