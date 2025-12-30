"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { Prisma } from "@prisma/client";

export type ShoppingHistoryWithItems = Prisma.ShoppingHistoryGetPayload<{
  include: { items: true };
}>;

export const getShoppingHistory = async (): Promise<
  ApiResponse<ShoppingHistoryWithItems[]>
> => {
  try {
    const response = await prisma.shoppingHistory.findMany({
      where: {
        userId: "test-user-id",
      },
      include: {
        items: true,
      },
    });

    return {
      success: true,
      message: "Shopping history fetched successfully.",
      data: response,
    };
  } catch (error) {
    console.error("Error fetching shopping history:", error);
    return {
      success: false,
      message: "Failed to fetch shopping history.",
      data: [],
    };
  }
};
