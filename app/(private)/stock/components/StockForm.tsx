"use client";

import { addStock } from "@/app/server-aciton/stock/addStock";
import { editStock } from "@/app/server-aciton/stock/editStock";
import { StockFormType, stockSchema } from "@/app/types/zod/stock";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stock } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface StockFormProps {
  row?: Row<Stock>;
  setIsDialogOpen: (open: boolean) => void;
}

const StockForm = ({ row, setIsDialogOpen }: StockFormProps) => {
  const form = useForm<StockFormType>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      name: row ? String(row.getValue("name")) : "",
      quantity: row ? Number(row.getValue("quantity")) : 0,
      unit: row ? row.original.unit : "",
      unitPrice: row ? Number(row.getValue("unitPrice")) : 0,
      minQuantity: row ? Number(row.getValue("minQuantity")) : 0,
    },
  });

  const FORM_VALUES = [
    {
      label: "商品名",
      type: "text",
      name: "name",
    },
    {
      label: "在庫数",
      type: "number",
      name: "quantity",
    },
    {
      label: "単位",
      type: "text",
      name: "unit",
    },
    {
      label: "最小在庫設定数",
      type: "number",
      name: "minQuantity",
    },
    {
      label: "商品単価",
      type: "number",
      name: "unitPrice",
    },
  ];

  const onSubmit = async () => {
    try {
      if (row) {
        await editStock({
          id: row?.original.id as string,
          data: form.getValues(),
        });
        toast.success("在庫が正常に編集されました。");
      } else {
        await addStock(form.getValues());
        toast.success("在庫が正常に追加されました。");
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {FORM_VALUES.map((formField) => (
        <Controller
          key={formField.name}
          name={formField.name as keyof StockFormType}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{formField.label}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type={formField.type}
                aria-invalid={fieldState.invalid}
                placeholder="Login button not working on mobile"
                autoComplete="off"
                onChange={(e) =>
                  formField.type === "number"
                    ? field.onChange(Number(e.target.value))
                    : field.onChange(e.target.value)
                }
              />
              <FieldDescription>
                Provide a concise title for your bug report.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      ))}

      <Button type="submit">{row ? "更新" : "登録する"}</Button>
    </form>
  );
};

export default StockForm;
