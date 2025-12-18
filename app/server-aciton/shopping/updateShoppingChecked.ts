"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";

export const updateShoppingChecked = async(id: string,checked:boolean):Promise<ApiResponse<null>> => {
    try {

        await prisma.shoppingCartItem.update({
            where: { id },
            data: {
                checked
            }
        })

        return {
            success: true,
            data: null,
            message: 'Shopping checked status updated successfully.'
        }

    } catch(error) {
        console.error('Error updating shopping checked status:', error);
        return {
            success: false,
            data: null,
            message: 'Failed to update shopping checked status.'
        }
    }
}