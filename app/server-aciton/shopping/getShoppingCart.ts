"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { Prisma } from "@prisma/client";

export type ShoppingCartWithItems = Prisma.ShoppingCartGetPayload<{
    include: { items: true}
}>;

export const getShoppingCart = async ():Promise<ApiResponse<ShoppingCartWithItems[]>> =>{
    try {

        const response = await prisma.shoppingCart.findMany({
            where: {
                userId: "test-user-id"
            },
            include: {
                items: true
            }
        })

        return {
            success: true,
            message: "Shopping cart fetched successfully.",
            data: response
        }

    } catch(error) {
        console.error("Error fetching shopping cart:", error);
        return {
            success: false,
            message: "Failed to fetch shopping cart.",
            data: []
        }
    }
}