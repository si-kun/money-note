import { getIncome } from "@/app/server-aciton/balance/getIncome";
import { getPayment } from "@/app/server-aciton/balance/getPayment";
import {
  getSubscription,
  SubscriptionResponse,
} from "@/app/server-aciton/balance/getSubscription";
import {
  BalanceData,
  EventData,
  IncomeWithCategory,
  PaymentWithCategory,
  SelectedData,
} from "@/app/types/balance/balance";
import { DateClickArg } from "@fullcalendar/interaction/index.js";
import { EventClickArg } from "@fullcalendar/core";

import FullCalendar from "@fullcalendar/react";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

interface UseBalanceDataProps {
  initialIncomeData: IncomeWithCategory[];
  initialPaymentData: PaymentWithCategory[];
  initialYear: number;
  initialMonth: number;
}

export const useBalanceData = ({
  initialIncomeData,
  initialPaymentData,
  initialYear,
  initialMonth,
}: UseBalanceDataProps) => {
  const [incomeData, setIncomeData] =
    useState<IncomeWithCategory[]>(initialIncomeData);
  const [monthlyIncomeTotal, setMonthlyIncomeTotal] = useState<number>(0);
  const [paymentData, setPaymentData] =
    useState<PaymentWithCategory[]>(initialPaymentData);
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
  const [year, setYear] = useState<number>(initialYear);
  const [month, setMonth] = useState<number>(initialMonth);

  // ダイアログの開閉フラグ
  const [isOpen, setIsOpen] = useState(false);

  const todayKey = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<SelectedData>({
    date: format(today, "yyyy-MM-dd"),
    incomes: [],
    payments: [],
    totalIncome: 0,
    totalPayment: 0,
    balance: 0,
  });

  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    fetchBalanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIncomeData, initialPaymentData]);

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
          return payment.paymentDate.toISOString().split("T")[0] === targetDate;
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

  // yearとmonthが変わるたびにデータを取得
  useEffect(() => {
    fetchBalanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  useEffect(() => {
    if (!balanceData) return;
    const newEvents = Object.entries(balanceData).map(([date, data]) => ({
      title: date,
      start: date,
      allDay: true,
      extendedProps: {
        income: data.income,
        payment: data.payment,
        balance: data.balance,
      },
    }));
    setEvents(newEvents);
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

  // サブスクリプション更新時
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

  return {
    incomeData,
    monthlyIncomeTotal,
    paymentData,
    monthlyPaymentTotal,
    balanceData,
    monthlySubscription,
    events,
    year,
    month,
    isOpen,
    setIsOpen,
    selectedDate,
    calendarRef,
    handlePrevMonth,
    handleNextMonth,
    handleDateClick,
    handleEventClick,
  };
};
