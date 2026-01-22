"use server";

import { ApiResponse } from "@/app/types/api/api";
import { ShoppingHistoryWithItems } from "./getShoppingHistory";
import { prisma } from "@/lib/prisma/prisma";

export const getShoppingHistoryId = async (
  id: string
): Promise<ApiResponse<ShoppingHistoryWithItems | null>> => {
  try {
    const result = await prisma.shoppingHistory.findUnique({
      where: { userId: "test-user-id", id: id },
      include: { items: true },
    });

    return {
      success: true,
      message: "Shopping history by ID fetched successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Error fetching shopping history by ID:", error);
    return {
      success: false,
      message: "Failed to fetch shopping history by ID.",
      data: null,
    };
  }
};
