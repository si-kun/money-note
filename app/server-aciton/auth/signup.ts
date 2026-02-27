"use server";

import { AuthSchemaType } from "@/app/(auth)/types/authSchema";
import { ApiResponse } from "@/app/types/api/api";
import { prisma } from "@/lib/prisma/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const signup = async (
  signupData: AuthSchemaType
): Promise<ApiResponse<null>> => {
  let userId: string | undefined = undefined;

  try {
    // supabaseでのユーザー登録処理
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
    });
    userId = data?.user?.id;

    // エラーハンドリング
    if (error || !data.user) {
      throw new Error(error?.message);
    }

    // prismaでのユーザー登録処理
    const prismaRes = await prisma.user.create({
      data: {
        id: data.user.id,
        userName: signupData.userName,
        email: data.user.email as string,
      },
    });

    // エラーハンドリング
    if (!prismaRes) {
      throw new Error("ユーザーの作成に失敗しました");
    }

    return {
      success: true,
      message: "ユーザーの作成に成功しました",
      data: null,
    };
  } catch (error) {
    console.error("ユーザーの作成に失敗しました:", error);
    if (userId) {
      const { data: deleteData, error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (deleteError) {
        console.error("Supabaseユーザーの削除に失敗しました:", deleteError);
      } else {
        console.log("Supabaseユーザーが削除されました:", deleteData);
      }
    }
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
    return {
      success: false,
      message: "ユーザーの作成に失敗しました",
      data: null,
    };
  }
};
