import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const CartPage = () => {
  return (
    <Card className="h-full">
      <CardContent className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">カートを選択してください</p>
      </CardContent>
    </Card>
  );
};

export default CartPage;
