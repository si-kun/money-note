import { guestLogin } from '@/app/server-action/auth/guestLogin';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { toast } from 'sonner';

const GuestLoginButton = () => {

    const router = useRouter()

const [isGuestLoginLoading, setIsGuestLoginLoading] = useState(false);

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
  );
}

export default GuestLoginButton