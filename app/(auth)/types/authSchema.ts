import z from "zod";

export const authSchema = z.object({
    userName: z.string().min(1, "ユーザー名は必須です"),
    email: z.email().min(1, "メールアドレスは必須です"),
    password: z.string().min(8, "パスワードは8文字以上である必要があります"),
})

export type AuthSchemaType = z.infer<typeof authSchema>