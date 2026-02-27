"use client";

import { useForm } from "react-hook-form";
import { signupSchema, SignupSchemaType } from "../types/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "@/app/server-aciton/auth/signup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthForm from "../components/AuthForm";
import { CardDescription } from "@/components/ui/card";
import Link from "next/link";

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

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupSchemaType) => {
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

  return (
    <AuthForm
      title={"アカウントを新規作成"}
      description={
        <CardDescription>
          すでにアカウントをお持ちの方は、
          <Link className="text-blue-400 font-medium" href={"/signin"}>
            こちらからログインしてください
          </Link>
        </CardDescription>
      }
      form={form}
      onSubmit={onSubmit}
      formValues={formValues}
      buttonText={"新規登録"}
      submittingText={"登録中..."}
    />
  );
};

export default SignupPage;
