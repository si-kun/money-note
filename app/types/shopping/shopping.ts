import { Prisma } from "@/generated/prisma/client";

export type ShoppingCartWithItems = Prisma.ShoppingCartGetPayload<{
    include: { items: { include : { stock: true}} };
  }>;

  export type ShoppingHistoryWithItems = Prisma.ShoppingHistoryGetPayload<{
    include: { items: {
      include:{ stock: true}
    } };
  }>;

  export type ShoppingCartItemWithStock = Prisma.ShoppingCartItemGetPayload<{
    include: { stock: true };
  }>;