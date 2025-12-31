"use server"

import { ApiResponse } from "@/app/types/api/api"
import { prisma } from "@/lib/prisma/prisma"
import { ShoppingHistoryWithItems } from "./getShoppingHistory";
import { revalidatePath } from "next/cache";

interface EditShoppingHistory {
    historyId: string;
    data: ShoppingHistoryWithItems
}

export const editShoppingHistory = async ({historyId,data}:EditShoppingHistory):Promise<ApiResponse<null>> => {
    try {

        await prisma.shoppingHistory.update({
            where: { id: historyId },
            data: {
                date: data.date,
                totalPrice: data.totalPrice
            }
        })

        revalidatePath("/shopping/history");

        return {
            success: true,
            message: '履歴の編集に成功しました',
            data: null
        }
    } catch(error) {
        console.error('Error editing shopping history:', error);
        return {
            success: false,
            message: '履歴の編集に失敗しました',
            data: null
        }
    }
}