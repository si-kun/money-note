"use server";

import { ApiResponse } from "@/app/types/api/api";
import { signin } from "./signin";

export const guestLogin = async():Promise<ApiResponse<null>> => {
    try {

        const email = process.env.GUEST_EMAIL;
        const password = process.env.GUEST_PASSWORD;

        if(!email || !password) {
            return {
                success: false,
                message: "ゲストアカウントの情報が設定されていません。",
                data: null
            }
        } 

        await signin({ email, password });

        return {
            success: true,
            message: "ゲストログインに成功しました。",
            data: null
        }

    } catch(error) {
        console.error("Guest login error:", error);
        return {
            success: false,
            message: "ゲストログインに失敗しました。",
            data: null
        }
    }
}