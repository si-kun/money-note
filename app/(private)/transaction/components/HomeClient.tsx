"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BalanceCalendar from "@/components/calendar/Calendar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBalanceData } from "@/hooks/balance/useBalanceData";
import Summary from "./Summary";
import SummaryCard from "./SummaryCard";
import SubscriptionCard from "../../subscriptions/components/SubscriptionCard";
import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/balance/balance";

interface HomeClientProps {
  initialIncomeData: IncomeWithCategory[];
  initialPaymentData: PaymentWithCategory[];
  initialYear: number;
  initialMonth: number;
  incomeError: string | null;
  paymentError: string | null;
}

const HomeClient = ({
  initialIncomeData,
  initialPaymentData,
  initialYear,
  initialMonth,
  incomeError,
  paymentError,
}: HomeClientProps) => {
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
  } = useBalanceData({
    initialIncomeData,
    initialPaymentData,
    initialYear,
    initialMonth,
  });

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
                  <SummaryCard
                    title={"収入"}
                    errorText={incomeError}
                    amount={monthlyIncomeTotal}
                  />
                  <SummaryCard
                    title={"支出"}
                    errorText={paymentError}
                    amount={monthlyPaymentTotal}
                  />
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
};

export default HomeClient;
