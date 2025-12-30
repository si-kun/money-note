"use server";

import { ApiResponse } from "@/app/types/api/api";
import { ShoppingCartItemInput } from "@/app/types/zod/shoppingCartItem";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

interface EditShoppingCartItem {
  itemId: string;
  data: ShoppingCartItemInput;
}

export const editShoppingCartItem = async ({
  itemId,
  data,
}: EditShoppingCartItem): Promise<ApiResponse<null>> => {
  try {
    await prisma.shoppingCartItem.update({
      where: {
        id: itemId,
      },
      data: {
        itemName: data.itemName,
        quantity: Number(data.quantity),
        unitPrice: data.unitPrice ?? null,
        unit: data.unit,
        memo: data.memo ?? null,
      },
    });

    revalidatePath("/shopping");

    return {
      success: true,
      message: "ショッピングカートアイテムを編集しました",
      data: null,
    };
  } catch (error) {
    console.error("Error editing shopping cart item:", error);
    return {
      success: false,
      message: "Error editing shopping cart item",
      data: null,
    };
  }
};
