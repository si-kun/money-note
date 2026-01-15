import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/balance/balance";
import {
  editTransactionSchema,
  EditTransactionsFormType,
} from "@/app/types/zod/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCategories } from "./useCategories";
import { editPayment } from "@/app/server-aciton/balance/editPayment";
import { toast } from "sonner";
import { editIncome } from "@/app/server-aciton/balance/editIncome";

interface UseEditTransactionFormReturn {
  transaction: PaymentWithCategory | IncomeWithCategory;
  type: "INCOME" | "PAYMENT";
}

export const useEditTransactionForm = ({
  transaction,
  type,
}: UseEditTransactionFormReturn) => {
  const { fetchCategories, categories } = useCategories();

  const [open, setOpen] = useState(false);

  const form = useForm<EditTransactionsFormType>({
    mode: "onBlur",
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      title: transaction.title || "",
      categoryId: transaction.categoryId,
      memo: transaction.memo || "",
      amount: transaction.amount,
    },
  });

  const onSubmit = async (data: EditTransactionsFormType) => {
    try {
      const result =
        type === "INCOME"
          ? await editIncome({
              data: {
                id: transaction.id,
                title: data.title || "",
                amount: data.amount,
                categoryId: data.categoryId,
                memo: data.memo || "",
              },
            })
          : await editPayment({
              data: {
                id: transaction.id,
                title: data.title || "",
                amount: data.amount,
                categoryId: data.categoryId,
                memo: data.memo || "",
              },
            });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("編集中にエラーが発生しました");
    }
  };

  const filteredCategory = categories.filter((cat) =>
    type === "INCOME" ? cat.type === "INCOME" : cat.type === "PAYMENT"
  );

  const shoppingCategoryId = categories.find(
    (cat) => cat.name === "買い物"
  )?.id;

  return {
    form,
    open,
    setOpen,
    onSubmit,
    fetchCategories,
    categories,
    filteredCategory,
    shoppingCategoryId,
  };
};
