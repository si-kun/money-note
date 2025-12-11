"use client";

import FullCalendar from "@fullcalendar/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect, useRef, useState } from "react";
import { getIncome } from "../server-aciton/balance/getIncome";
import { getPayment } from "../server-aciton/balance/getPayment";
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import BalanceCalendar from "@/components/calendar/Calendar";
import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "../types/balance/balance";
import {
  getSubscription,
  SubscriptionResponse,
} from "../server-aciton/balance/getSubscription";
import Summary from "./components/Summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCard from "./components/SummaryCard";
import SubscriptionCard from "./components/subscription/SubscriptionCard";

type BalanceData = Record<
  string,
  {
    income: number;
    payment: number;
    balance: number;
  }
>;

export interface SelectedData {
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
  const [date, setDate] = useState<Date>(new Date());

  const [incomeData, setIncomeData] = useState<IncomeWithCategory[]>([]);
  const [monthlyIncomeTotal, setMonthlyIncomeTotal] = useState<number>(0);
  const [paymentData, setPaymentData] = useState<PaymentWithCategory[]>([]);
  const [monthlyPaymentTotal, setMonthlyPaymentTotal] = useState<number>(0);
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [monthlySubscription, setMonthlySubscription] =
    useState<SubscriptionResponse>({
      subscription: [],
      totalAmount: 0,
    });
  const [events, setEvents] = useState<EventData[]>([]);

  // 日付
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);

  // ダイアログの開閉フラグ
  const [isOpen, setIsOpen] = useState(false);

  const todayKey = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<SelectedData>({
    date: "",
    incomes: [],
    payments: [],
    totalIncome: 0,
    totalPayment: 0,
    balance: 0,
  });

  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    console.log("isOpen:", isOpen);
  }, [isOpen]);

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
          setMonthlyPaymentTotal(() => {
            return paymentResult.data.reduce(
              (acc, payment) => acc + payment.amount,
              0
            );
          });
          // 支出データの処理
          incomeResult.data.forEach((income) => {
            const datekey = income.incomeDate.toISOString().split("T")[0];
            if (!tempBalanceData[datekey]) {
              tempBalanceData[datekey] = { income: 0, payment: 0, balance: 0 };
            }
            tempBalanceData[datekey].income += income.amount;
          });
          setMonthlyIncomeTotal(() => {
            return incomeResult.data.reduce(
              (acc, income) => acc + income.amount,
              0
            );
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

  // 月ごとのサブスクを取得
  const fetchMonthlySubscriptions = async () => {
    try {
      const result = await getSubscription({ year, month });

      if (result.success) {
        setMonthlySubscription(result.data);
      }
    } catch (error) {
      console.error("Error fetching monthly subscriptions:", error);
    }
  };
  useEffect(() => {
    fetchMonthlySubscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, year, month]);

  useEffect(() => {
    const handleUpdate = () => {
      fetchMonthlySubscriptions();
    };

    window.addEventListener("subscriptionUpdated", handleUpdate);

    return () => {
      window.removeEventListener("subscriptionUpdated", handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

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
    });

    const selectedPayments = paymentData.filter((payment) => {
      return payment.paymentDate.toISOString().split("T")[0] === clickedDate;
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
  };

  const handleEventClick = (arg: EventClickArg) => {
    handleSelectedDate(arg.event.startStr);
  };

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
      <Tabs defaultValue="day" className="flex-1">
        <TabsList>
          <TabsTrigger value="day">日次</TabsTrigger>
          <TabsTrigger value="month">月次</TabsTrigger>
        </TabsList>
        <TabsContent value="day">
          <Summary
            selectedDate={selectedDate}
            date={date}
            setDate={setDate}
            open={open}
            setOpen={setOpen}
          />
        </TabsContent>
        <TabsContent value="month">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {year}年{month}月
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4 overflow-y-auto">
              {/* 収入、支出、残高のカード */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between gap-4">
                  <SummaryCard title={"収入"} amount={monthlyIncomeTotal} />
                  <SummaryCard title={"支出"} amount={monthlyPaymentTotal} />
                </div>
                <SubscriptionCard
                  monthlySubscription={monthlySubscription}
                  year={year}
                  month={month}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
                <SummaryCard
                  title={"残高"}
                  amount={
                    monthlyIncomeTotal -
                    monthlyPaymentTotal -
                    monthlySubscription.totalAmount
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
