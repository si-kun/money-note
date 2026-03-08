"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

interface UpdateCategory {
    categoryId: string;
    stockId: string;
}

export const updateCategory = async ({categoryId,stockId}:UpdateCategory):Promise<ApiResponse<null>> => {
    try {

        // カテゴリーIDが存在するかどうか
        const category = await prisma.stockCategory.findUnique({
            where: { id: categoryId}
        })

        if(!category) {
            return {
                success: false,
                message: "指定されたカテゴリーが存在しません。",
                data: null
            }
        }

        await prisma.stock.update({
            where: { id: stockId },
            data: {
                stockCategoryId: categoryId
            }
        })

        revalidatePath("/stock");

        return {
            success: true,
            message: "カテゴリーの更新に成功しました。",
            data: null
        }

    } catch(error) {
        console.error("カテゴリー更新エラー", error);
        return {
            success: false,
            message: "カテゴリーの更新に失敗しました。",
            data: null
        };
    }
}