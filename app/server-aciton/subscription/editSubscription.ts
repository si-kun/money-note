"use server";

import { ApiResponse } from "@/app/types/api/api";
import { SubscriptionFormType } from "@/app/types/zod/subscription";
import { prisma } from "@/lib/prisma/prisma";

interface EditSubscriptionProps {
  editingTarget: SubscriptionFormType;
  id: string;
}

export const editSubscription = async (
  { editingTarget, id }: EditSubscriptionProps
): Promise<ApiResponse<null>> => {
  try {
    await prisma.subscription.update({
      where: { id },
      data: {
        name: editingTarget.name,
        monthlyPrice: Number(editingTarget.monthlyPrice),
        startDate: editingTarget.startDate,
        endDate: editingTarget.endDate,
      },
    });

    return {
      success: true,
      data: null,
      message: "Subscription edited successfully.",
    };
  } catch (error) {
    console.error("Error editing subscription:", error);
    return {
      success: false,
      data: null,
      message: "Failed to edit subscription.",
    };
  }
};
