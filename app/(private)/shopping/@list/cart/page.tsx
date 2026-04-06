import { getShoppingCart } from "@/app/server-action/shopping/cart/getShoppingCart";

import CreateCart from "../../@detail/cart/components/CreateCart";
import CartList from "../../components/CartList";

export const dynamic = 'force-dynamic'

const CartListPage = async () => {
  // cartのリストを取得
  const fetchCartList = await getShoppingCart();

  return (
    <div className="mt-2 flex flex-col gap-4 flex-1 overflow-y-auto">
      <CreateCart />
      {fetchCartList.data.map((cart) => (
        <CartList key={cart.id} cart={cart} carts={fetchCartList.data} />
      ))}
    </div>
  );
};

export default CartListPage;
