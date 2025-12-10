import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryCardProps {
    title: string;
    amount: number;
}

const SummaryCard = ({title,amount}:SummaryCardProps) => {
  return (
    <Card className="basis-1/2">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      ¥{amount.toLocaleString()}
    </CardContent>
  </Card>
  )
}

export default SummaryCard