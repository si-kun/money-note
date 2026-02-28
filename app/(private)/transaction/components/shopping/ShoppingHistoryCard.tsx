import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import HistoryDetail from "./HistoryDetail";
import { Button } from "@/components/ui/button";
import { PaymentWithCategory } from "@/app/types/transaction/transaction";

interface ShoppingHistoryCardProps {
  shoppingHistory: PaymentWithCategory["shoppingHistory"];
}

const ShoppingHistoryCard = ({ shoppingHistory }: ShoppingHistoryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>買い物履歴</CardTitle>
        <DialogDescription>
          ※買い物履歴と紐付いているため、カテゴリは変更できません
        </DialogDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="w-full flex items-center">
          <span>{shoppingHistory?.name}</span>
          <span className="ml-auto">
            金額:¥
            {shoppingHistory?.totalPrice?.toLocaleString() || 0}
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="ml-2">
                【詳細】
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {shoppingHistory?.name}
                  の詳細
                </DialogTitle>
              </DialogHeader>

              <HistoryDetail data={shoppingHistory!} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShoppingHistoryCard;
