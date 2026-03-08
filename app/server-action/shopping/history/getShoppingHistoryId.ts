"use server";

import { ApiResponse } from "@/app/types/api/api";
import { ShoppingHistoryWithItems } from "@/app/types/shopping/shopping";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";

export const getShoppingHistoryId = async (
  id: string
): Promise<ApiResponse<ShoppingHistoryWithItems | null>> => {
  try {

    const user = await getAuthUser();

    const result = await prisma.shoppingHistory.findUnique({
      where: { userId: user.id, id: id },
      include: { items: {
        include: {
          stock: true,
        },
      } },
    });

    return {
      success: true,
      message: "対象の買い物履歴が正常に取得されました",
      data: result,
    };
  } catch (error) {
    console.error("Error fetching shopping history by ID:", error);
    return {
      success: false,
      message: "対象の買い物履歴の取得に失敗しました",
      data: null,
    };
  }
};
