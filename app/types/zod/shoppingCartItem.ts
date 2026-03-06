import z from "zod";

export const shoppingCartItemSchema = z.object({
    itemName: z.string().trim().min(1, "アイテム名は必須です"),
    quantity: z.coerce.number<number>().min(1, "数量は1以上でなければなりません"),
    unit: z.string().trim().min(1, "単位は必須です"),
    unitPrice: z.coerce.number<number>().min(0, "単価は0以上でなければなりません").optional(),
    memo: z.string().trim().optional(),
    stockId: z.string().nullable().optional(),

    historyId: z.string().optional().optional(),
  });

export type ShoppingCartItemInput = z.infer<typeof shoppingCartItemSchema>;