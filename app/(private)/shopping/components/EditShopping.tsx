"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";

import { ShoppingCartItem } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import FormControllerStrNum from "@/components/form/FormControllerStrNum";
import { editShoppingCartItem } from "@/app/server-aciton/shopping/cart/editShoppingCartItem";
import {
  ShoppingCartItemInput,
  shoppingCartItemSchema,
} from "@/app/types/zod/shoppingCartItem";

interface EditShoppingProps {
  row: Row<ShoppingCartItem>;
  setIsDialogOpen: (open: boolean) => void;
}

const EditShopping = ({ row, setIsDialogOpen }: EditShoppingProps) => {
  const form = useForm<ShoppingCartItemInput>({
    resolver: zodResolver(shoppingCartItemSchema),
    defaultValues: {
      itemName: row.original.itemName,
      quantity: row.original.quantity,
      unit: row.original.unit,
      unitPrice: row.original.unitPrice || 0,
      memo: row.original.memo || "",
      stockId: row.original.stockId || null,
    },
  });

  const onSubmit = async (data: ShoppingCartItemInput) => {
    try {
      await editShoppingCartItem({
        itemId: row.original.id,
        data: {
          itemName: data.itemName,
          quantity: Number(data.quantity),
          unit: data.unit,
          unitPrice: data.unitPrice,
          memo: data.memo || "",
          stockId: row.original.stockId|| null,
        },
      });
      toast.success("ショッピングアイテムを更新しました");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating shopping item:", error);
      toast.error("更新中にエラーが発生しました");
    }
  };
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>ショッピングアイテム編集</CardTitle>
        <CardDescription>ショッピングアイテムを編集します</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormControllerStrNum
              name="itemName"
              label="Item Name"
              control={form.control}
              placeholder="商品名を入力してください"
            />
            <div className="flex items-center gap-4">
              <FormControllerStrNum
                name="quantity"
                label="Quantity"
                type={"number"}
                control={form.control}
                placeholder="数量を入力してください"
              />
              <FormControllerStrNum
                name="unit"
                label="Unit"
                control={form.control}
                placeholder="単位を入力してください"
              />
              <FormControllerStrNum
                name="unitPrice"
                label="Unit Price"
                control={form.control}
                type={"number"}
                placeholder="値段を入力してください"
              />
            </div>
            <FormControllerStrNum
              name="memo"
              label="Memo"
              control={form.control}
              placeholder="メモを入力してください"
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
