import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import BreakdownHeader from "./BreakdownHeader";
import BreakdownList from "../form/BreakdownList";
import { Category } from "@/generated/prisma/client";
import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/transaction/transaction";

interface MobileBreakdownSheetProps {
  openDate: string | null;
  handleCloseSheet: () => void;
  date: string;
  dailyIncome: IncomeWithCategory[];
  dailyPayment: PaymentWithCategory[];
  categories: Category[];
}

const MobileBreakdownSheet = ({
  openDate,
  handleCloseSheet,
  date,
  dailyIncome,
  dailyPayment,
  categories,
}: MobileBreakdownSheetProps) => {
  return (
    <Sheet open={!!openDate} onOpenChange={handleCloseSheet}>
      <SheetContent side="bottom" className="h-[80vh] px-4">
        <SheetHeader className="px-0">
          <SheetTitle>{date}</SheetTitle>
          <SheetDescription>収入・支出の内訳を確認できます</SheetDescription>
        </SheetHeader>
        <BreakdownHeader date={date} categories={categories} />
        <BreakdownList
          date={date}
          dailyIncome={dailyIncome}
          dailyPayment={dailyPayment}
          categories={categories}
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileBreakdownSheet;
