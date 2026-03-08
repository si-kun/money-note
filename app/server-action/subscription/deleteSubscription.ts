"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const deleteSubscription = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    if (!id) {
      return {
        success: false,
        message: "サブスクIDが提供されていません。",
        data: null,
      };
    }

    await prisma.subscription.delete({
      where: { id },
    });

    revalidatePath("/subscriptions");

    return {
      success: true,
      message: "サブスクの削除に成功しました。",
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
