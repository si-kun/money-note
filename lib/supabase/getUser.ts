import { createClient } from "./server"

export const getAuthUser = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if(error || !data.user) {
        throw new Error("認証が必要です");
    }

    return data.user;
}