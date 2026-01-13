import { Card, CardContent } from "@/components/ui/card";

const ShoppingPage = () => {
  return (
    <Card className="h-full">
    <CardContent className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">
        カートまたは履歴を選択してください
      </p>
    </CardContent>
  </Card>
  )
}

export default ShoppingPage