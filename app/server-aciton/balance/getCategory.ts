"use server";

import { ApiResponse } from "@/app/types/api/api";
import { Category } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";

export const getCategory = async (
): Promise<ApiResponse<Category[]>> => {
  try {

    const user = await getAuthUser();

    const response = await prisma.category.findMany({
      where: {
        userId: user.id,
      },
    });

    return {
      success: true,
      message: "カテゴリーの取得に成功しました",
      data: response,
    };
  } catch (error) {
    console.error("Error fetching category:", error);
    return {
      success: false,
      message: "カテゴリーの取得に失敗しました",
      data: [],
    };
  }
};
