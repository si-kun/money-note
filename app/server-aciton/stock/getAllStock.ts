"use server";

import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { Stock } from "@prisma/client";

export const getAllStock = async ():Promise<ApiResponse<Stock[]>> => {
    try {
        const response = await prisma.stock.findMany({
            where: {
                userId: "test-user-id",
            }
        })

        if(response.length === 0) {
            return {
                success: false,
                data: [],
                message: "No stock data found",
            };
        }

        return {
            success: true,
            data: response,
            message: "Stock data fetched successfully",
        }
    } catch(error) {
        console.error("Error fetching stock data:", error);
        return {
            success: false,
            data: [],
            message: "Failed to fetch stock data",
        };
    }
}