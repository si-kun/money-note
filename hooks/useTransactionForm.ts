"use client";

import { createTransaction } from "@/app/server-aciton/balance/createTransaction";
import { ShoppingHistoryWithItems } from "@/app/types/shopping/shopping";
import {
  transactionSchema,
  TransactionsFormType,
} from "@/app/types/zod/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";



export const useTransactionForm = (date: string) => {
  const [histories, setHistories] = useState<ShoppingHistoryWithItems[]>([]);
  const [open, setOpen] = useState(false);

  const [addInputProduct, setAddInputProduct] = useState<string>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<TransactionsFormType>({
    resolver: zodResolver(transactionSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      type: "PAYMENT",
      categoryId: "",
      amount: 0,
      memo: "",
      addHistories: [],
      date: date,
    },
  });

  // watch
  const typeValue = useWatch({
    control: form.control,
    name: "type",
  });

  const categoryIdValue = useWatch({
    control: form.control,
    name: "categoryId",
  });

  const productsValue = useWatch({
    control: form.control,
    name: "addHistories",
  }) || [];

  
  const newAddProduct = () => {
    // 空文字だったら追加しない
    if (addInputProduct.trim() === "") {
      toast.error("商品名を入力してください");
      return;
    }

    // すでに同じ名前の商品が存在していたら追加しない
    if (
      productsValue.some((product) => product.name === addInputProduct.trim())
    ) {
      toast.error("同じ名前の商品がすでに存在しています");
      return;
    }

    const newProduct = {
      id: uuidv4(),
      name: addInputProduct.trim(),
      price: 0,
      quantity: 0,
      stockAdd: false,
    }
    form.setValue("addHistories", [
      ...productsValue, newProduct,
    ])
    toast.success("商品が追加されました");
    setAddInputProduct("");
  };

  const onSubmit = async (data: TransactionsFormType) => {
    startTransition(async() => {

      try {
        const result = await createTransaction({
          ...data,
          date,
        });
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
    })
  };

  const totalCartPrice = productsValue.reduce((acc, item) => {
    return acc + (item.price || 0) * (item.quantity || 0);
  },0);


  useEffect(() => {
    form.setValue("amount", totalCartPrice);
    form.trigger("amount");
  },[totalCartPrice,form])


  return {
    form,
    onSubmit,
    categoryIdValue,
    typeValue,
    histories,
    setHistories,
    open,
    setOpen,
    newAddProduct,
    addInputProduct,
    setAddInputProduct,
    totalCartPrice,
    productsValue,
    isPending,
  };
};
