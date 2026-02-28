import { ShoppingCartItem } from "@/generated/prisma/client";

export type AddStockItem = Pick<
  ShoppingCartItem,
  "itemName" | "quantity" | "unit" | "unitPrice" | "stockId" | "memo"
>;