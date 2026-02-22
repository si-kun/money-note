"use server";

import { ApiResponse } from "@/app/types/api/api";
import { StockFormType } from "@/app/types/zod/stock";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

interface AddStockParams {
  stock: StockFormType;
}

export const addStock = async ({
  stock,
}: AddStockParams): Promise<ApiResponse<null>> => {
  try {
    await prisma.$transaction(async (tx) => {
      let stockCategoryId = null;

      // カテゴリーが新規の場合
      if (stock.newCategoryName) {
        // 既存に同盟カテゴリーがあるか確認
        const existingCategory = await tx.stockCategory.findFirst({
          where: {
            categoryName: stock.newCategoryName,
          },
        });

        if (existingCategory) {
          stockCategoryId = existingCategory.id;
        } else {
          const newCategory = await tx.stockCategory.create({
            data: {
              categoryName: stock.newCategoryName,
              userId: "test-user-id",
            },
          });
          stockCategoryId = newCategory.id;
        }
      } else if (stock.categoryId) {
        const existingCategory = await tx.stockCategory.findUnique({
          where: {
            userId: "test-user-id",
            id: stock.categoryId,
          },
        });
        if (existingCategory) {
          stockCategoryId = existingCategory.id;
        }
      } else {
        stockCategoryId = null;
      }

      const newStock = await tx.stock.create({
        data: {
          name: stock.name,
          quantity: stock.quantity,
          minQuantity: stock.minQuantity,
          unit: stock.unit,
          unitPrice: stock.unitPrice,
          userId: "test-user-id",
          stockCategoryId,
        },
      });

      // 新規追加時に在庫数が最小在庫数以下の場合は、在庫不足カートに追加する
      if (stock.minQuantity && stock.quantity <= stock.minQuantity) {
        // 既にカートがあるか確認
        let lowStockCart = await tx.shoppingCart.findFirst({
          where: {
            userId: "test-user-id",
            name: "在庫不足",
          },
        });

        // カートがない場合は新規作成
        if (!lowStockCart) {
          lowStockCart = await tx.shoppingCart.create({
            data: {
              name: "在庫不足",
              userId: "test-user-id",
            },
          });
        }

        // カートにアイテムを追加
        await tx.shoppingCartItem.create({
          data: {
            itemName: newStock.name,
            quantity: newStock.quantity,
            unit: newStock.unit,
            unitPrice: newStock.unitPrice,
            stockId: newStock.id,
            cartId: lowStockCart.id,
          },
        });
      }
    });

    revalidatePath("/stock");

    return {
      success: true,
      message: "在庫が正常に追加されました。",
      data: null,
    };
  } catch (error) {
    console.error("Error adding stock:", error);
    return {
      success: false,
      message: "在庫の追加中にエラーが発生しました。",
      data: null,
    };
  }
};
