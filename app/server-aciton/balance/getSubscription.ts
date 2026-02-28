"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";
import { Subscription } from "@prisma/client";

interface getSubscription {
  year: number;
  month: number;
}

export interface SubscriptionResponse {
  subscription: Subscription[];
  totalAmount: number;
}

export const getSubscription = async ({
  year,
  month,
}: getSubscription): Promise<ApiResponse<SubscriptionResponse>> => {
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);

  try {

    const user = await getAuthUser();

    const response = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        startDate: {
          lte: monthEnd,
        },
        OR: [
          {
            endDate: {
              gte: monthStart,
            },
          },
          {
            endDate: null,
          },
        ],
      },
    });

    // 合計金額を計算
    const totalAmount = response.reduce((acc, subscription) => {
      return acc + subscription.monthlyPrice;
    },0)

    return {
      success: true,
      message: "サブスクの取得に成功しました",
      data: {
        subscription: response,
        totalAmount,
      }
    };
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return {
      success: false,
      message: "サブスクの取得に失敗しました",
      data: {
        subscription: [],
        totalAmount: 0,
      },
    };
  }
};
