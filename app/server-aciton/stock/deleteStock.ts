"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const deleteStock = async (id: string): Promise<ApiResponse<null>> => {
  try {
    await prisma.stock.delete({
      where: {
        id,
      },
    });

    revalidatePath("/(private)/stock");

    return {
      success: true,
      message: "在庫が正常に削除されました。",
      data: null,
    };
  } catch (error) {
    console.error("在庫の削除中にエラーが発生しました:", error);
    return {
      success: false,
      message: "在庫の削除に失敗しました。",
      data: null,
    };
  }
};
