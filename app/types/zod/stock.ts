import z from "zod";

export const stockSchema = z.object({
    id: z.string().optional(),
    name: z.string().trim().min(1, "アイテム名は必須です"),
    quantity: z.number().min(0, "在庫数は0以上でなければなりません"),
    minQuantity: z.number().min(0).optional(),
    unit: z.string().trim().min(1, "単位は必須です"),
    unitPrice: z.number().optional(),
    categoryId: z.string().optional(),
    newCategoryName: z.string().trim().optional(),
})

export type StockFormType = z.infer<typeof stockSchema>