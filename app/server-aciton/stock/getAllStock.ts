"use server";

import { ApiResponse } from "@/app/types/api/api";
import { Stock } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";

export const getAllStock = async (): Promise<ApiResponse<Stock[]>> => {

  try {

    const user = await getAuthUser();

    const response = await prisma.stock.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        quantity: "desc",
      },
    });

    return {
      success: true,
      data: response,
      message: "在庫情報を取得しました",
    };
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return {
      success: false,
      data: [],
      message: "在庫情報の取得に失敗しました",
    };
  }
};
