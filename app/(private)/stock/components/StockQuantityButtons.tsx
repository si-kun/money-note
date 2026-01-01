"use client";

import { quantityIncrement } from "@/app/server-aciton/stock/quantityIncrement";
import { Button } from "@/components/ui/button";
import { Stock } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

interface StockQuantityButtons {
  row: Stock;
}

const StockQuantityButtons = ({ row }: StockQuantityButtons) => {
  const [displayQuantity, setDisplayQuantity] = useState(row.quantity);
  const isFirstRender = useRef(true);
  const previousQuantity = useRef(row.quantity);
  const stockId = useRef(row.id);

  useEffect(() => {
    if(previousQuantity.current !== row.quantity) {
      setDisplayQuantity(row.quantity);
      previousQuantity.current = row.quantity;
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  },[row.quantity])

  useEffect(() => {
    // 初回レンダリング時はスキップ
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if(displayQuantity === row.quantity) return;

    const timer = setTimeout(async () => {
      try {
        await quantityIncrement(stockId.current, displayQuantity);
      } catch (error) {
        console.error("Error updating quantity display:", error);
      }
      console.log("Quantity updated to:", row.quantity);
    }, 500);

    return () => clearTimeout(timer);
  }, [displayQuantity, row.quantity]);

  const handleIncrement = () => {
    setDisplayQuantity((prev) => prev + 1);
  };
  const handleDecrement = () => {
    if(displayQuantity <= 0) return;
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
        <Button disabled={displayQuantity <= 0} onClick={handleDecrement} variant={"outline"} size={"icon-sm"}>
          -
        </Button>
      </div>
    </div>
  );
};

export default StockQuantityButtons;
