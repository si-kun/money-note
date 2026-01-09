import { Card, CardContent } from "@/components/ui/card";
import { SelectedData } from "../page";

interface BreakdownList {
  selectedDate: SelectedData | null;
}

const BreakdownList = ({ selectedDate }: BreakdownList) => {
  return (
    <div className="flex flex-col h-full max-h-full flex-1 gap-3 py-1 overflow-y-auto">
      {selectedDate?.incomes?.map((income) => (
        <Card className="bg-blue-200" key={income.id}>
          <CardContent className="flex">
            <span className="w-[30%]">{income.category.name}</span>
            <span className="w-[40%]">{income.title || ""}</span>
            <span className="ml-auto">¥{income.amount.toLocaleString()}</span>
          </CardContent>
        </Card>
      ))}

      {selectedDate?.payments?.map((payment) => (
        <Card className="bg-red-200" key={payment.id}>
          <CardContent className="flex">
            <span className="w-[30%]">{payment.category.name}</span>
            <span className="w-[40%]">{payment.title || ""}</span>
            <span className="ml-auto">¥{payment.amount.toLocaleString()}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BreakdownList;
