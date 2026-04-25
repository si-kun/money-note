"use client"

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CalendarNavigationProps {
  initialYear: number;
  initialMonth: number;
}

const CalendarNavigation = ({initialMonth,initialYear}: CalendarNavigationProps) => {
  const router = useRouter();

  const handlePrevMonth = () => {
    const newMonth = initialMonth === 1 ? 12 : initialMonth - 1;
    const newYear = initialMonth === 1 ? initialYear - 1 : initialYear;

    const url = `/?year=${newYear}&month=${newMonth}`;

    router.push(url);
  };

  const handleNextMonth = () => {
    const newMonth = initialMonth === 12 ? 1 : initialMonth + 1;
    const newYear = initialMonth === 12 ? initialYear + 1 : initialYear;

    const url = `/?year=${newYear}&month=${newMonth}`;

    router.push(url);
  };

  return (
    <div className="flex items-center justify-between">
      <Button type="button" variant={"outline"} onClick={handlePrevMonth}>
        <ArrowLeft />
        Prev
      </Button>
      <h2 className="text-base md:text-xl font-bold">
        {initialYear}年{initialMonth}月収支カレンダー
      </h2>
      <Button type="button" variant={"outline"} onClick={handleNextMonth}>
        Next
        <ArrowRight />
      </Button>
    </div>
  );
};

export default CalendarNavigation