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
} from "@/app/types/balance/balance";
import { useEditTransactionForm } from "@/hooks/useEditTransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HistoryDetail from "./HistoryDetail";

interface EditTransactionFormProps {
  transaction: PaymentWithCategory | IncomeWithCategory;
  type: "INCOME" | "PAYMENT";
  date: string;
}

const EditTransactionForm = ({
  transaction,
  type,
  date,
}: EditTransactionFormProps) => {
  const {
    form,
    open,
    setOpen,
    onSubmit,
    filteredCategory,
    shoppingCategoryId,
  } = useEditTransactionForm({ transaction, type });

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
                        disabled={
                          shoppingCategoryId === form.watch("categoryId")
                        }
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

                {type === "PAYMENT" &&
                  (transaction as PaymentWithCategory).shoppingHistory && (
                    <Card>
                      <CardHeader>
                        <CardTitle>買い物履歴</CardTitle>
                        <DialogDescription>
                          ※買い物履歴と紐付いているため、カテゴリは変更できません
                        </DialogDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <div>
                          <div className="w-full flex items-center">
                            <span>
                              {
                                (transaction as PaymentWithCategory)
                                  .shoppingHistory?.name
                              }
                            </span>
                            <span className="ml-auto">
                              金額:¥
                              {(
                                transaction as PaymentWithCategory
                              ).shoppingHistory?.totalPrice?.toLocaleString() ||
                                0}
                            </span>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" className="ml-2">
                                  【詳細】
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    {
                                      (transaction as PaymentWithCategory)
                                        .shoppingHistory?.name
                                    }
                                    の詳細
                                  </DialogTitle>
                                </DialogHeader>

                                <HistoryDetail
                                  data={
                                    (transaction as PaymentWithCategory)
                                      .shoppingHistory!
                                  }
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                <Controller
                  control={form.control}
                  name="amount"
                  render={({ field, fieldState }) => (
                    <Field className="relative">
                      <FloatingLabel label="金額" fieldState={fieldState} />
                      <Input
                        type="number"
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

export default EditTransactionForm;
