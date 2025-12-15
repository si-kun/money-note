import {
  SubscriptionFormType,
  subscriptionSchema,
} from "@/app/types/zod/subscription";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

  const form = useForm<SubscriptionFormType>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: row ? String(row.getValue("name")) : "",
      monthlyPrice: row ? Number(row.getValue("monthlyPrice")) : 0,
      startDate: row ? new Date(String(row.getValue("startDate"))) : new Date(),
      endDate: row ? new Date(String(row.getValue("endDate"))) : null,
    },
  });

  const FORM_VALUES = [
    {
      label: "Subscription Title",
      type: "text",
      name: "name",
    },
    {
      label: "Monthly Price",
      type: "number",
      name: "monthlyPrice",
    },
    {
      label: "Start Date",
      type: "date",
      name: "startDate",
    },
    {
      label: "End Date",
      type: "date",
      name: "endDate",
    },
  ];

  const onSubmit = async (data: SubscriptionFormType) => {
    try {
      if (row) {
        await editSubscription({
          id: row?.original.id as string,
          editingTarget: data,
        });
        toast.success("Subscription updated successfully.");
      } else {
        await addSubscriptions(data);
        toast.success("Subscription added successfully.");
      }
    } catch (error) {
      console.error("Error editing subscription:", error);
    } finally {
      setIsDialogOpen(false);
      form.reset();
      window.dispatchEvent(new Event("subscriptionUpdated"));
    }
  };
  const onError = (errors: any) => {
    console.error("Form submission errors:", errors);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)}>
      {FORM_VALUES.map((formField) => (
        <Controller
          key={formField.name}
          name={formField.name as keyof SubscriptionFormType}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
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
                    placeholder="Login button not working on mobile"
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

export default SubscriptionForm;
