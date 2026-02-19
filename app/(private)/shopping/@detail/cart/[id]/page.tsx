import { getShoppingCart } from "@/app/server-aciton/shopping/cart/getShoppingCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BuyButton from "../../../components/BuyButton";
import LowStockTable from "../components/LowStockTable";
import NomalCartTable from "../components/NomalCartTable";

interface CartDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ShoppingDetailPage = async ({ params }: CartDetailPageProps) => {
  const { id } = await params;

  const cartResponse = await getShoppingCart();
  const carts = cartResponse?.data || [];

  const selectedCart = carts.find((cart) => cart.id === id);

  const availableCarts = carts.filter((cart) => cart.name !== "在庫不足");

  if (!selectedCart) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">カートが見つかりません</p>
        </CardContent>
      </Card>
    );
  }

  // 今表示しているカートが「在庫不足」かどうか判定
  const isLowStockCart = selectedCart.name === "在庫不足";

  return (
    <Card className="h-full">
      <CardHeader className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>{selectedCart.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectedCart.items?.length || 0}件のアイテム
          </p>
        </div>
        {!isLowStockCart && (
          <Link href={"/stock"}>
            <Button variant={"secondary"}>商品を追加</Button>
          </Link>
        )}
      </CardHeader>
      <CardContent className="overflow-y-auto">
        {isLowStockCart ? (
          <LowStockTable
            items={selectedCart.items || []}
            availableCarts={availableCarts}
          />
        ) : (
          <NomalCartTable items={selectedCart.items || []} />
        )}
        {/* 「在庫不足」カートでは非表示 */}
        {!isLowStockCart && <BuyButton selectedCart={selectedCart} />}
      </CardContent>
    </Card>
  );
};

export default ShoppingDetailPage;
