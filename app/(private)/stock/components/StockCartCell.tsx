import { ShoppingCartWithItems } from "@/app/types/shopping/shopping";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MobileCartSheet from "../../shopping/@detail/cart/components/MobileCartSheet";

interface StockCartCellProps {
  cartWithStock: ShoppingCartWithItems;
  carts: ShoppingCartWithItems[];
}

const StockCartCell = ({ cartWithStock, carts }: StockCartCellProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  const router = useRouter();

  const handleClickLink = () => {
    if (isMobile) {
      return setIsSheetOpen(true);
    } else {
      router.push(`/shopping/cart/${cartWithStock.id}`);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={"ghost"}
        onClick={handleClickLink}
        className="text-blue-600 hover:underline font-medium"
      >
        {cartWithStock.name}
      </Button>

      <MobileCartSheet
        isSheetOpen={isSheetOpen && isMobile}
        setIsSheetOpen={setIsSheetOpen}
        cart={cartWithStock}
        carts={carts}
      />
    </>
  );
};

export default StockCartCell;
