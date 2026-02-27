"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import { SigninSchemaType, SignupSchemaType } from "../types/authSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface AuthFormProps<T extends SignupSchemaType | SigninSchemaType> {
  title: string;
  description: React.ReactNode;
  submittingText: string;
  buttonText: string;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => Promise<void>;
  formValues: {
    name: string;
    label: string;
    type: string;
  }[];
}

const AuthForm = <T extends SigninSchemaType | SignupSchemaType>({
  title,
  description,
  buttonText,
  submittingText,
  form,
  onSubmit,
  formValues,
}: AuthFormProps<T>) => {
  const disabled = !form.formState.isValid || form.formState.isSubmitting;

  return (
    <>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description}
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            {formValues.map((formValue) => (
              <Controller
                key={formValue.name}
                control={form.control}
                name={
                  formValue.name as Path<T>
                }
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <FieldLabel>{formValue.label}</FieldLabel>
                      <span className="text-red-600 text-sm font-semibold">
                        {fieldState.error?.message}
                      </span>
                    </div>
                    <Input type={formValue.type} {...field} />
                  </Field>
                )}
              />
            ))}
            <Button
              disabled={disabled}
              className="bg-green-500 hover:bg-green-400 text-white w-full disabled:bg-slate-300 disabled:text-gray-500"
              type="submit"
            >
              {form.formState.isSubmitting ? submittingText : buttonText}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </>
  );
};

export default AuthForm;
