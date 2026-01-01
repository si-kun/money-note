"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const quantityIncrement = async (
  stockId: string,newQuantity: number
): Promise<ApiResponse<null>> => {
  try {
    await prisma.stock.update({
      where: { id: stockId },
      data: {
        quantity: newQuantity,
      },
    });

    revalidatePath("/stock");

    return {
      success: true,
      message: "在庫数を増加しました。",
      data: null,
    };
  } catch (error) {
    console.error("在庫数の増加中にエラーが発生しました:", error);
    return {
      success: false,
      message: "在庫数の増加に失敗しました。",
      data: null,
    };
  }
};
