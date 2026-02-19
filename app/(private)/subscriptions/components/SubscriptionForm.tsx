import {
  SubscriptionFormType,
  subscriptionSchema,
} from "@/app/types/zod/subscription";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Row } from "@tanstack/react-table";
import { useState, useTransition } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import CalendarField from "./CalendarField";
import { Subscription } from "@prisma/client";
import { editSubscription } from "@/app/server-aciton/subscription/editSubscription";
import { toast } from "sonner";
import { addSubscriptions } from "@/app/server-aciton/subscription/addSubscriptions";

interface SubscriptionFormProps {
  row?: Row<Subscription>;
  setIsDialogOpen: (open: boolean) => void;
}

const SubscriptionForm = ({ row, setIsDialogOpen }: SubscriptionFormProps) => {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm<SubscriptionFormType>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: row ? String(row.getValue("name")) : "",
      monthlyPrice: row ? Number(row.getValue("monthlyPrice")) : undefined,
      startDate: row ? new Date(String(row.getValue("startDate"))) : new Date(),
      endDate: row ? new Date(String(row.getValue("endDate"))) : null,
    },
  });

  const FORM_VALUES = [
    {
      label: "タイトル",
      type: "text",
      name: "name",
    },
    {
      label: "月額料金",
      type: "number",
      name: "monthlyPrice",
    },
    {
      label: "開始日",
      type: "date",
      name: "startDate",
    },
    {
      label: "終了日",
      type: "date",
      name: "endDate",
    },
  ];

  const onSubmit = async (data: SubscriptionFormType) => {
    startTransition(async () => {
      try {
        if (row) {
          await editSubscription({
            id: row?.original.id as string,
            editingTarget: data,
          });
          toast.success("サブスクの更新が成功しました。");
        } else {
          await addSubscriptions(data);
          toast.success("サブスクの登録が成功しました。");
        }
      } catch (error) {
        console.error("送信時にエラーが発生しました:", error);
      } finally {
        setIsDialogOpen(false);
        form.reset();
      }
    });
  };

  const onError = (errors: FieldErrors<SubscriptionFormType>) => {
    console.error("Form submission errors:", errors);
  };

  const isValid = !form.formState.isValid;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-4"
    >
      {FORM_VALUES.map((formField) => (
        <Controller
          key={formField.name}
          name={formField.name as keyof SubscriptionFormType}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col gap-1"
            >
              {formField.type === "date" ? (
                <CalendarField
                  field={field}
                  formField={formField}
                  open={field.name === "startDate" ? startOpen : endOpen}
                  setOpen={
                    field.name === "startDate" ? setStartOpen : setEndOpen
                  }
                />
              ) : (
                <>
                  <FieldLabel htmlFor={field.name}>
                    {formField.label}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type={formField.type}
                    aria-invalid={fieldState.invalid}
                    placeholder={
                      formField.name === "monthlyPrice"
                        ? "0"
                        : "登録するサブスクリプションのタイトルを入力してください"
                    }
                    autoComplete="off"
                    value={field.value instanceof Date ? "" : field.value ?? ""}
                    onChange={(e) =>
                      formField.type === "number"
                        ? field.onChange(Number(e.target.value))
                        : field.onChange(e.target.value)
                    }
                  />
                </>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      ))}

      <Button
        disabled={isValid}
        className={`bg-green-500 hover:bg-green-600 ${
          isValid ? "cursor-not-allowed opacity-50 bg-slate-500" : ""
        }`}
        type="submit"
      >
        {isPending ? "送信中..." : row ? "更新" : "登録する"}
      </Button>
    </form>
  );
};

export default SubscriptionForm;
