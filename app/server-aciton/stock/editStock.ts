"use server";

import { ApiResponse } from "@/app/types/api/api";
import { StockFormType } from "@/app/types/zod/stock";
import { prisma } from "@/lib/prisma/prisma";
import { handleStockCartSync } from "./handleStockCartSync";
import { revalidatePath } from "next/cache";

interface EditStockProps {
  id: string;
  data: StockFormType;
}

export const editStock = async ({ id, data }:EditStockProps): Promise<ApiResponse<null>> => {
  try {
    const updateStock = await prisma.stock.update({
      where: { id },
      data: {
        name: data.name,
        quantity: data.quantity,
        minQuantity: data.minQuantity,
        unit: data.unit,
        unitPrice: data.unitPrice,
      },
    });

    await handleStockCartSync(updateStock);

    revalidatePath("/stock");

    return {
      success: true,
      message: "在庫が正常に編集されました。",
      data: null,
    };
  } catch (error) {
    console.error("Error editing stock:", error);
    return {
      success: false,
      message: "在庫の編集中にエラーが発生しました。",
      data: null,
    };
  }
};
