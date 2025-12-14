import z from "zod";

export const stockSchema = z.object({
    name: z.string().min(1, "Name is required"),
    quantity: z.number().min(0, "Quantity must be non-negative"),
    unit: z.string().min(1, "Unit is required"),
    unitPrice: z.number().optional(),
})

export type StockFormType = z.infer<typeof stockSchema>