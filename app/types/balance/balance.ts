import { Prisma } from "@prisma/client";

// Prisma が自動生成してくれる型を使う
export type IncomeWithCategory = Prisma.IncomeGetPayload<{
    include: { category: true };
  }>;
  
export  type PaymentWithCategory = Prisma.PaymentGetPayload<{
    include: { category: true };
  }>;