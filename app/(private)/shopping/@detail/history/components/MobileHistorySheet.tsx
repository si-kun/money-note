"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Dispatch, SetStateAction } from "react";
import EditHistoryDialog from "./EditHistoryDialog";
import HistoryDeleteButton from "./HistoryDeleteButton";
import { ShoppinghistoryDataTable } from "./shoppingHistoryDataTable";
import { ShoppingHistoryWithItems } from "@/app/types/shopping/shopping";
import { historyColumns } from "./historyColumn";

interface MobileHistorySheetProps {
  isSheetOpen: boolean;
  setIsSheetOpen: Dispatch<SetStateAction<boolean>>;
  history: ShoppingHistoryWithItems;
}

const MobileHistorySheet = ({
  isSheetOpen,
  setIsSheetOpen,
  history,
}: MobileHistorySheetProps) => {
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent side="bottom" className="h-[80vh] p-4">
        <SheetHeader className="flex items-center gap-2 p-0">
          <SheetTitle>{history.name}の詳細</SheetTitle>
          <p className="text-sm text-muted-foreground">
            {history.items.length || 0}件のアイテム
          </p>
        </SheetHeader>
        <div className="flex items-center gap-2 justify-end">
          <EditHistoryDialog selectedHistory={history} />
          <HistoryDeleteButton historyId={history.id} />
        </div>
        <div className="overflow-y-auto">
          <ShoppinghistoryDataTable
            items={history.items || []}
            columns={historyColumns}
          />
        </div>
        <div>
          <div className="w-full flex justify-end">
            合計金額: {history.totalPrice?.toLocaleString()}円
          </div>
        </div>
        {/* </Card> */}
      </SheetContent>
    </Sheet>
  );
};

export default MobileHistorySheet;
