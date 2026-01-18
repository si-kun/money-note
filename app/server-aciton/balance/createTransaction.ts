"use server";

import { ApiResponse } from "@/app/types/api/api";
import { TransactionsFormType } from "@/app/types/zod/transaction";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export const createTransaction = async (
  data: TransactionsFormType
): Promise<ApiResponse<null>> => {
  try {
    const { title, type, categoryId, amount, memo, addHistories } = data;
    const userId = "test-user-id";

    // incomeの場合
    if (type === "INCOME") {
      await prisma.income.create({
        data: {
          title,
          categoryId,
          amount,
          memo,
          userId: userId,
        },
      });
    }
    // expenseの場合
    else if (type === "PAYMENT") {
      const payment = await prisma.payment.create({
        data: {
          title,
          categoryId,
          amount,
          memo,
          userId: userId,
        },
      });

      // 買い物カテゴリーの場合、履歴を追加
      if (addHistories && addHistories.length > 0) {

        // ShoppingHistoryを作成
        const history = await prisma.shoppingHistory.create({
          data: {
            name: title || "買い物履歴",
            totalPrice: amount,
            userId: "test-user-id",
            paymentId: payment.id,
          }
        })

        // ShoppingCartItemを作成
        await prisma.shoppingCartItem.createMany({
          data: addHistories.map((item) => ({
            itemName: item.name,
            quantity: item.quantity || 1,
            unitPrice: item.price || 0,
            unit: "個",
            historyId: history.id,
            checked: false,
          }))
        })

        // stockAddがtrueのだったらstockに追加
        const stockData = addHistories.filter(item => item.stockAdd).map(item => ({
          name: item.name,
          quantity: item.quantity || 1,
          minQuantity: 0,
          unit: "個",
          unitPrice: item.price || 0,
          userId: "test-user-id",
        }))

        if(stockData.length > 0) {
          await prisma.stock.createMany({
            data: stockData
          })
        }

      }
    } else {
      return {
        success: false,
        message: "必要な取引データが提供されていません。",
        data: null,
      };
    }

    revalidatePath("/", "page");

    return {
      success: true,
      message: `${type === "INCOME" ? "収入" : "支出"}を登録しました`,
      data: null,
    };
  } catch (error) {
    console.error("取引の作成中にエラーが発生しました:", error);
    return {
      success: false,
      message: "取引の作成に失敗しました。",
      data: null,
    };
  }
};
