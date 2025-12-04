"use client";

import FullCalendar from "@fullcalendar/react";

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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDownIcon, CirclePlus, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { getIncome } from "../server-aciton/balance/getIncome";
import { getPayment } from "../server-aciton/balance/getPayment";
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import BalanceCalendar from "@/components/calendar/Calendar";
import { Calendar } from "@/components/ui/calendar";
import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "../types/balance/balance";

type BalanceData = Record<
  string,
  {
    income: number;
    payment: number;
    balance: number;
  }
>;

interface SelectedData {
  date: string;
  incomes: IncomeWithCategory[];
  payments: PaymentWithCategory[];
  totalIncome: number;
  totalPayment: number;
  balance: number;
}

export interface EventData {
  title: string;
  start: string;
  allDay: boolean;
  extendedProps: {
    income: number;
    payment: number;
    balance: number;
  };
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [incomeData, setIncomeData] = useState<IncomeWithCategory[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentWithCategory[]>([]);
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);

  // 日付
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);

  const todayKey = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<SelectedData | null>();

  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        setEvents([]);
        const tempBalanceData: BalanceData = {};

        const incomeResult = await getIncome({ year, month });
        const paymentResult = await getPayment({ year, month });

        if (incomeResult.success && paymentResult.success) {
          setIncomeData(incomeResult.data);
          setPaymentData(paymentResult.data);
          // 収入データの処理
          paymentResult.data.forEach((payment) => {
            const datekey = payment.paymentDate.toISOString().split("T")[0];
            if (!tempBalanceData[datekey]) {
              tempBalanceData[datekey] = { income: 0, payment: 0, balance: 0 };
            }
            tempBalanceData[datekey].payment += payment.amount;
          });
          // 支出データの処理
          incomeResult.data.forEach((income) => {
            const datekey = income.incomeDate.toISOString().split("T")[0];
            if (!tempBalanceData[datekey]) {
              tempBalanceData[datekey] = { income: 0, payment: 0, balance: 0 };
            }
            tempBalanceData[datekey].income += income.amount;
          });

          // 残高の計算
          Object.keys(tempBalanceData).forEach((datekey) => {
            const data = tempBalanceData[datekey];
            data.balance = data.income - data.payment;
          });
          setBalanceData(tempBalanceData);

          // 当日のデータを選択状態にする

          const todayYear = today.getFullYear();
          const todayMonth = today.getMonth() + 1;

          let targetDate: string;

          if (year === todayYear && month === todayMonth) {
            targetDate = todayKey;
          } else {
            targetDate = `${year}-${String(month).padStart(2, "0")}-01`;
          }

          const selectedIncomes = incomeResult.data.filter((income) => {
            return income.incomeDate.toISOString().split("T")[0] === targetDate;
          });

          const selectedPayments = paymentResult.data.filter((payment) => {
            return (
              payment.paymentDate.toISOString().split("T")[0] === targetDate
            );
          });
          const totalIncome = selectedIncomes.reduce(
            (sum, income) => sum + income.amount,
            0
          );
          const totalPayment = selectedPayments.reduce(
            (sum, payment) => sum + payment.amount,
            0
          );

          setSelectedDate({
            date: targetDate,
            incomes: selectedIncomes,
            payments: selectedPayments,
            totalIncome,
            totalPayment,
            balance: totalIncome - totalPayment,
          });
        }

        return { income: incomeResult, payment: paymentResult };
      } catch (error) {
        console.error("Error fetching balance data:", error);
      }
    };
    fetchBalanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);


  useEffect(() => {
    if (!balanceData) return;
    Object.entries(balanceData).forEach(([date, data]) => {
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          title: date,
          start: date,
          allDay: true,
          extendedProps: {
            income: data.income,
            payment: data.payment,
            balance: data.balance,
          },
        },
      ]);
    });
  }, [balanceData]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((prev) => prev - 1);
      setMonth(12);
    } else {
      setMonth((prev) => prev - 1);
    }
    calendarRef.current?.getApi().prev();
  };
  const handleNextMonth = () => {
    if (month === 12) {
      setYear((prev) => prev + 1);
      setMonth(1);
    } else {
      setMonth((prev) => prev + 1);
    }
    calendarRef.current?.getApi().next();
  };

  const handleSelectedDate = (clickedDate: string) => {

    const selectedIncomes = incomeData.filter((income) => {
      return income.incomeDate.toISOString().split("T")[0] === clickedDate;
    })

    const selectedPayments = paymentData.filter((payment) => {
      return payment.paymentDate.toISOString().split("T")[0] === clickedDate;
    })

    const totalIncome = selectedIncomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );
    const totalPayment = selectedPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    setSelectedDate({
      date: clickedDate,
      incomes: selectedIncomes,
      payments: selectedPayments,
      totalIncome,
      totalPayment,
      balance: totalIncome - totalPayment,
    });
  };

  const handleDateClick = (arg: DateClickArg) => {
    handleSelectedDate(arg.dateStr);
  }

  const handleEventClick = (arg: EventClickArg) => {
    handleSelectedDate(arg.event.startStr);
  }

  return (
    <div className="w-full h-full flex gap-4 overflow-hidden">
      <BalanceCalendar
        year={year}
        month={month}
        handleNextMonth={handleNextMonth}
        handlePrevMonth={handlePrevMonth}
        handleDateClick={handleDateClick}
        handleEventClick={handleEventClick}
        events={events}
        calendarRef={calendarRef}
      />
      <div className="flex-1 h-full overflow-y-hidden">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>日付:{selectedDate?.date}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4 overflow-y-auto">
            {/* 収入、支出、残高のカード */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>収入</CardTitle>
                </CardHeader>
                <CardContent>
                  ¥{selectedDate?.totalIncome.toLocaleString()}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>支出</CardTitle>
                </CardHeader>
                <CardContent>
                  ¥{selectedDate?.totalPayment.toLocaleString()}
                </CardContent>
              </Card>
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>残高</CardTitle>
                </CardHeader>
                <CardContent>
                  ¥{selectedDate?.balance.toLocaleString()}
                </CardContent>
              </Card>
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
                        金額
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
      </div>
    </div>
  );
}
