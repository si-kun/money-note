"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";

export const deleteSubscription = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    if (!id) {
      return {
        success: false,
        message: "Subscription ID is required.",
        data: null,
      };
    }

    await prisma.subscription.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Subscription deleted successfully.",
      data: null,
    };
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return {
      success: false,
      message: "Failed to delete subscription.",
      data: null,
    };
  }
};
