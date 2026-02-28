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
          orderBy: {
            checked: "asc",
          }
        }
      },
    });

    return {
      success: true,
      message: "ショッピングカートが正常に取得されました",
      data: response,
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
