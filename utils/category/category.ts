import { Category } from "@/generated/prisma/client";

// カテゴリーのIDが買い物カテゴリのIDと一致するかどうか
export const getShoppingCategoryId = (
  categories: Category[],
  categoryIdValue: string
) => {
  return categories.find((cat) => cat.name === "買い物")?.id === categoryIdValue
    ? categoryIdValue
    : null;
};

// カテゴリーをincome,paymentで絞り込む
export const filterCategoriesByType = (
  categories: Category[],
  typeValue: "INCOME" | "PAYMENT"
): Category[] => {
  return categories.filter((cat) =>
    typeValue === "INCOME" ? cat.type === "INCOME" : cat.type === "PAYMENT"
  );
};
