import { getShoppingCart } from "@/app/server-aciton/shopping/cart/getShoppingCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddCartDialog from "../../components/AddCartDialog";
import { ShoppingItemTable } from "../../components/shoppingData-table";
import { columns } from "../../components/shoppingColumns";
import BuyButton from "../../components/BuyButton";

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

  if (!selectedCart) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">カートが見つかりません</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="h-full">
      <CardHeader className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>{selectedCart.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectedCart.items?.length || 0}件のアイテム
          </p>
        </div>
        <AddCartDialog />
      </CardHeader>
      <CardContent className="overflow-y-auto">
        <ShoppingItemTable items={selectedCart.items || []} columns={columns} />
        <BuyButton selectedCart={selectedCart} />
      </CardContent>
    </Card>
  );
};

export default ShoppingDetailPage;
