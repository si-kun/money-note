"use server";

import { ApiResponse } from "@/app/types/api/api";
import { Stock } from "@prisma/client";
import { handleStockCartSync } from "./handleStockCartSync";

export const handleStockCartSyncBatch = async (
  stocks: Stock[]
): Promise<ApiResponse<null>> => {
  try {
    // stocks配列の各在庫アイテムに対してhandleStockCartSyncを呼び出す
    for (const stock of stocks) {
      await handleStockCartSync(stock);
    }

    return {
      success: true,
      message: "在庫数の同期が完了しました。",
      data: null,
    };
  } catch (error) {
    console.error("在庫数の同期中にエラーが発生しました:", error);
    return {
      success: false,
      message: "在庫数の同期に失敗しました。",
      data: null,
    };
  }
};
