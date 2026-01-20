import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field, FieldGroup } from "@/components/ui/field";

import { Textarea } from "@/components/ui/textarea";
import TypeToggleButton from "./TypeToggleButton";

import { Controller } from "react-hook-form";

import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import FloatingLabel from "./FloatingLabel";
import { SelectedData } from "@/app/types/balance/balance";

import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import ShoppingCartCard from "./ShoppingCartCard";

interface TransactionFormProps {
  selectedDate: SelectedData;
}

const TransactionForm = ({ selectedDate }: TransactionFormProps) => {
  const {
    form,
    onSubmit,
    filteredCategory,
    shoppingCategoryId,
    typeValue,
    open,
    setOpen,
    newAddProduct,
    addInputProduct,
    setAddInputProduct,
    totalCartPrice,
    productsValue,
  } = useTransactionForm();

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen === false) {
          form.reset();
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger
        asChild
        className="text-blue-500 hover:cursor-pointer hover:bg-blue-400 hover:text-white"
      >
        <Button type="button" variant={"secondary"}>
          <CirclePlus />
          内訳を追加
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[35vw] h-[80vh] flex flex-col py-5 overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <DialogHeader>
                <DialogTitle>{selectedDate.date}の収支を追加する</DialogTitle>
                <DialogDescription>
                  収入・支出の内訳を追加します。
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-5">
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2">
                      <TypeToggleButton field={field} type="INCOME" />
                      <TypeToggleButton field={field} type="PAYMENT" />
                    </div>
                  )}
                />
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="relative">
                      <FloatingLabel label="タイトル" fieldState={fieldState} />
                      <Input
                        type="text"
                        className="p-4 h-14"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="categoryId"
                  render={({ field, fieldState }) => (
                    <Field className="relative">
                      <FloatingLabel
                        label="カテゴリー"
                        fieldState={fieldState}
                      />
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger
                          onBlur={field.onBlur}
                          className="w-full data-[size=default]:h-14 p-4"
                        >
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="">
                          {filteredCategory.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                {shoppingCategoryId && typeValue === "PAYMENT" && (
                  <ShoppingCartCard
                    productsValue={productsValue}
                    addInputProduct={addInputProduct}
                    setAddInputProduct={setAddInputProduct}
                    newAddProduct={newAddProduct}
                    onAddFromStock={(selectedStocks) => {
                      const currentHistories =
                        form.getValues("addHistories") || [];

                      // 重複チェック
                      const newProducts = selectedStocks
                        .filter(
                          (stock) =>
                            !currentHistories.some(
                              (item) => item.name === stock.name
                            )
                        )
                        .map((stock) => ({
                          id: uuidv4(),
                          name: stock.name,
                          price: Number(stock.unitPrice),
                          quantity: 0,
                          stockAdd: true,
                        }));

                      // 重複がある場合は、警告
                      if (newProducts.length < selectedStocks.length) {
                        toast.warning(
                          "一部の商品はすでに内訳に存在しているため、追加されませんでした。"
                        );
                      }

                      form.setValue("addHistories", [
                        ...currentHistories,
                        ...newProducts,
                      ]);

                      if (newProducts.length > 0) {
                        toast.success("選択した商品を内訳に追加しました");
                      }
                    }}
                    onCheckedChange={(id, checked) => {
                      form.setValue(
                        "addHistories",
                        productsValue.map((p) =>
                          p.id === id
                            ? {
                                ...p,
                                stockAdd: checked,
                              }
                            : p
                        )
                      );
                    }}
                    onUpdateProduct={(id, field, value) => {
                      form.setValue(
                        "addHistories",
                        productsValue.map((product) =>
                          product.id === id
                            ? {
                                ...product,
                                [field]: value,
                              }
                            : product
                        )
                      );
                    }}
                    onDeleteProduct={(id: string) => {
                      form.setValue(
                        "addHistories",
                        productsValue.filter((product) => product.id !== id)
                      );
                    }}
                  />
                )}

                <Controller
                  control={form.control}
                  name="amount"
                  render={({ field, fieldState }) => (
                    <Field className="relative">
                      <FloatingLabel label="金額" fieldState={fieldState} />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="p-4 h-14"
                          value={field.value || totalCartPrice || ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          onBlur={field.onBlur}
                        />
                        {shoppingCategoryId && typeValue === "PAYMENT" && (
                          <Button
                            className="h-14"
                            onClick={() => {
                              form.setValue("amount", totalCartPrice);
                              form.trigger("amount");
                            }}
                            variant={"secondary"}
                            type="button"
                          >
                            カートの金額を反映
                          </Button>
                        )}
                      </div>
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="memo"
                  render={({ field, fieldState }) => (
                    <Field className="relative">
                      <FloatingLabel label="メモ" fieldState={fieldState} />
                      <Textarea
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="p-4 h-25 resize-none"
                      />
                    </Field>
                  )}
                />
                <Button
                  disabled={!form.formState.isValid}
                  type="submit"
                  className={`bg-green-500 ${
                    !form.formState.isValid
                      ? "opacity-50 cursor-not-allowed hover:bg-green-500"
                      : "hover:bg-green-600"
                  }`}
                >
                  保存
                </Button>
              </div>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
