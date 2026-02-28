"use server";

import { ApiResponse } from "@/app/types/api/api";
import { YearDataResponse } from "@/app/types/statistics/statistics";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";

interface GetAllYearData {
  year: number;
}



export const getAllYearData = async ({
  year,
}: GetAllYearData): Promise<ApiResponse<YearDataResponse | null>> => {
  try {

    const user = await getAuthUser();
    const userId = user.id

    const response = await prisma.$transaction(async (tx) => {
      const incomes = await tx.income.findMany({
        where: {
          userId,
          incomeDate: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${year + 1}-01-01`),
          },
        },
        include: {
          category: true,
        },
      });

      const payments = await tx.payment.findMany({
        where: {
          userId,
          paymentDate: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${year + 1}-01-01`),
          },
        },
        include: {
          category: true,
          shoppingHistory: {
            include: {
              items: {
                include: {
                  stock: true,
                },
              },
            },
          },
        },
      });
        return { income: incomes, payment: payments };
    });

    return {
      success: true,
      message: `${year}年の収支データを取得しました。`,
      data: response,
    };
  } catch (error) {
    console.error("Error in getAllYearData:", error);
    return {
      success: false,
      message: "データの取得に失敗しました。",
      data: null,
    };
  }
};
