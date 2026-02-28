"use server";

import { ApiResponse } from "@/app/types/api/api";
import { SubscriptionFormType } from "@/app/types/zod/subscription";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";
import { revalidatePath } from "next/cache";

export const addSubscriptions = async (
  data: SubscriptionFormType
): Promise<ApiResponse<null>> => {
  try {

    const user = await getAuthUser();

    await prisma.subscription.create({
      data: {
        name: data.name,
        monthlyPrice: Number(data.monthlyPrice),
        startDate: data.startDate,
        endDate: data.endDate || null,
        userId: user.id,
      },
    });

    revalidatePath("/subscriptions");
    
    return {
      success: true,
      message: "Subscription added successfully",
      data: null,
    };

  } catch (error) {
    console.error("Error adding subscription:", error);
    return {
      success: false,
      message: "Error adding subscription",
      data: null,
    };
  }
};
