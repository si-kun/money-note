import { createTransaction } from "@/app/server-aciton/balance/createTransaction";
import { ShoppingHistoryWithItems } from "@/app/server-aciton/shopping/history/getShoppingHistory";
import {
  transactionSchema,
  TransactionsFormType,
} from "@/app/types/zod/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useCategories } from "./useCategories";

export const useTransactionForm = () => {
  const [histories, setHistories] = useState<ShoppingHistoryWithItems[]>([]);
  const [open, setOpen] = useState(false);

  const { fetchCategories, categories } = useCategories();

  // カテゴリーを取得
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<TransactionsFormType>({
    resolver: zodResolver(transactionSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      type: "PAYMENT",
      categoryId: "",
      amount: 0,
      memo: "",
      historyId: null,
    },
  });

  const typeValue = useWatch({
    control: form.control,
    name: "type",
  });

  // カテゴリーをincome,paymentで絞り込む
  const filteredCategory = categories.filter((cat) =>
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
    categories.find((cat) => cat.name === "買い物")?.id === categoryIdValue
      ? categoryIdValue
      : null;

  const onSubmit = async (data: TransactionsFormType) => {
    try {
      const result = await createTransaction(data);
      if (result.success) {
        form.reset();
        setHistories([]);
        setOpen(false);
        toast.success(result.message || "取引が正常に作成されました");
      } else {
        toast.error(result.message || "取引の作成に失敗しました");
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      toast.error("取引の作成中にエラーが発生しました");
    }
  };

  return {
    form,
    onSubmit,
    filteredCategory,
    shoppingCategoryId,
    typeValue,
    histories,
    setHistories,
    open,
    setOpen,
  };
};
