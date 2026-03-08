"use server";

import { ApiResponse } from "@/app/types/api/api";
import { ShoppingHistoryWithItems } from "@/app/types/shopping/shopping";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";

interface GetShoppingHistory {
  year: number;
  month: number;
}

export const getShoppingHistory = async ({
  year,
  month,
}: GetShoppingHistory): Promise<ApiResponse<ShoppingHistoryWithItems[]>> => {
  try {

    const user = await getAuthUser();

    const response = await prisma.shoppingHistory.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      include: {
        items: {
          include: {
            stock: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return {
      success: true,
      message: "買い物履歴が正常に取得されました",
      data: response,
    };
  } catch (error) {
    console.error("Error fetching shopping history:", error);
    return {
      success: false,
      message: "買い物履歴の取得に失敗しました",
      data: [],
    };
  }
};
