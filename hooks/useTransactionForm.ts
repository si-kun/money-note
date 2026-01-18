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
import { v4 as uuidv4 } from "uuid";
interface NewProductAdded {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stockAdd: boolean;
}

export const useTransactionForm = () => {
  const [histories, setHistories] = useState<ShoppingHistoryWithItems[]>([]);
  const [open, setOpen] = useState(false);

  const [addInputProduct, setAddInputProduct] = useState<string>("");
  const [newProductAdded, setNewProductAdded] = useState<NewProductAdded[]>([
    {
      id: uuidv4(),
      name: "いちご",
      price: 150,
      quantity: 15,
      stockAdd: true,
    },
    {
      id: uuidv4(),
      name: "みかん",
      price: 100,
      quantity: 10,
      stockAdd: false,
    },
  ]);

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
      addHistories: [],
    },
  });

  const watchProducts = useWatch({
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
      watchProducts.some((product) => product.name === addInputProduct.trim())
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
      ...watchProducts, newProduct,
    ])
    toast.success("商品が追加されました");
    setAddInputProduct("");
  };

  const updateProduct = (
    id: string,
    field: "quantity" | "price",
    value: number
  ) => {
    form.setValue(
      "addHistories",
      watchProducts.map((product) =>
      product.id === id ? {...product, [field]: value} : product)
    )
  };


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

  const totalCartPrice = watchProducts.reduce((acc, item) => {
    return acc + (item.price || 0) * (item.quantity || 0);
  },0);


  useEffect(() => {
    form.setValue("amount", totalCartPrice);
    form.trigger("amount");
  },[totalCartPrice,form])


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
    newProductAdded,
    setNewProductAdded,
    updateProduct,
    newAddProduct,
    addInputProduct,
    setAddInputProduct,
    totalCartPrice,
  };
};
