"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ShoppingItemTable } from "../../components/shoppingData-table";
import { ShoppingHistoryWithItems } from "@/app/server-aciton/shopping/history/getShoppingHistory";
import { useState } from "react";
import { editShoppingHistory } from "@/app/server-aciton/shopping/history/editShoppingHIstory";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { historyEditColumns } from "./historyEditColumn";

interface EditHistoryDialogProps {
  selectedHistory: ShoppingHistoryWithItems;
}

const EditHistoryDialog = ({ selectedHistory }: EditHistoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(selectedHistory.date);
  const [totalPrice, setTotalPrice] = useState<number>(
    selectedHistory.totalPrice || 0
  );

  const autoTotalPrice = () => {
    const total = selectedHistory.items?.reduce((acc, item) => {
      return acc + (item.unitPrice || 0) * item.quantity;
    }, 0);
    setTotalPrice(total || 0);
  };

  const handleEdit = async () => {
    try {
      const result = await editShoppingHistory({
        historyId: selectedHistory.id,
        data: {
          ...selectedHistory,
          date: date as Date,
          totalPrice: totalPrice,
        },
      });

      if (result.success) {
        setOpen(false);
        toast.success(`${selectedHistory.name}の編集に成功しました`);
      }
    } catch (error) {
      console.error("Error editing shopping history:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil />
          編集
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="">
          <DialogTitle>{selectedHistory.name}</DialogTitle>
          <div className="flex item-center gap-4">
            <div className="flex items-center gap-2">
              <Label>購入日:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                  >
                    <CalendarIcon />
                    {date ? (
                      format(date, "yyyy/MM/dd")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap">合計金額:</Label>
              <Input
                type="number"
                value={totalPrice}
                onChange={(e) => setTotalPrice(Number(e.target.value))}
              />
            </div>
            <Button type="button" variant={"outline"} onClick={autoTotalPrice}>自動計算を適用</Button>
          </div>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <ShoppingItemTable
          items={selectedHistory.items || []}
          columns={historyEditColumns}
        />
        <DialogFooter>
          <Button type="submit" onClick={handleEdit} variant="outline">
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditHistoryDialog;
