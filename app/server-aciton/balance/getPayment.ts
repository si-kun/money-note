"use server";

import { ApiResponse } from "@/app/types/api/api";
import { PaymentWithCategory } from "@/app/types/balance/balance";
import { prisma } from "@/lib/prisma/prisma";

interface getPayment {
  year: number;
  month: number;
}

export const getPayment = async ({
  year,
  month,
}: getPayment): Promise<ApiResponse<PaymentWithCategory[]>> => {
  try {
    const response = await prisma.payment.findMany({
      where: {
        userId: "test-user-id",
        paymentDate: {
          // 月の前後1週間分までを取得
          gte: new Date(year, month - 1, 1 - 7),
          lt: new Date(year, month, 1 + 7),
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
      include: {
        category: true,
        shoppingHistory: {
          include: {
            items: true,
          }
        },
      },
    });

    if (response.length === 0) {
      return {
        success: false,
        message: "支出データが見つかりませんでした。",
        data: [],
      };
    }

    return {
      success: true,
      message: `${year}年${month}月の支出を取得しました。`,
      data: response,
    };
  } catch (error) {
    console.error("支出の取得中にエラーが発生しました:", error);
    return {
      success: false,
      message: "支出の取得に失敗しました。",
      data: [],
    };
  }
};
