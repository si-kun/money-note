import { getShoppingCart } from "@/app/server-aciton/shopping/cart/getShoppingCart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateCart from "../../@detail/cart/components/CreateCart";
import DeleteDialog from "../../components/DeleteDialog";
import Link from "next/link";

const CartListPage = async () => {
  // cartのリストを取得
  const fetchCartList = await getShoppingCart();

  return (
    <div
      className="mt-2 flex flex-col gap-4 flex-1 overflow-y-auto"
    >
      <CreateCart />
      {fetchCartList.data.map((cart) => (
        <Link key={cart.id} href={`/shopping/cart/${cart.id}`}>
          <Card
            key={cart.id}
            className="cursor-pointer hover:bg-accent transition-colors"
          >
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-base">{cart.name}</CardTitle>
              <DeleteDialog name={cart.name} id={cart.id} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {cart.items?.length || 0}件の商品がカートに入っています
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CartListPage;
