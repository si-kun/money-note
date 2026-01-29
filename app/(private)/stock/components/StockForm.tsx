"use client";

import { addStock } from "@/app/server-aciton/stock/addStock";
import { editStock } from "@/app/server-aciton/stock/editStock";
import { StockFormType, stockSchema } from "@/app/types/zod/stock";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stock, StockCategory } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getStockCategory } from "@/app/server-aciton/getStockCategory";
import { useRouter } from "next/navigation";

interface StockFormProps {
  row?: Row<Stock>;
  setIsDialogOpen: (open: boolean) => void;
}

const StockForm = ({ row, setIsDialogOpen }: StockFormProps) => {
  const router = useRouter();

  const [toggleCategory, setToggleCategory] = useState(false);
  const [categories, setCategories] = useState<StockCategory[]>([]);

  const form = useForm<StockFormType>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      name: row ? String(row.getValue("name")) : "",
      quantity: row ? Number(row.getValue("quantity")) : 0,
      unit: row ? row.original.unit : "",
      unitPrice: row ? Number(row.getValue("unitPrice")) : 0,
      minQuantity: row ? Number(row.getValue("minQuantity")) : 0,
      categoryId: row ? String(row.getValue("category")) : "",
      newCategoryName: "",
    },
  });

  const FORM_VALUES = [
    {
      label: "商品名",
      type: "text",
      name: "name",
      placeholder: "商品名を入力してください",
    },
    {
      label: "在庫数",
      type: "number",
      name: "quantity",
      placeholder: "在庫数を入力してください",
    },
    {
      label: "単位",
      type: "text",
      name: "unit",
      placeholder: "例: 個、kg、箱など",
    },
    {
      label: "最小在庫設定数",
      type: "number",
      name: "minQuantity",
      placeholder: "最小在庫設定数を入力してください",
    },
    {
      label: "商品単価",
      type: "number",
      name: "unitPrice",
      placeholder: "商品単価を入力してください",
    },
  ];

  const handleToggleCategory = () => {
    const newValue = !toggleCategory;
    setToggleCategory(newValue);

    // toggleがtrueの場合、カテゴリーの選択をリセット
    if (newValue) {
      form.setValue("categoryId", undefined);

      // toggleがfalseの場合、新しいカテゴリー名をリセット
    } else {
      form.setValue("newCategoryName", undefined);
    }
  };

  const onSubmit = async () => {
    try {
      if (row) {
        await editStock({
          id: row?.original.id as string,
          data: form.getValues(),
        });
        toast.success("在庫が正常に編集されました。");
      } else {
        await addStock({ stock: form.getValues() });
        console.log("3. addStock 完了");
      }
      setIsDialogOpen(false);
      // ダイアログが消えてからページをリフレッシュ
      setTimeout(() => {
        router.refresh();
      }, 300);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getStockCategory();
        if (result.success && result.data) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error setting form values:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      {FORM_VALUES.map((formField) => (
        <Controller
          key={formField.name}
          name={formField.name as keyof StockFormType}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col gap-1"
            >
              <FieldLabel htmlFor={field.name}>{formField.label}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={
                  formField.type === "number"
                    ? Number(field.value) || ""
                    : field.value
                }
                type={formField.type}
                aria-invalid={fieldState.invalid}
                placeholder={formField.placeholder}
                autoComplete="off"
                onChange={(e) =>
                  formField.type === "number"
                    ? field.onChange(Number(e.target.value))
                    : field.onChange(e.target.value)
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      ))}
      <Field className="flex flex-col">
        <div className="flex items-center gap-2">
          <Switch
            id="categorySelect"
            defaultChecked={toggleCategory}
            onCheckedChange={handleToggleCategory}
            className="data-[state=checked]:bg-green-500"
          />
          <FieldLabel htmlFor="categorySelect">カテゴリー</FieldLabel>
        </div>
        {!toggleCategory && (
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        {toggleCategory && (
          <Controller
            name="newCategoryName"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="新しいカテゴリーを入力"
              />
            )}
          />
        )}
      </Field>

      <Button className="bg-green-600 hover:bg-green-500" type="submit">
        {row ? "更新" : "登録する"}
      </Button>
    </form>
  );
};

export default StockForm;
