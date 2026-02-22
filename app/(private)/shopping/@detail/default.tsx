import { Card, CardContent } from "@/components/ui/card";

export default function DetailDefault() {
  return (
    <Card className="h-full">
      <CardContent className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">カートを選択してください</p>
      </CardContent>
    </Card>
  );
}