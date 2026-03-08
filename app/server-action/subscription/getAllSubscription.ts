"use server";

import { ApiResponse } from "@/app/types/api/api";
import { Subscription } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";

export const getAllSubscription = async (): Promise<
  ApiResponse<Subscription[]>
> => {
  try {

    const user = await getAuthUser();

    const response = await prisma.subscription.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [
        {
          endDate: "desc",
        },
        {
          startDate: "desc",
        },
      ],
    });

    return {
      success: true,
      message: "サブスクの取得に成功しました。",
      data: response,
    };
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return {
      success: false,
      data: [],
      message: "サブスクの取得に失敗しました。",
    };
  }
};
