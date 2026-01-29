import z from "zod";

export const stockSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    quantity: z.number().min(0, "Quantity must be non-negative"),
    minQuantity: z.number().min(0).optional(),
    unit: z.string().min(1, "Unit is required"),
    unitPrice: z.number().optional(),
    categoryId: z.string().optional(),
    newCategoryName: z.string().optional(),
})

export type StockFormType = z.infer<typeof stockSchema>