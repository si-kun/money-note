"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
const formSchema = z.object({
  itemName: z.string().min(1, "Item name is required."),
  quantity: z.number().min(1, "Quantity must be at least 1."),
  unit: z.string().min(1, "Unit is required."),
  unitPrice: z.optional(z.number().min(0, "Unit price must be at least 0.")),
  memo: z.optional(z.string()),
});

import { ShoppingCartItem } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import FormControllerStrNum from "@/components/form/FormControllerStrNum";

interface EditShoppingProps {
  row: Row<ShoppingCartItem>;
  setIsDialogOpen: (open: boolean) => void;
}

const EditShopping = ({ row, setIsDialogOpen }: EditShoppingProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: row.original.itemName,
      quantity: row.original.quantity,
      unit: row.original.unit,
      unitPrice: row.original.unitPrice ?? undefined,
      memo: row.original.memo ?? undefined,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
  }
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormControllerStrNum
              name="itemName"
              label="Item Name"
              control={form.control}
            />
            <div className="flex items-center gap-4">
              <FormControllerStrNum
                name="quantity"
                label="Quantity"
                control={form.control}
                type="number"
              />
              <FormControllerStrNum
                name="unit"
                label="Unit"
                control={form.control}
              />
              <FormControllerStrNum
                name="unitPrice"
                label="Unit Price"
                control={form.control}
                type="number"
              />
            </div>
            <FormControllerStrNum
              name="memo"
              label="Memo"
              control={form.control}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default EditShopping;
