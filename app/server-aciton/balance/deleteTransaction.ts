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
      await prisma.payment.delete({
        where: { id },
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
