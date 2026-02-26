"use client";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { authSchema, AuthSchemaType } from "../types/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { signup } from "@/app/server-aciton/auth/signup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignupPage = () => {
  const router = useRouter();

  const formValues = [
    {
      name: "userName",
      label: "ユーザー名",
      type: "text",
    },
    {
      name: "email",
      label: "メールアドレス",
      type: "email",
    },
    {
      name: "password",
      label: "パスワード",
      type: "password",
    },
  ];

  const form = useForm<AuthSchemaType>({
    resolver: zodResolver(authSchema),
    mode: "onBlur",
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthSchemaType) => {
    try {
      const result = await signup(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success("ユーザーの作成に成功しました");
      router.push("/");
    } catch (error) {
      toast.error("ユーザーの作成に失敗しました");
      console.error("ユーザーの作成に失敗しました:", error);
    }
  };

  const disabled = !form.formState.isValid || form.formState.isSubmitting;

  return (
    <>
      <CardHeader>
        <CardTitle>アカウントを新規作成</CardTitle>
        <CardDescription>
          すでにアカウントをお持ちの方は、
          <Link className="text-blue-400 font-medium" href={"/signin"}>
            こちらからログインしてください
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            {formValues.map((formValue) => (
              <Controller
                key={formValue.name}
                control={form.control}
                name={formValue.name as keyof AuthSchemaType}
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
              {form.formState.isSubmitting ? "登録中..." : "新規登録"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </>
  );
};

export default SignupPage;
