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
import { toast } from "sonner";

interface DeleteDialogProps {
  name: string;
  id: string;
}

const DeleteDialog = ({ name, id }: DeleteDialogProps) => {
  const handleDelete = async () => {
    try {
      await deleteCart(id);
      toast.success(`${name}を削除しました`);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(`${name}の削除に失敗しました`);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={"secondary"}
          size={"icon"}
          className="hover:cursor-pointer"
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
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
