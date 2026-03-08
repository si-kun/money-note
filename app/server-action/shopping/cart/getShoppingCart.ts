"use server";

import { ApiResponse } from "@/app/types/api/api";
import { ShoppingCartWithItems } from "@/app/types/shopping/shopping";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";
export const getShoppingCart = async (): Promise<
  ApiResponse<ShoppingCartWithItems[]>
> => {
  try {

    const user = await getAuthUser();

    const response = await prisma.shoppingCart.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: {
          include: {
            stock: true,
          },
        }
      },
    });

    // 在庫不足を先頭に並び変える
    const sortedResponse = response.sort((a, b) => {
      if(a.name === "在庫不足") return -1;
      if(b.name === "在庫不足") return 1;
      return 0;
    })

    return {
      success: true,
      message: "ショッピングカートが正常に取得されました",
      data: sortedResponse,
    };
  } catch (error) {
    console.error("Error fetching shopping cart:", error);
    return {
      success: false,
      message: "ショッピングカートの取得に失敗しました",
      data: [],
    };
  }
};
