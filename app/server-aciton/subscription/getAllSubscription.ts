"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { Subscription } from "@prisma/client";

export const getAllSubscription = async (): Promise<
  ApiResponse<Subscription[]>
> => {
  try {
    const response = await prisma.subscription.findMany({
      where: {
        userId: "test-user-id",
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

    if (response.length === 0) {
      return {
        success: false,
        message: "No subscriptions found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Subscriptions fetched successfully",
      data: response,
    };
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch subscriptions",
    };
  }
};
