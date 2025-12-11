"use client";

import { Subscription } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {  Ellipsis } from "lucide-react";
import HeaderButton from "./components/HeaderButton";
import { toast } from "sonner";
import { deleteSubscription } from "@/app/server-aciton/subscription/deleteSubscription";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  SubscriptionFormType,
  subscriptionSchema,
} from "@/app/types/zod/subscription";
import { useEffect, useState } from "react";
import { editSubscription } from "@/app/server-aciton/subscription/editSubscription";
import SubscriptionForm from "./components/SubscriptionForm";

function ActionsCell({ row }: { row: Subscription }) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  // サブスクの削除処理
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteSubscription(id);
      if (response.success) {
        console.log("Subscription deleted successfully");
        toast.success("Subscription deleted successfully");
        router.refresh();
        window.dispatchEvent(new Event("subscriptionUpdated"));
      } else {
        console.error("Failed to delete subscription:", response.message);
        toast.error("Failed to delete subscription:" + response.message);
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  // サブスクの更新処理
  const handleEditing = async (data: SubscriptionFormType) => {
    try {
      console.log(data);
      const result = await editSubscription(data);

      if (result.success) {
        toast.success("Subscription edited successfully");
        setIsDialogOpen(false);
        setIsDropdownOpen(false);
        router.refresh();
        reset();
        window.dispatchEvent(new Event("subscriptionUpdated"));
      }
    } catch (error) {
      console.error("Error editing subscription:", error);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setIsDropdownOpen(false);
    reset();
  };

  const formMethods = useForm<SubscriptionFormType>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      id: row.id,
      name: row.name,
      monthlyPrice: row.monthlyPrice,
      startDate: row.startDate,
      endDate: row.endDate ?? undefined,
    },
  });

  const {
    reset,
    formState: { isValid },
  } = formMethods;

  useEffect(() => {
    if (isDialogOpen) {
      reset({
        id: row.id,
        name: row.name,
        monthlyPrice: row.monthlyPrice,
        startDate: row.startDate,
        endDate: row.endDate ?? undefined,
      });
    }
  }, [isDialogOpen, row, reset]);

  const buttonText = isValid ? "変更する" : "内容を確認してください";

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => handleDelete(row.id)}
        >
          delete
        </DropdownMenuItem>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if(!open) {
            setIsDropdownOpen(false)
            reset()
          } else {
            reset({
              id: row.id,
              name: row.name,
              monthlyPrice: row.monthlyPrice,
              startDate: row.startDate,
              endDate: row.endDate ?? undefined,
            })
          }
        }}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>{row.name}</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <SubscriptionForm
            formMethods={formMethods}
            submitSubscription={handleEditing}
            handleCancel={handleCancel}
            startOpen={startOpen}
            setStartOpen={setStartOpen}
            endOpen={endOpen}
            setEndOpen={setEndOpen}
            submitButtonText={buttonText}
            />
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  // monthlyPrice
  {
    accessorKey: "monthlyPrice",
    // header: "MonthlyPrice",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <HeaderButton
          isSorted={isSorted}
          column={column}
          text={"monthlyPrice"}
        />
      );
    },
    cell: ({ row }) => {
      const monthlyPrice = Number(row.getValue("monthlyPrice"));
      return <div className="">¥{monthlyPrice.toLocaleString()}</div>;
    },
  },
  // startDate
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <HeaderButton isSorted={isSorted} column={column} text={"startDate"} />
      );
    },
    cell: ({ row }) => {
      const startDate = new Date(row.getValue("startDate"));
      return format(startDate, "yyyy/MM/dd");
    },
  },
  // endDate
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <HeaderButton isSorted={isSorted} column={column} text={"endDate"} />
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("endDate");

      if (!value || !(value instanceof Date)) {
        return "";
      }

      const endDate = new Date(value);
      return format(endDate, "yyyy/MM/dd");
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const subscription = row.original;
      return <ActionsCell row={subscription} />;
    },
  },
];
