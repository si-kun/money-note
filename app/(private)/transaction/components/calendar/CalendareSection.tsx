"use client";

import "./calendar.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

import interractionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

import { useMemo } from "react";
import {
  BalanceData,
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/transaction/transaction";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import CalendarNavigation from "./CalendarNavigation";

interface CalendarSectionProps {
  initialYear: number;
  initialMonth: number;
  initialIncomeData: IncomeWithCategory[];
  initialPaymentData: PaymentWithCategory[];
  // today: Date;
}

const CalendareSection = ({
  initialIncomeData,
  initialPaymentData,
  initialYear,
  initialMonth,
}: //
CalendarSectionProps) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleDateClick = (arg: DateClickArg) => {
    const clickedDate = arg.dateStr;
    router.push(
      `/?year=${initialYear}&month=${initialMonth}&date=${clickedDate}`,
      { scroll: false }
    );
  };

  const handleEventClick = (arg: EventClickArg) => {
    const clickedDate = arg.event.startStr;
    router.push(
      `/?year=${initialYear}&month=${initialMonth}&date=${clickedDate}`,
      { scroll: false }
    );
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
      start: date,
      extendedProps: {
        income: data.income,
        payment: data.payment,
        balance: data.income - data.payment,
      },
    }));
    return result;
  }, [initialPaymentData, initialIncomeData]);

  return (
    <>
      <div className="w-full lg:h-full xl:w-[65%] h-[50%] space-y-4">
        <CalendarNavigation
          initialYear={initialYear}
          initialMonth={initialMonth}
        />
        <FullCalendar
          key={`${initialYear}-${initialMonth}-${isMobile}`}
          height={"auto"}
          locale={"ja"}
          plugins={[dayGridPlugin, interractionPlugin, listPlugin]}
          displayEventTime={false}
          initialView={isMobile ? "listMonth" : "dayGridMonth"}
          initialDate={new Date(initialYear, initialMonth - 1, 1)}
          dayCellClassNames={"cursor-pointer"}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={(eventInfo) => {
            const { income, payment, balance } = eventInfo.event.extendedProps;
            return (
              <div className="flex lg:flex-col justify-end text-sm text-right gap-3 lg:gap-1 pointer-events-none">
                <span className="text-green-500 whitespace-nowrap">
                  収入: ¥{income.toLocaleString()}
                </span>
                <span className="text-red-500 whitespace-nowrap">
                  支出: ¥{payment.toLocaleString()}
                </span>
                <span className="text-blue-500 whitespace-nowrap">
                  合計: ¥{balance.toLocaleString()}
                </span>
              </div>
            );
          }}
          headerToolbar={false}
        />
      </div>
    </>
  );
};

export default CalendareSection;
