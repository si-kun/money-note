"use server";

import { ApiResponse } from "@/app/types/api/api";
import { IncomeWithCategory } from "@/app/types/transaction/transaction";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";

interface GetIncome {
  year: number;
  month: number;
}

export const getIncome = async ({
  year,
  month,
}: GetIncome): Promise<ApiResponse<IncomeWithCategory[]>> => {
  
  try {

    const user = await getAuthUser();

    const response = await prisma.income.findMany({
      where: {
        userId: user.id,
        incomeDate: {
          // 月の前後1週間分までを取得
          gte: new Date(year, month - 1, 1 -7),
          lt: new Date(year, month, 1 + 7),
        },
      },
      orderBy: {
        incomeDate: "desc",
      },
      include: {
        category: true,
      }
    });

    if (response.length === 0) {
      return {
        success: false,
        message: "収入データが見つかりませんでした。",
        data: [],
      };
    }

    return {
      success: true,
      message: `${year}年${month}月の収入を取得しました。`,
      data: response,
    };
  } catch (error) {
    console.error("収入の取得中にエラーが発生しました:", error);
    return {
      success: false,
      message: "収入の取得に失敗しました。",
      data: [],
    };
  }
};
