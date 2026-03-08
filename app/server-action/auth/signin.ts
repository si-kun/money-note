"use server";

import { SigninSchemaType } from "@/app/(auth)/types/authSchema";
import { ApiResponse } from "@/app/types/api/api";
import { createClient } from "@/lib/supabase/server";

export const signin = async (
  authData: SigninSchemaType
): Promise<ApiResponse<null>> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authData.email,
      password: authData.password,
    });

    if (error || !data.session) {
      throw new Error(error?.message);
    }
    return {
      success: true,
      message: "ログインに成功しました",
      data: null,
    };
  } catch (error) {
    console.error("ログインに失敗しました:", error);
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    } else {
      return {
        success: false,
        message: "ログインに失敗しました",
        data: null,
      };
    }
  }
};
