import z from "zod";

export const transactionSchema = z.object({
    type: z.enum(["INCOME", "PAYMENT"]),
    categoryId: z.string().min(1,"カテゴリーを選択してください"),
    memo: z.string().optional(),
    amount: z.number().min(1,"金額は1以上で入力してください"),
    historyId: z.string().optional().nullable(),
})

export type TransactionsFormType = z.infer<typeof transactionSchema>;