"use client";

import { ShoppingHistoryWithItems } from "@/app/types/shopping/shopping";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import MobileHistorySheet from "./MobileHistorySheet";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef, useState } from "react";

interface HistoryListProps {
  history: ShoppingHistoryWithItems;
  year: number;
  month: number;
}

const HistoryList = ({ history, year, month }: HistoryListProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const prevIsMobileRef = useRef<boolean | undefined>(undefined);

  const router = useRouter();

  const isMobile = useIsMobile();

const handleClickLink = () => {
  if (isMobile) {
    setIsSheetOpen(true);
  } else {
    router.push(`/shopping/history/${history.id}`);
  }
};

useEffect(() => {
  if (prevIsMobileRef.current === false && isMobile === true) {
    // PCからモバイルに変わったときだけ実行
    if (year && month) {
      router.push(`/shopping/history?year=${year}&month=${month}`);
    } else {
      router.push(`/shopping/history`);
    }
  }
  prevIsMobileRef.current = isMobile;
}, [isMobile]);

  return (
    <>
      <Card
        key={history.id}
        className="cursor-pointer hover:bg-accent transition-colors"
        onClick={handleClickLink}
      >
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base">{history.name}</CardTitle>
          <span>{format(new Date(history.date), "yyyy/MM/dd")}</span>
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

      <MobileHistorySheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        history={history}
      />
    </>
  );
};

export default HistoryList;
