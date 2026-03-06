import { z } from 'zod';

export const subscriptionSchema = z.object({
    name: z.string().trim().min(1, "サブスクの名前は必須です"),
    monthlyPrice: z.number().min(1, "月額料金は1以上でなければなりません"),
    startDate: z.date(),
    endDate: z.instanceof(Date).nullable().optional(),
})

export type SubscriptionFormType = z.infer<typeof subscriptionSchema>