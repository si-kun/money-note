"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const deleteShoppingCart = async (
  itemId: string
): Promise<ApiResponse<null>> => {
  try {
    await prisma.shoppingCartItem.delete({
      where: {
        id: itemId,
      },
    });

    revalidatePath("/shopping");

    return {
      success: true,
      message: "アイテムを削除しました",
      data: null,
    };
  } catch (error) {
    console.error("Error deleting shopping cart:", error);
    return {
      success: false,
      message: "Error deleting shopping cart",
      data: null,
    };
  }
};
