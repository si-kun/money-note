"use server";

import { ApiResponse } from "@/app/types/api/api";
import { StockFormType } from "@/app/types/zod/stock";
import { prisma } from "@/lib/prisma/prisma";

export const addStock = async (stock:StockFormType):Promise<ApiResponse<null>> => {
     try {

        await prisma.stock.create({
            data: {
                name: stock.name,
                quantity: stock.quantity,
                minQuantity: stock.minQuantity,
                unit: stock.unit,
                unitPrice: stock.unitPrice,
                userId: "test-user-id"
            }
        })

        return {
          success: true,
          message: "在庫が正常に追加されました。",
          data: null,
        };

     } catch(error) {
        console.error("Error adding stock:", error);
        return {
          success: false,
          message: "在庫の追加中にエラーが発生しました。",
          data: null,
        };
     }
}