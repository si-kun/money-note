"use server";

import { ApiResponse } from "@/app/types/api/api";
import { createClient } from "@/lib/supabase/server";

export const signOut = async ():Promise<ApiResponse<null>> => {

    const supabase = await createClient()

    try {

        const { error } = await supabase.auth.signOut();

        if(error) throw error;

        return {
            success: true,
            data: null,
            message: "ログアウトしました。"
        }


    } catch(error) {
        console.error("Error signing out:", error);
        return {
            success: false,
            data: null,
            message: "ログアウトに失敗しました。"
        }
    }
}