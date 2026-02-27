"use client";

import { useForm } from "react-hook-form";
import AuthForm from "../components/AuthForm";
import { signinSchema, SigninSchemaType } from "../types/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { signin } from "@/app/server-aciton/auth/signin";
import { useRouter } from "next/navigation";

const SigninPage = () => {
  const router = useRouter();

  const formValues = [
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

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SigninSchemaType) => {
    try {
      const result = await signin(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success("ログインに成功しました");
      router.push("/");
    } catch (error) {
      console.error("ログインに失敗しました:", error);
      toast.error("ログインに失敗しました");
    }
  };

  return (
    <AuthForm
      title={"ログイン"}
      description={
        <CardDescription>
          アカウントをお持ちでない方は、
          <Link className="text-blue-400 font-medium" href={"/signup"}>
            こちらから新規登録してください
          </Link>
        </CardDescription>
      }
      form={form}
      onSubmit={onSubmit}
      formValues={formValues}
      buttonText={"ログイン"}
      submittingText={"ログイン中..."}
    />
  );
};

export default SigninPage;
