"use client";

import { Subscription } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format, set } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ChevronDownIcon, Ellipsis } from "lucide-react";
import HeaderButton from "./components/HeaderButton";
import { toast } from "sonner";
import { deleteSubscription } from "@/app/server-aciton/subscription/deleteSubscription";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  SubscriptionEditForm,
  subscriptionSchema,
} from "@/app/types/zod/subscription";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { editSubscription } from "@/app/server-aciton/subscription/editSubscription";

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
      } else {
        console.error("Failed to delete subscription:", response.message);
        toast.error("Failed to delete subscription:" + response.message);
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  // サブスクの更新処理
  const handleEditing = async (data: SubscriptionEditForm) => {
    try {
      console.log(data);
      const result = await editSubscription(data);

      if (result.success) {
        toast.success("Subscription edited successfully");
        setIsDialogOpen(false);
        setIsDropdownOpen(false);
        router.refresh();
        reset();
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

  // const form = useForm<SubscriptionEditForm>({
  const formMethods = useForm<SubscriptionEditForm>({
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
    handleSubmit,
    control,
    reset,
    formState: { isValid, isSubmitting },
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
            <Form {...formMethods}>
              <form
                onSubmit={handleSubmit(handleEditing)}
                className="gap-4 w-full flex flex-col"
              >
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="monthlyPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <FormField
                    control={control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex flex-col gap-3">
                            <Label htmlFor="date" className="px-1">
                              Start Date
                            </Label>
                            <Popover
                              open={startOpen}
                              onOpenChange={setStartOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date"
                                  className="w-48 justify-between font-normal"
                                >
                                  {field.value
                                    ? format(field.value, "yyyy/MM/dd")
                                    : "Select date"}
                                  <ChevronDownIcon />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  captionLayout="dropdown"
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    setStartOpen(false);
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex flex-col gap-3">
                            <Label htmlFor="date" className="px-1">
                              End Date
                            </Label>
                            <Popover open={endOpen} onOpenChange={setEndOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date"
                                  className="w-48 justify-between font-normal"
                                >
                                  {field.value
                                    ? format(field.value, "yyyy/MM/dd")
                                    : "Select date"}
                                  <ChevronDownIcon />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value ?? undefined}
                                  captionLayout="dropdown"
                                  {...field}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    setEndOpen(false);
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {isSubmitting ? (
                  <div className="flex gap-2 justify-end">
                    <Button
                      disabled={isSubmitting}
                      className="disabled:bg-slate-400"
                      type="button"
                    >
                      送信中...
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-end">
                    <Button
                      disabled={!isValid}
                      className="bg-green-500 hover:bg-green-400"
                      type="submit"
                    >
                      {buttonText}
                    </Button>
                    <Button
                      type="button"
                      variant={"secondary"}
                      onClick={handleCancel}
                    >
                      キャンセル
                    </Button>
                  </div>
                )}
              </form>
            </Form>
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
