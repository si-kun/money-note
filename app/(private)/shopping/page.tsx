// import { getShoppingCart } from "@/app/server-aciton/shopping/getShoppingCart";
// import { getShoppingHistory } from "@/app/server-aciton/shopping/getShoppingHistory";
// import { columns } from "./components/shoppingColumns";
// import ShoppingClient from "./components/shoppingClient";

// export default async function ShoppingPage() {
//   const cartResponse = await getShoppingCart();
//   const historyResponse = await getShoppingHistory();

//   const cartData = cartResponse?.data || [];
//   const historyData = historyResponse?.data || [];

//   return (
//     <div className="container mx-auto h-full">
//       <ShoppingClient
//         columns={columns}
//         cartData={cartData}
//         historyData={historyData}
//       />
//     </div>
//   );
// }

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