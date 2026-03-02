"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const deleteCart = async (
  cartId: string
): Promise<ApiResponse<null>> => {
  try {
    await prisma.shoppingCart.delete({
      where: {
        id: cartId,
      },
    });

    revalidatePath("/shopping/cart");

    return {
      success: true,
      message: "カートの削除に成功しました。",
      data: null,
    };
  } catch (error) {
    console.error("Error deleting cart history:", error);
    return {
      success: false,
      message: "カートの削除に失敗しました。",
      data: null,
    };
  }
};
