import { SubscriptionResponse } from "@/app/server-aciton/balance/getSubscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubscriptionCardProps {
    monthlySubscription:SubscriptionResponse
}

const SubscriptionCard = ({monthlySubscription}:SubscriptionCardProps) => {
  return (
    <Card className="basis-1/2">
    <CardHeader>
      <CardTitle>サブスク</CardTitle>
    </CardHeader>
    <CardContent className="flex gap-4">
      <span>
        登録数:{monthlySubscription.subscription.length}
      </span>
      <span>
        合計金額:¥
        {monthlySubscription.totalAmount.toLocaleString()}
      </span>
    </CardContent>
  </Card>
  )
}

export default SubscriptionCard