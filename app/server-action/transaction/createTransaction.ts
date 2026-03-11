"use server";

import { ApiResponse } from "@/app/types/api/api";
import { TransactionsFormType } from "@/app/types/zod/transaction";
import { prisma } from "@/lib/prisma/prisma";
import { getAuthUser } from "@/lib/supabase/getUser";
import { revalidatePath } from "next/cache";

export const createTransaction = async (
  data: TransactionsFormType
): Promise<ApiResponse<null>> => {
  try {
    const { title, type, categoryId, amount, memo, addHistories,date } = data;
    const user = await getAuthUser();
    const userId = user.id;

    // incomeの場合
    if (type === "INCOME") {
      await prisma.income.create({
        data: {
          title,
          categoryId,
          amount,
          memo,
          userId,
          incomeDate: new Date(date),
        },
      });
    }
    // paymentの場合
    else if (type === "PAYMENT") {
      await prisma.$transaction(async (tx) => {
        // Paymentを作成
        const payment = await tx.payment.create({
          data: {
            title,
            categoryId,
            amount,
            memo,
            userId,
            paymentDate: new Date(date),
          },
        });

        // 買い物カテゴリーの場合、履歴を追加
        if (addHistories && addHistories.length > 0) {
          // ShoppingHistoryを作成
          const history = await tx.shoppingHistory.create({
            data: {
              name: title || "買い物履歴",
              totalPrice: amount,
              userId,
              paymentId: payment.id,
            },
          });

          // 在庫を処理してstockIdを取得
          const itemsWithStockId = [];

          for (const item of addHistories) {
            let stockId = null;

            if (item.stockAdd) {
              const existingStock = await tx.stock.findFirst({
                where: {
                  userId,
                  name: item.name,
                },
              });

              if (existingStock) {
                await tx.stock.update({
                  where: {
                    id: existingStock.id,
                  },
                  data: {
                    quantity: existingStock.quantity + (item.quantity || 1),
                  },
                });
                stockId = existingStock.id;
              } else {
                const newStock = await tx.stock.create({
                  data: {
                    name: item.name,
                    quantity: item.quantity || 1,
                    minQuantity: 0,
                    unit: "個",
                    unitPrice: item.price || 0,
                    userId,
                  },
                });
                stockId = newStock.id;
              }
            }
            itemsWithStockId.push({
              ...item,
              stockId,
            });
          }
          // ShoppingCartItemを作成
          await tx.shoppingCartItem.createMany({
            data: itemsWithStockId.map((item) => ({
              itemName: item.name,
              quantity: item.quantity || 1,
              unitPrice: item.price || 0,
              unit: "個",
              historyId: history.id,
              checked: false,
              stockId: item.stockId,
            })),
          });
        }
      });
    } else {
      return {
        success: false,
        message: "必要な取引データが提供されていません。",
        data: null,
      };
    }

    revalidatePath("/")

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
