"use client";

import "./calendar.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import interractionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

import { Button } from "@/components/ui/button";
import { useMemo, useRef, useState } from "react";
import {
  BalanceData,
  IncomeWithCategory,
  PaymentWithCategory,
  SelectedData,
} from "@/app/types/balance/balance";
import { useRouter } from "next/navigation";

interface CalendarSectionProps {
  initialYear: number;
  initialMonth: number;
  initialIncomeData: IncomeWithCategory[];
  initialPaymentData: PaymentWithCategory[];
  today: Date;
  
}

const CalendareSection = ({
  initialIncomeData,
  initialPaymentData,
  initialYear,
  initialMonth,
  today,
}: CalendarSectionProps) => {
  const router = useRouter();

  // const [selectedDate, setSelectedDate] = useState<SelectedData>({
  //   date: format(today, "yyyy-MM-dd"),
  //   incomes: [],
  //   payments: [],
  //   totalIncome: 0,
  //   totalPayment: 0,
  //   balance: 0,
  // });

  const calendarRef = useRef<FullCalendar>(null);

  const handlePrevMonth = () => {
    const newMonth = initialMonth === 1 ? 12 : initialMonth - 1;
    const newYear = initialMonth === 1 ? initialYear - 1 : initialYear;

    const url = `/?year=${newYear}&month=${newMonth}`;

    router.push(url);
    calendarRef.current?.getApi().prev();
  };

  const handleNextMonth = () => {
    const newMonth = initialMonth === 12 ? 1 : initialMonth + 1;
    const newYear = initialMonth === 12 ? initialYear + 1 : initialYear;

    const url = `/?year=${newYear}&month=${newMonth}`;

    router.push(url);
    calendarRef.current?.getApi().next();
  }

  const handleSelectedDate = (clickedDate: string) => {
    const selectedIncomes = initialIncomeData.filter((income) => {
      return income.incomeDate.toISOString().split("T")[0] === clickedDate;
    });

    const selectedPayments = initialPaymentData.filter((payment) => {
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
    // setSelectedDate({
    //   date: clickedDate,
    //   incomes: selectedIncomes,
    //   payments: selectedPayments,
    //   totalIncome,
    //   totalPayment,
    //   balance: totalIncome - totalPayment,
    // });
  };

  const handleDateClick = (arg: DateClickArg) => {
    const clickedDate = arg.dateStr
    router.push(`/?year=${initialYear}&month=${initialMonth}&date=${clickedDate}`)
  };

  const handleEventClick = (arg: EventClickArg) => {
    const clickedDate = arg.event.startStr
    router.push(`/?year=${initialYear}&month=${initialMonth}&date=${clickedDate}`)
  };
  const events = useMemo(() => {
    const tempBalanceData: BalanceData = {};

    initialPaymentData.forEach((payment) => {
      const datekey = payment.paymentDate.toISOString().split("T")[0];
      if (!tempBalanceData[datekey]) {
        tempBalanceData[datekey] = { income: 0, payment: 0, balance: 0 };
      }
      tempBalanceData[datekey].payment += payment.amount;
    });

    initialIncomeData.forEach((income) => {
      const datekey = income.incomeDate.toISOString().split("T")[0];
      if (!tempBalanceData[datekey]) {
        tempBalanceData[datekey] = { income: 0, payment: 0, balance: 0 };
      }
      tempBalanceData[datekey].income += income.amount;
    });

    // イベント配列を生成
    const result = Object.entries(tempBalanceData).map(([date, data]) => ({
      start:date,
      extendedProps: {
        income: data.income,
        payment: data.payment,
        balance: data.income - data.payment,
      },
    }));
    return result
  }, [initialPaymentData, initialIncomeData]);

  return (
    <div className="w-[65%] space-y-4">
      <div className="flex items-center justify-between">
        <Button onClick={handlePrevMonth}>Prev</Button>
        <h2 className="text-xl font-bold">
          {initialYear}年{initialMonth}月収支カレンダー
        </h2>
        <Button onClick={handleNextMonth}>Next</Button>
      </div>
      <FullCalendar
        ref={calendarRef}
        locale={"ja"}
        plugins={[dayGridPlugin, interractionPlugin]}
        initialView="dayGridMonth"
        initialDate={new Date(initialYear, initialMonth - 1,1)}
        dayCellClassNames={"cursor-pointer"}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={(eventInfo) => {
          const { income, payment, balance } = eventInfo.event.extendedProps;
          return (
            <div className="flex flex-col text-sm text-right gap-1 pointer-events-none">
              <span className="text-green-500">
                収入: ¥{income.toLocaleString()}
              </span>
              <span className="text-red-500">
                支出: ¥{payment.toLocaleString()}
              </span>
              <span className="text-blue-500">
                合計: ¥{balance.toLocaleString()}
              </span>
            </div>
          );
        }}
        headerToolbar={false}
      />
    </div>
  );
};

export default CalendareSection;
