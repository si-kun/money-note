"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const updateShoppingChecked = async (
  id: string,
  checked: boolean
): Promise<ApiResponse<null>> => {
  try {
    await prisma.shoppingCartItem.update({
      where: { id },
      data: {
        checked,
      },
    });

    revalidatePath("/shopping/cart/[id]");

    return {
      success: true,
      data: null,
      message: "チェック状態の更新に成功しました。",
    };
  } catch (error) {
    console.error("Error updating shopping checked status:", error);
    return {
      success: false,
      data: null,
      message: "チェック状態の更新に失敗しました。",
    };
  }
};
