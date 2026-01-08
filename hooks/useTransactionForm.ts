import { getCategory } from "@/app/server-aciton/balance/getCategory";
import { ShoppingHistoryWithItems } from "@/app/server-aciton/shopping/history/getShoppingHistory";
import {
  transactionSchema,
  TransactionsFormType,
} from "@/app/types/zod/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export const useTransactionForm = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [histories, setHistories] = useState<ShoppingHistoryWithItems[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategory();
        if (result.success) {
          setCategory(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const form = useForm<TransactionsFormType>({
    resolver: zodResolver(transactionSchema),
    mode: "onBlur",
    defaultValues: {
      type: "PAYMENT",
      categoryId: "",
      amount: 0,
      memo: "",
      historyId: null,
    },
  });

  console.log("errors:", form.formState.errors);

  const typeValue = useWatch({
    control: form.control,
    name: "type",
  });

  // カテゴリーをincome,paymentで絞り込む
  const filteredCategory = category.filter((cat) =>
    typeValue === "INCOME" ? cat.type === "INCOME" : cat.type === "PAYMENT"
  );

  const categoryIdValue = useWatch({
    control: form.control,
    name: "categoryId",
  });

  const historyIdValue = useWatch({
    control: form.control,
    name: "historyId",
  });

  useEffect(() => {
    if (historyIdValue) {
      const selectedHistory = histories.find(
        (history) => history.id === historyIdValue
      );
      if (selectedHistory) {
        form.setValue("amount", selectedHistory.totalPrice || 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyIdValue, histories]);

  const shoppingCategoryId =
    category.find((cat) => cat.name === "買い物")?.id === categoryIdValue
      ? categoryIdValue
      : null;

  const onsubmit = () => {
    console.log(form.getValues());
  };
  return {
    form,
    onsubmit,
    filteredCategory,
    shoppingCategoryId,
    typeValue,
    histories,
    setHistories,
    open,
    setOpen,
  };
};
