"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";
import { revalidatePath } from "next/cache";

export const createShoppingCart = async (
  name: string
): Promise<ApiResponse<null>> => {
  try {

    const user = await getAuthUser();

    await prisma.shoppingCart.create({
      data: {
        name,
        userId:user.id,
      },
    });

    revalidatePath("/shopping");

    return {
      success: true,
      message: "カートが正常に作成されました",
      data: null,
    };
  } catch (error) {
    console.error("カートの作成中にエラーが発生しました:", error);
    return {
      success: false,
      message: "カートの作成に失敗しました",
      data: null,
    };
  }
};
