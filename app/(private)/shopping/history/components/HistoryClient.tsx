"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getShoppingHistory,
  ShoppingHistoryWithItems,
} from "@/app/server-aciton/shopping/history/getShoppingHistory";

const HistoryClient = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const displayYears = Array.from({ length: 5 }).map(
    (_, index) => today.getFullYear() - index
  );
  const displayMonths = Array.from({ length: 12 }).map((_, index) => index + 1);

  const [histories, setHistories] = useState<ShoppingHistoryWithItems[]>([]);

  console.log("Selected year:", year);
  console.log("Selected month:", month);

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const response = await getShoppingHistory({ year, month });

        if (response.success) {
          setHistories(response.data);
        }
      } catch (error) {
        console.error("Error fetching shopping history:", error);
      }
    };
    fetchHistories();
  }, [year, month]);

  return (
    <TabsContent
      value="history"
      className="mt-2 flex flex-col gap-4 flex-1 overflow-y-auto"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">表示する年月を指定:</span>
        <Select
          value={String(year)}
          onValueChange={(value) => setYear(Number(value))}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="年" />
          </SelectTrigger>
          <SelectContent>
            {displayYears.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={String(month)}
          onValueChange={(value) => setMonth(Number(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="月" />
          </SelectTrigger>
          <SelectContent>
            {displayMonths.map((month) => (
              <SelectItem key={month} value={String(month)}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
  );
};

export default HistoryClient;
