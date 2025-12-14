"use client";

import { StockFormType, stockSchema } from "@/app/types/zod/stock";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stock } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { useForm } from "react-hook-form";

interface StockFormProps {
  row?: Row<Stock>;
}

const StockForm = ({ row }: StockFormProps) => {
  const form = useForm<StockFormType>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      name: row ? String(row.getValue("name")) : "",
      quantity: row ? Number(row.getValue("quantity")) : 0,
      unit: row ? row.original.unit : "",
      unitPrice: row ? Number(row.getValue("unitPrice")) : 0,
    },
  });
  console.log(row)

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

  const onSubmit = () => {
    console.log("submit");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {FROM_VALUES.map((fromField) => (
          <FormField
            key={fromField.name}
            control={form.control}
            name={fromField.name as keyof StockFormType}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{fromField.label}</FormLabel>
                <FormControl>
                  <Input
                    type={fromField.type}
                    placeholder={fromField.label}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      fromField.type === "number"
                        ? Number(field.onChange(Number(e.target.value)))
                        : field.onChange(e.target.value)
                    }
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default StockForm;
