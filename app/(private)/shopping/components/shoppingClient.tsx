// "use client";

// import { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { columns } from "../cart/components/shoppingColumns";
// import AddCartDialog from "./AddCartDialog";
// import { ShoppingCartWithItems } from "@/app/server-aciton/shopping/cart/getShoppingCart";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { buyShoppingCart } from "@/app/server-aciton/shopping/cart/buyShoppingCart";
// import { toast } from "sonner";
// import { ShoppingCartItemTable } from "../cart/components/shoppingCartData-table";

// interface ShoppingClientProps {
//   cartData: ShoppingCartWithItems[];
//   historyData: any[];
// }

// export default function ShoppingClient({
//   cartData,
//   historyData,
// }: ShoppingClientProps) {
//   const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<"cart" | "history">("cart");

//   const carts = Array.isArray(cartData) ? cartData : [];
//   const histories = Array.isArray(historyData) ? historyData : [];

//   const router = useRouter();

//   const selectedItem = selectedItemId
//     ? (activeTab === "cart" ? cartData : historyData).find(
//         (item) => item.id === selectedItemId
//       )
//     : null;

//   const handleSelectItem = (id: string) => {
//     setSelectedItemId(id);
//   };

//   const handleAddHistory = async() => {
//     try {
//       const response = await buyShoppingCart(selectedItemId as string);
//       if(response.success) {
//         router.refresh();
//         toast.success("購入が完了しました");
//       } else {
//         toast.error("購入に失敗しました");
//       }
//     } catch(error) {
//       console.error("Error purchasing cart:", error);
//       toast.error("購入中にエラーが発生しました");
//     }
//   }

//   console.log(selectedItem)

//   return (
//     <div className="flex w-full gap-6 h-full overflow-hidden">
//       {/* 左側: カード/履歴リスト */}
//       <div className="w-[30vw] flex flex-col h-full overflow-hidden">
//         <Tabs
//           value={activeTab}
//           onValueChange={(v) => setActiveTab(v as "cart" | "history")}
//           className="flex flex-col h-full "
//         >
//           <TabsList className="w-full shrink-0">
//             <TabsTrigger value="cart" className="flex-1">
//               カート
//             </TabsTrigger>
//             <TabsTrigger value="history" className="flex-1">
//               履歴
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent
//             value="cart"
//             className="mt-2 flex flex-col gap-4 flex-1 overflow-y-auto"
//           >
//             {carts.map((cart) => (
//               <Card
//                 key={cart.id}
//                 className="cursor-pointer hover:bg-accent transition-colors"
//                 onClick={() => handleSelectItem(cart.id)}
//               >
//                 <CardHeader>
//                   <CardTitle className="text-base">{cart.id}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-sm text-muted-foreground">
//                     {cart.items?.length || 0}件の商品がカートに入っています
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </TabsContent>

//           <TabsContent
//             value="history"
//             className="mt-2 flex flex-col gap-4 flex-1 overflow-y-auto"
//           >
//             {histories.map((history) => (
//               <Card
//                 key={history.id}
//                 className="cursor-pointer hover:bg-accent transition-colors"
//                 onClick={() => handleSelectItem(history.id)}
//               >
//                 <CardHeader>
//                   <CardTitle className="text-base">
//                     {history.date
//                       ? new Date(history.date).toLocaleDateString()
//                       : "日付不明"}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-sm text-muted-foreground">
//                     {history.items?.length || 0}件の商品を購入しました
//                   </p>
//                   {history.totalPrice && (
//                     <p className="text-sm font-semibold mt-1">
//                       合計: ¥{history.totalPrice.toLocaleString()}
//                     </p>
//                   )}
//                 </CardContent>
//               </Card>
//             ))}
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* 右側: 選択されたアイテムのテーブル */}
//       <div className="flex-1">
//         {selectedItem ? (
//           activeTab === "cart" ? (
//             <Card>
//               <CardHeader className="flex items-start justify-between">
//                 <div className="flex flex-col gap-2">
//                   <CardTitle>
//                     {activeTab === "cart"
//                       ? selectedItem.id
//                       : new Date(selectedItem.date).toLocaleDateString()}
//                   </CardTitle>
//                   <p className="text-sm text-muted-foreground">
//                     {selectedItem.items?.length || 0}件のアイテム
//                   </p>
//                 </div>
//                 <AddCartDialog />
//               </CardHeader>
//               <CardContent className="flex flex-col gap-4">
//                 <ShoppingCartItemTable
//                   items={selectedItem.items || []}
//                   columns={columns}
//                 />
//                 <Button
//                   disabled={
//                     selectedItem.items?.filter((item) => item.checked)
//                       .length === 0
//                   }
//                   type="button"
//                   className="ml-auto bg-green-500 hover:bg-green-400 disabled:bg-slate-400"
//                   variant={"secondary"}
//                   onClick={handleAddHistory}
//                 >
//                   選択中のアイテムを購入
//                 </Button>
//               </CardContent>
//             </Card>
//           ) : (
//             <Card>
//               <CardHeader>
//                 <CardTitle>
//                   {activeTab === "history" &&
//                     new Date(selectedItem.date).toLocaleDateString()}
//                 </CardTitle>
//                 <p className="text-sm text-muted-foreground">
//                   {selectedItem.items?.length || 0}件のアイテム
//                 </p>
//               </CardHeader>
//               <CardContent className="flex flex-col gap-4">
//                 <ShoppingCartItemTable
//                   items={selectedItem.items || []}
//                   columns={columns}
//                 />
//                 <span className="font-semibold ml-auto">合計金額：¥{selectedItem.totalPrice.toLocaleString()}</span>
//               </CardContent>
//             </Card>
//           )
//         ) : (
//           <Card>
//             <CardContent className="flex items-center justify-center h-[400px]">
//               <p className="text-muted-foreground">
//                 {activeTab === "cart" ? "カート" : "履歴"}を選択してください
//               </p>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }
