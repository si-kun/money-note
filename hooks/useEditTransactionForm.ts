"use client";

import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/balance/balance";
import {
  editTransactionSchema,
  EditTransactionsFormType,
} from "@/app/types/zod/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
// import { useCategories } from "./useCategories";
import { editPayment } from "@/app/server-aciton/balance/editPayment";
import { toast } from "sonner";
import { editIncome } from "@/app/server-aciton/balance/editIncome";
import { deleteTransaction } from "@/app/server-aciton/balance/deleteTransaction";

interface UseEditTransactionFormReturn {
  transaction: PaymentWithCategory | IncomeWithCategory;
  type: "INCOME" | "PAYMENT";
}

export const useEditTransactionForm = ({
  transaction,
  type,
}: UseEditTransactionFormReturn) => {

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const categoryIdValue = useWatch({
    control: form.control,
    name: "categoryId",
  })

  const onSubmit = async (data: EditTransactionsFormType) => {
    startTransition(async() => {
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
    });
  };

  // 削除機能
  const handleDeleteTransaction = async () => {
      try {
        const result = await deleteTransaction(transaction.id, type);
        if (result.success) {
          toast.success(result.message);

          setOpen(false);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
        toast.error("取引の削除中にエラーが発生しました");
      }
    // })
  };

  return {
    form,
    open,
    setOpen,
    onSubmit,
    categoryIdValue,
    handleDeleteTransaction,
    isPending,
  };
};
