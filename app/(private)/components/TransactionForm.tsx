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
import ShoppingHistorySelector from "./ShoppingHistorySelector";

import { Controller } from "react-hook-form";

import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectedData } from "../page";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import FloatingLabel from "./FloatingLabel";

interface TransactionFormProps {
  selectedDate: SelectedData;
}

const TransactionForm = ({ selectedDate }: TransactionFormProps) => {

  const {
    form,
    onsubmit,
    filteredCategory,
    shoppingCategoryId,
    typeValue,
    histories,
    setHistories,
    open,
    setOpen,
  } = useTransactionForm();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        if(isOpen === false) {
            form.reset();
        }
        setOpen(isOpen);
    }}>
      <DialogTrigger
        asChild
        className="text-blue-500 hover:cursor-pointer hover:bg-blue-400 hover:text-white"
      >
        <Button type="button" variant={"secondary"}>
          <CirclePlus />
          内訳を追加
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[80vw] h-[80vh] flex flex-col py-5 overflow-y-auto">
        <form onSubmit={form.handleSubmit(onsubmit)}>
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
                  control={form.control}
                  name="categoryId"
                  render={({ field,fieldState }) => (
                    <Field className="relative">
                      <FloatingLabel label="カテゴリー" fieldState={fieldState} />
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger
                        onBlur={field.onBlur}
                        className="w-full data-[size=default]:h-14 p-4">
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
                  <ShoppingHistorySelector
                    control={form.control}
                    histories={histories}
                    setHistories={setHistories}
                  />
                )}

                <Controller
                  control={form.control}
                  name="amount"
                  render={({ field,fieldState }) => (
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
                  render={({ field,fieldState }) => (
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
