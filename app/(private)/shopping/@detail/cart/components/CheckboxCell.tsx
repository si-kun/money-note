import { updateShoppingChecked } from "@/app/server-action/shopping/cart/updateShoppingChecked";
import { pendingAtom } from "@/app/store/shopping/cartAtom";
import { ShoppingCartItemWithStock } from "@/app/types/shopping/shopping";
import { Checkbox } from "@/components/ui/checkbox";
import { Row } from "@tanstack/react-table";
import { useSetAtom } from "jotai";
import { useEffect, useOptimistic, useTransition } from "react";
import { toast } from "sonner";

interface CheckboxCellProps {
  row: Row<ShoppingCartItemWithStock>;
}

const CheckboxCell = ({ row }: CheckboxCellProps) => {

  const setIsPending = useSetAtom(pendingAtom)
  const [isPending, startTransition] = useTransition();
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(row.original.checked)


  const handleCheckedChange = () => {
    setIsPending((prev) => prev + 1)
    startTransition(async () => {
      setOptimisticChecked((prev) => !prev);
      try {
        const result = await updateShoppingChecked(
          row.original.id,
          !row.original.checked
        );

        if (!result.success) {
          toast.error(result.message || "チェック状態の更新に失敗しました。");
          return;
        }
      } catch (error) {
        console.error("Error updating shopping checked status:", error);
        toast.error("チェック状態の更新に失敗しました。");
      } 
    });
  };

  useEffect(() => {
    if(!isPending) {
      setIsPending((prev) => Math.max(0, prev -1))
    }
  },[isPending, setIsPending])

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        className={`data-[state=checked]:bg-green-400 data-[state=checked]:border-none ${
          isPending ? "opacity-50" : ""
        }`}
        checked={optimisticChecked}
        onCheckedChange={handleCheckedChange}
        disabled={isPending}
      />
      {/*  処理中はスピナー表示 */}
      {isPending && (
        <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full" />
      )}
    </div>
  );
};

export default CheckboxCell;
