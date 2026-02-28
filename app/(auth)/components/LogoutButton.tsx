"use client";

import { signOut } from "@/app/server-aciton/auth/signout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LogoutButton = () => {

    const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await signOut();

      if (result.success) {
        toast.success("ログアウトしました");
        router.push("/signin");
      } else {
        toast.error("ログアウトに失敗しました");
      }
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
      toast.error("ログアウトに失敗しました");
    }
  };

  return (
    <Button onClick={() => handleLogout()} type="button" className="w-full" variant={"outline"}>
      ログアウト
    </Button>
  );
};

export default LogoutButton;
