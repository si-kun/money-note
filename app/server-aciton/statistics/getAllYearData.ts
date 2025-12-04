"use server";

import { ApiResponse } from "@/app/types/api/api";
import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/balance/balance";
import { prisma } from "@/lib/prisma/prisma";

interface GetAllYearData {
  year: number;
}

interface YearDataResponse {
  income: IncomeWithCategory[];
  payment: PaymentWithCategory[];
}

export const getAllYearData = async ({
  year,
}: GetAllYearData): Promise<ApiResponse<YearDataResponse | null>> => {
  try {
    const response = await prisma.$transaction(async (tx) => {
      const incomes = await tx.income.findMany({
        where: {
          userId: "test-user-id",
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
          userId: "test-user-id",
          paymentDate: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${year + 1}-01-01`),
          },
        },
        include: {
          category: true,
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
      message: "Failed to fetch year data.",
      data: null,
    };
  }
};
