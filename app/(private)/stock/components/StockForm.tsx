"use client";

import { editStock } from "@/app/server-aciton/stock/editStock";
import { StockFormType, stockSchema } from "@/app/types/zod/stock";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stock } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface StockFormProps {
  row?: Row<Stock>;
  setIsDialogOpen: (open: boolean) => void;
}

const StockForm = ({ row,setIsDialogOpen }: StockFormProps) => {
  const router = useRouter();

  const form = useForm<StockFormType>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      name: row ? String(row.getValue("name")) : "",
      quantity: row ? Number(row.getValue("quantity")) : 0,
      unit: row ? row.original.unit : "",
      unitPrice: row ? Number(row.getValue("unitPrice")) : 0,
    },
  });

  const FROM_VALUES = [
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
      label: "商品単価",
      type: "number",
      name: "unitPrice",
    },
  ];
  console.log(row)

  const onSubmit = async () => {
    try {
      await editStock({
        id: row?.original.id as string,
        data: form.getValues(),
      });

      toast.success("在庫が正常に編集されました。");
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {FROM_VALUES.map((formField) => (
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
      <Button type="submit">更新</Button>
    </form>
  );
};

export default StockForm;
