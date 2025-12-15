import { z } from 'zod';

export const subscriptionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    monthlyPrice: z.number().min(1, "Monthly price must be non-negative"),
    startDate: z.date(),
    endDate: z.instanceof(Date).nullable().optional(),
})

export type SubscriptionFormType = z.infer<typeof subscriptionSchema>