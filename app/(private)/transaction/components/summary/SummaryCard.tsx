import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

interface SummaryCardProps {
  title: string;
  amount: number;
  errorText?: string | null;
}

const SummaryCard = ({ title, amount, errorText }: SummaryCardProps) => {
  return (
    <Card className="basis-1/2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {errorText ? (
          <span className="text-red-500 flex items-center gap-2 text-sm font-semibold">
            <ShieldAlert />
            {errorText}
          </span>
        ) : (
          `¥${amount}`
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
