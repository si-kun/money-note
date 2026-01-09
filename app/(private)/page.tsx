"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BalanceCalendar from "@/components/calendar/Calendar";

import Summary from "./components/Summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCard from "./components/SummaryCard";
import SubscriptionCard from "./subscriptions/components/SubscriptionCard";
import { useBalanceData } from "@/hooks/useBalanceData";

export default function Home() {
  const {
    year,
    month,
    events,
    calendarRef,
    selectedDate,
    monthlyIncomeTotal,
    monthlyPaymentTotal,
    monthlySubscription,
    isOpen,
    setIsOpen,
    handlePrevMonth,
    handleNextMonth,
    handleDateClick,
    handleEventClick,
  } = useBalanceData();

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
      <Tabs defaultValue="day" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="day">日次</TabsTrigger>
          <TabsTrigger value="month">月次</TabsTrigger>
        </TabsList>
        <TabsContent value="day" className="flex-1 overflow-hidden">
          <Summary selectedDate={selectedDate} />
        </TabsContent>
        <TabsContent value="month" className="flex-1 overflow-hidden">
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
