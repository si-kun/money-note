import z from "zod";

export const shoppingCartItemSchema = z.object({
    itemName: z.string().min(1, "Item name is required."),
    quantity: z.coerce.number<number>().min(1, "Quantity must be at least 1."),
    unit: z.string().min(1, "Unit is required."),
    unitPrice: z.coerce.number<number>().min(0, "Unit price must be at least 0."),
    memo: z.string().optional()
  });

export type ShoppingCartItemInput = z.infer<typeof shoppingCartItemSchema>;