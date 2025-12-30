import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getShoppingCart } from "@/app/server-aciton/shopping/getShoppingCart";
import { getShoppingHistory } from "@/app/server-aciton/shopping/getShoppingHistory";
import Link from "next/link";

export default async function ShoppingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cartResponse = await getShoppingCart();
  const historyResponse = await getShoppingHistory();

  const carts = cartResponse?.data || [];
  const histories = historyResponse?.data || [];

  return (
    <div className="flex w-full gap-6 h-full overflow-hidden">
      {/* 左側: カード/履歴リスト */}
      <div className="w-[30vw] flex flex-col h-full overflow-hidden">
        <Tabs defaultValue="cart" className="flex flex-col h-full ">
          <TabsList className="w-full shrink-0">
            <TabsTrigger value="cart" className="flex-1">
              カート
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              履歴
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="cart"
            className="mt-2 flex flex-col gap-4 flex-1 overflow-y-auto"
          >
            {carts.map((cart) => (
              <Link key={cart.id} href={`/shopping/cart/${cart.id}`}>
                <Card
                  key={cart.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                >
                  <CardHeader>
                    <CardTitle className="text-base">{cart.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {cart.items?.length || 0}件の商品がカートに入っています
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </TabsContent>

          <TabsContent
            value="history"
            className="mt-2 flex flex-col gap-4 flex-1 overflow-y-auto"
          >
            {histories.map((history) => (
              <Link key={history.id} href={`/shopping/history/${history.id}`}>
                <Card
                  key={history.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                >
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-base">{history.name}</CardTitle>
                    <span>{new Date(history.date).toLocaleDateString()}</span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {history.items?.length || 0}件の商品を購入しました
                    </p>
                    {history.totalPrice && (
                      <p className="text-sm font-semibold mt-1">
                        合計: ¥{history.totalPrice.toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* 右側: 選択されたアイテムのテーブル */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
