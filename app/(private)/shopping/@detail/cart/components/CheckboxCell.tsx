import { updateShoppingChecked } from "@/app/server-aciton/shopping/cart/updateShoppingChecked";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCartItem } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface CheckboxCellProps {
  row: Row<ShoppingCartItem>;
}

const CheckboxCell = ({ row }: CheckboxCellProps) => {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();


  const handleCheckedChange = () => {
    startTransition(async () => {
      try {
        const result = await updateShoppingChecked(
          row.original.id,
          !row.original.checked
        );

        if (!result.success) {
          toast.error(result.message || "チェック状態の更新に失敗しました。");
          return;
        }
        router.refresh();
      } catch (error) {
        console.error("Error updating shopping checked status:", error);
        toast.error("チェック状態の更新に失敗しました。");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        className={`data-[state=checked]:bg-green-400 data-[state=checked]:border-none ${
          isPending ? "opacity-50" : ""
        }`}
        checked={row.original.checked}
        onCheckedChange={handleCheckedChange}
        disabled={isPending}
      />
      {/* ✨ 処理中はスピナー表示（オプション） */}
      {isPending && (
        <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full" />
      )}
    </div>
  );
};

export default CheckboxCell;
