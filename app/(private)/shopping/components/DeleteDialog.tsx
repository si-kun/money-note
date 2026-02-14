"use client";

import { deleteCart } from "@/app/server-aciton/shopping/cart/deleteCart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface DeleteDialogProps {
  name: string;
  id: string;
}

const DeleteDialog = ({ name, id }: DeleteDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
         const result = await deleteCart(id);

         if(!result.success) {
          toast.error(result.message)
          return;
         }

        toast.success(`${name}を削除しました`);
        router.refresh();
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error(`${name}の削除に失敗しました`);
      }
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={"secondary"}
          size={"icon"}
          className="hover:cursor-pointer"
          disabled={isPending}
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            {`本当に${name}を削除しますか？`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            この操作は元に戻せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "削除中..." : "Countinue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
