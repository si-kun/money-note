"use client";

import { Subscription } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import HeaderButton from "./components/HeaderButton";
import SubscriptionForm from "./components/SubscriptionForm";
import ActionsCell from "@/components/dataTable/ActionsCell";
import { deleteSubscription } from "@/app/server-aciton/subscription/deleteSubscription";
import { toast } from "sonner";

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
    accessorKey: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async () => {
        try {
          await deleteSubscription(row.original.id);
          toast.success("Subscription deleted successfully.");
          window.dispatchEvent(new Event("subscriptionUpdated"));
        } catch (error) {
          console.error("Error deleting subscription:", error);
        }
      };
      return (
        <ActionsCell row={row} onClickDelete={handleDelete}>
          {({ row, setIsDialogOpen }) => (
            <SubscriptionForm row={row} setIsDialogOpen={setIsDialogOpen} />
          )}
        </ActionsCell>
      );
    },
  },
];
