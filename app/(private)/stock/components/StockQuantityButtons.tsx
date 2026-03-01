"use client";

import { updateStockQuantity } from "@/app/server-aciton/stock/updateStockQuantity";
import { Button } from "@/components/ui/button";
import { Stock } from "@/generated/prisma/client";
import { useEffect, useRef, useState } from "react";

interface StockQuantityButtons {
  row: Stock;
}

const StockQuantityButtons = ({ row }: StockQuantityButtons) => {
  const [displayQuantity, setDisplayQuantity] = useState<number>(row.quantity);
  const isFirstRender = useRef(true);
  const previousQuantity = useRef(row.quantity);
  const stockId = useRef(row.id);

  useEffect(() => {
    if (previousQuantity.current !== row.quantity) {
      setDisplayQuantity(row.quantity);
      previousQuantity.current = row.quantity;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.quantity]);

  useEffect(() => {
    // 初回レンダリング時はスキップ
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (displayQuantity === row.quantity) return;

    const timer = setTimeout(async () => {
      try {
        await updateStockQuantity(stockId.current, displayQuantity);
      } catch (error) {
        console.error("Error updating quantity display:", error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [displayQuantity, row.quantity]);

  const handleIncrement = () => {
    setDisplayQuantity((prev) => prev + 1);
  };
  const handleDecrement = () => {
    if (displayQuantity <= 0) return;
    setDisplayQuantity((prev) => prev - 1);
  };

  return (
    <div className="flex items-center gap-4">
      <div>
        {displayQuantity}
        {row.unit}
      </div>
      <div>
        <Button onClick={handleIncrement} variant={"outline"} size={"icon-sm"}>
          +
        </Button>
        <Button
          disabled={displayQuantity <= 0}
          onClick={handleDecrement}
          variant={"outline"}
          size={"icon-sm"}
        >
          -
        </Button>
      </div>
    </div>
  );
};

export default StockQuantityButtons;
