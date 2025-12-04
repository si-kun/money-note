import "./calendar.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import interractionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

import { Button } from "@/components/ui/button";
import { EventData } from "@/app/(private)/page";
import { RefObject } from "react";

interface CalendarProps {
  year: number;
  month: number;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleDateClick: (arg: DateClickArg) => void;
  handleEventClick: (arg: EventClickArg) => void;
  events: EventData[];
  calendarRef: RefObject<FullCalendar | null>
}

const BalanceCalendar = ({ year, month,handleNextMonth,handlePrevMonth,handleDateClick,handleEventClick,events,calendarRef, }: CalendarProps) => {
  return (
    <div className="w-[65%] space-y-4">
      <div className="flex items-center justify-between">
        <Button onClick={handlePrevMonth}>Prev</Button>
        <h2 className="text-xl font-bold">
          {year}年{month}月収支カレンダー
        </h2>
        <Button onClick={handleNextMonth}>Next</Button>
      </div>
      <FullCalendar
        ref={calendarRef}
        locale={"ja"}
        plugins={[dayGridPlugin, interractionPlugin]}
        initialView="dayGridMonth"
        dayCellClassNames={"cursor-pointer"}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={(eventInfo) => {
          const { income, payment, balance } = eventInfo.event.extendedProps;
          return (
            <div className="flex flex-col text-sm text-right gap-1 pointer-events-none">
              <span className="text-green-500">収入: ¥{income.toLocaleString()}</span>
              <span className="text-red-500">支出: ¥{payment.toLocaleString()}</span>
              <span className="text-blue-500">合計: ¥{balance.toLocaleString()}</span>
            </div>
          );
        }}
        headerToolbar={false}
      />
    </div>
  );
};

export default BalanceCalendar;
