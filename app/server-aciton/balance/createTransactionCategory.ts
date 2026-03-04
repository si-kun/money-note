"use server";

import { ApiResponse } from "@/app/types/api/api";
import { Category } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";

interface CreateTransactionCategoryInput {
    name: string;
    type: "INCOME" | "PAYMENT";
}

export const createTransactionCategory = async ({name,type}:CreateTransactionCategoryInput):Promise<ApiResponse<Category | null>> => {
    try {

        const user = await getAuthUser();

        const response = await prisma.category.create({
            data: {
                name,
                type,
                userId: user.id,
            }
        })

        return {
            success: true,
            message: "取引カテゴリーの作成に成功しました",
            data: response,
        }

    } catch(error) {
        console.error("Error creating transaction category:", error);
        return {
            success: false,
            message: "取引カテゴリーの作成に失敗しました",
            data: null,
        };
    }
}