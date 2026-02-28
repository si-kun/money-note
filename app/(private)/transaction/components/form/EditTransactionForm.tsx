"use client";

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

import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FloatingLabel from "./FloatingLabel";
import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/transaction/transaction";
import { useEditTransactionForm } from "@/hooks/useEditTransactionForm";

import DeleteConfirmDialog from "@/components/dialog/DeleteConfirmDialog";
import ShoppingHistoryCard from "../shopping/ShoppingHistoryCard";
import { Category } from "@prisma/client";
import {
  filterCategoriesByType,
  getShoppingCategoryId,
} from "@/utils/category/category";

interface EditTransactionFormProps {
  transaction: PaymentWithCategory | IncomeWithCategory;
  type: "INCOME" | "PAYMENT";
  date: string;
  categories: Category[];
}

const EditTransactionForm = ({
  transaction,
  type,
  date,
  categories,
}: EditTransactionFormProps) => {
  const {
    form,
    open,
    setOpen,
    onSubmit,
    handleDeleteTransaction,
    categoryIdValue,
    isPending,
  } = useEditTransactionForm({ transaction, type });

  const payment =
    type === "PAYMENT" ? (transaction as PaymentWithCategory) : null;

  const filteredCategories = filterCategoriesByType(categories, type);
  const shoppingId = getShoppingCategoryId(categories, categoryIdValue);
  const isShoppingPayment = shoppingId && type === "PAYMENT";

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
        className="text-blue-500 ml-2 hover:cursor-pointer hover:bg-blue-400 hover:text-white"
      >
        <Button type="button" variant={"secondary"}>
          編集
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[80vw] h-[80vh] flex flex-col py-5 overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <DialogHeader>
                <DialogTitle>{date}の収支を変更する</DialogTitle>
                <DialogDescription>
                  収入・支出の内訳を追加します。
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-5">
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
                        onChange={(e) => field.onChange(e.target.value.trim())}
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
                        disabled={!!shoppingId}
                      >
                        <SelectTrigger
                          onBlur={field.onBlur}
                          className="w-full data-[size=default]:h-14 p-4"
                        >
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="">
                          {filteredCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                {isShoppingPayment && payment && (
                  <ShoppingHistoryCard
                    shoppingHistory={payment.shoppingHistory}
                  />
                )}

                <Controller
                  control={form.control}
                  name="amount"
                  render={({ field, fieldState }) => (
                    <Field className="relative">
                      <FloatingLabel label="金額" fieldState={fieldState} />
                      <Input
                        type="number"
                        min={0}
                        className="p-4 h-14"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onBlur={field.onBlur}
                      />
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
                        onChange={(e) => field.onChange(e.target.value.trim())}
                        className="p-4 h-25 resize-none"
                      />
                    </Field>
                  )}
                />
                <Button
                  disabled={!form.formState.isValid || isPending}
                  type="submit"
                  className={`bg-green-500 ${
                    !form.formState.isValid || isPending
                      ? "opacity-50 cursor-not-allowed hover:bg-green-500"
                      : "hover:bg-green-600"
                  }`}
                >
                  {isPending ? "保存中..." : "保存"}
                </Button>
                <DeleteConfirmDialog onConfirm={handleDeleteTransaction} />
              </div>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionForm;
