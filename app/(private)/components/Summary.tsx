import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChevronDownIcon, CirclePlus, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { SelectedData } from "../page";
import SummaryCard from "./SummaryCard";

interface SummaryProps {
    selectedDate: SelectedData;

    date: Date;
    setDate: (date: Date) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const Summary = ({selectedDate,open,setOpen,date,setDate}:SummaryProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>日付:{selectedDate?.date}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 overflow-y-auto">
        {/* 収入、支出、残高のカード */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between gap-4">
            <SummaryCard title={"収入"} amount={selectedDate.totalIncome} />
            <SummaryCard title={"支出"} amount={selectedDate.totalPayment} />
          </div>
            <SummaryCard title={"残高"} amount={selectedDate.balance} />
        </div>

        {/* 追加ボタン */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gapx-3 py-1">
            <List />
            <span className="font-semibold">内訳</span>
          </div>
          <Dialog>
            <DialogTrigger
              asChild
              className="text-blue-500 hover:cursor-pointer hover:bg-blue-400 hover:text-white"
            >
              <Button type="button" variant={"secondary"}>
                <CirclePlus />
                内訳を追加
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[80vw] h-[80vh] flex flex-col py-5">
              <DialogHeader>
                <DialogTitle>2025-11-30の収支を追加する</DialogTitle>
              </DialogHeader>
              <form className="flex flex-col gap-5">
                <div className="grid grid-cols-2">
                  <Button
                    type="button"
                    variant={"secondary"}
                    className="w-full bg-blue-200 py-5"
                  >
                    収入
                  </Button>
                  <Button
                    type="button"
                    variant={"secondary"}
                    className="w-full bg-red-200 py-5"
                  >
                    支出
                  </Button>
                </div>
                <div className="relative">
                  <Label className="absolute bg-white px-3 py-1 z-10 -top-3 left-5 text-sm text-gray-400">
                    日付
                  </Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal h-14"
                      >
                        {date ? date.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDate(date);
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="relative">
                  <Label className="absolute bg-white px-3 py-1 z-10 -top-3 left-5 text-sm text-gray-400">
                    カテゴリー
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full data-[size=default]:h-14 p-4">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent className="">
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Label className="absolute bg-white px-3 py-1 z-10 -top-3 left-5 text-sm text-gray-400">
                    金額
                  </Label>
                  <Input type="text" className="p-4 h-14" />
                </div>
                <div className="relative">
                  <Label className="absolute bg-white px-3 py-1 z-10 -top-3 left-5 text-sm text-gray-400">
                    内容
                  </Label>
                  <Input type="text" className="p-4 h-14" />
                </div>
                <Button type="submit" className="bg-green-500">
                  保存
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* 内訳リスト */}
        <div className="flex flex-col gap-3 py-1 overflow-y-auto">
          {selectedDate?.incomes?.map((income) => (
            <Card className="bg-blue-200" key={income.id}>
              <CardContent className="flex">
                <span className="w-[30%]">{income.category.name}</span>
                <span className="w-[40%]">{income.title || ""}</span>
                <span className="ml-auto">
                  ¥{income.amount.toLocaleString()}
                </span>
              </CardContent>
            </Card>
          ))}

          {selectedDate?.payments?.map((payment) => (
            <Card className="bg-red-200" key={payment.id}>
              <CardContent className="flex">
                <span className="w-[30%]">{payment.category.name}</span>
                <span className="w-[40%]">{payment.title || ""}</span>
                <span className="ml-auto">
                  ¥{payment.amount.toLocaleString()}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Summary;
