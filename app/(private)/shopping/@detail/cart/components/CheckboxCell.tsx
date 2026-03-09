import { updateShoppingChecked } from "@/app/server-action/shopping/cart/updateShoppingChecked";
import { ShoppingCartItemWithStock } from "@/app/types/shopping/shopping";
import { Checkbox } from "@/components/ui/checkbox";
import { Row } from "@tanstack/react-table";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

interface CheckboxCellProps {
  row: Row<ShoppingCartItemWithStock>;
}

const CheckboxCell = ({ row }: CheckboxCellProps) => {

  const [isPending, startTransition] = useTransition();
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(row.original.checked)


  const handleCheckedChange = () => {
    startTransition(async () => {
      try {
        setOptimisticChecked((prev) => !prev);
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
