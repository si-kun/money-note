"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface HistorydateSelectProps {
    initialYear: number;
    initialMonth: number;
}

const HistorydateSelect = ({initialYear,initialMonth}:HistorydateSelectProps) => {
  const router = useRouter();

  const displayYears = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );
  const displayMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleYearChange = (newYear: string) => {
    router.push(`/shopping/history?year=${newYear}&month=${initialMonth}`);
  }
  const handleMonthChange = (newMonth: string) => {
    router.push(`/shopping/history?year=${initialYear}&month=${newMonth}`);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">表示する年月を指定:</span>
      <Select
        value={String(initialYear)}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="年" />
        </SelectTrigger>
        <SelectContent>
          {displayYears.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(initialMonth)}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="月" />
        </SelectTrigger>
        <SelectContent>
          {displayMonths.map((month) => (
            <SelectItem key={month} value={String(month)}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HistorydateSelect;
