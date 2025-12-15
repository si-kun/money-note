import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ControllerRenderProps } from "react-hook-form";

interface CalendarFieldProps {
  formField: {
    label: string;
    type: string;
    name: string;
  };
  field: ControllerRenderProps<
    {
      name: string;
      monthlyPrice: number;
      startDate: Date;
      endDate?: Date | null | undefined;
    },
     "name" | "startDate" | "endDate" | "monthlyPrice"
  >;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CalendarField = ({ formField,field, open, setOpen }: CalendarFieldProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {formField.label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {field.value &&
            field.value instanceof Date &&
            !isNaN(field.value.getTime())
              ? format(field.value, "yyyy/MM/dd")
              : "日付を選択"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value instanceof Date ? field.value : undefined}
            captionLayout="dropdown"
            onSelect={(date) => {
              field.onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CalendarField;
