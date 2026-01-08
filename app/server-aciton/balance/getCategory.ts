"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { Category } from "@prisma/client";

export const getCategory = async (
): Promise<ApiResponse<Category[]>> => {
  try {
    const response = await prisma.category.findMany({
      where: {
        userId: "test-user-id",
      },
    });

    if (response.length > 0) {
      return {
        success: true,
        message: "Category fetched successfully",
        data: response,
      };
    }

    return {
      success: true,
      message: "Category fetched successfully",
      data: [],
    };
  } catch (error) {
    console.error("Error fetching category:", error);
    return {
      success: false,
      message: "Failed to fetch category",
      data: [],
    };
  }
};
