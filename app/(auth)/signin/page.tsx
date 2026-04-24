"use client";

import { useForm } from "react-hook-form";
import AuthForm from "../components/AuthForm";
import { signinSchema, SigninSchemaType } from "../types/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { signin } from "@/app/server-action/auth/signin";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { guestLogin } from "@/app/server-action/auth/guestLogin";
import { useState } from "react";
import { FormValue } from "../types/auth";

  const formValues:FormValue[] = [
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


const SigninPage = () => {
  const router = useRouter();

  const [isGuestLoginLoading, setIsGuestLoginLoading] = useState(false);


  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
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

  const handleGuestLogin = async () => {
    setIsGuestLoginLoading(true);
    try {
      const result = await guestLogin();

      if (!result.success) {
        return toast.error(result.message || "ゲストログインに失敗しました");
      }

      toast.success("ゲストログインに成功しました");
      router.push("/");
    } catch (error) {
      console.error("ゲストログインに失敗しました:", error);
      toast.error("ゲストログインに失敗しました");
    } finally {
      setIsGuestLoginLoading(false);
    }
  };

  return (
    <>
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
      <div className="flex flex-col gap-2">
        <Button
          disabled={isGuestLoginLoading}
          className="mx-6 bg-blue-600 hover:bg-blue-500 "
          type="button"
          onClick={() => handleGuestLogin()}
        >
          {isGuestLoginLoading ? "ゲストログイン中..." : "ゲストログイン"}
        </Button>
        <span className="text-red-500 font-medium text-center text-sm lg:text-md">
          ※ゲストログインボタンから登録なしでお試しいただけます
        </span>
      </div>
    </>
  );
};

export default SigninPage;
