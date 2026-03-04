"use server";

import { ApiResponse } from "@/app/types/api/api";
import { StockFormType } from "@/app/types/zod/stock";
import { prisma } from "@/lib/prisma/prisma";
import { handleStockCartSync } from "./handleStockCartSync";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/supabase/getUser";

interface EditStockProps {
  id: string;
  data: StockFormType;
}

export const editStock = async ({
  id,
  data,
}: EditStockProps): Promise<ApiResponse<null>> => {
  try {
    const user = await getAuthUser();
    const userId = user.id;

    const updatedStock = await prisma.$transaction(async (tx) => {
      let stockCategoryId = null;

      // カテゴリーが新規の場合
      if (data.newCategoryName) {
        // 既存のカテゴリーがあるかどうか確認
        const existingCategory = await tx.stockCategory.findFirst({
          where: {
            categoryName: data.newCategoryName,
          },
        });

        if (existingCategory) {
          stockCategoryId = existingCategory.id;
        } else {
          // なければ新規作成
          const newCategory = await tx.stockCategory.create({
            data: {
              categoryName: data.newCategoryName,
              userId,
            },
          });
          stockCategoryId = newCategory.id;
        }
      } else if (data.categoryId) {
        // 既存カテゴリーが選択されている場合
        const existingCategory = await tx.stockCategory.findUnique({
          where: {
            id: data.categoryId,
          },
        });
        if (existingCategory) {
          stockCategoryId = existingCategory.id;
        } else {
          stockCategoryId = null;
        }
      }

      const updateStock = await tx.stock.update({
        where: { id },
        data: {
          name: data.name,
          quantity: data.quantity,
          minQuantity: data.minQuantity,
          unit: data.unit,
          unitPrice: data.unitPrice,

          stockCategoryId,
        },
      });

      // 在庫が更新されたら、カート、購入履歴も更新する
      await tx.shoppingCartItem.updateMany({
        where: {
          stockId: updateStock.id,
        },
        data: {
          itemName: updateStock.name,
          unit: updateStock.unit,
        },
      });

      return updateStock;
    });

    await handleStockCartSync(updatedStock, userId);

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
