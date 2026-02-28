"use server";

import { StockCategory } from "@prisma/client";
import { ApiResponse } from "../types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";

export const getStockCategory = async (): Promise<
  ApiResponse<StockCategory[] | null>
> => {
  try {

    const user = await getAuthUser();

    const response = await prisma.stockCategory.findMany({
      where: {
        userId: user.id,
      },
    });

    return {
      success: true,
      message: "在庫カテゴリの取得に成功しました。",
      data: response,
    };
  } catch (error) {
    console.error("在庫カテゴリの取得エラー:", error);
    return {
      success: false,
      message: "在庫カテゴリの取得に失敗しました。",
      data: null,
    };
  }
};
