"use server";

import { ApiResponse } from "@/app/types/api/api";
import { handleStockCartSync } from "./handleStockCartSync";
import { Stock } from "@/generated/prisma/client";
import { getAuthUser } from "@/lib/supabase/getUser";

export const handleStockCartSyncBatch = async (
  stocks: Stock[]
): Promise<ApiResponse<null>> => {
  try {

    const user = await getAuthUser()

    // stocks配列の各在庫アイテムに対してhandleStockCartSyncを呼び出す
    for (const stock of stocks) {
      await handleStockCartSync(stock,user.id);
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
