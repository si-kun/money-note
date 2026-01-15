import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Control, Controller } from "react-hook-form";
import HistoryDetail from "./HistoryDetail";
import {
  getShoppingHistory,
  ShoppingHistoryWithItems,
} from "@/app/server-aciton/shopping/history/getShoppingHistory";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TransactionsFormType,  } from "@/app/types/zod/transaction";

interface ShoppingHistorySelectorProps {
  control: Control<TransactionsFormType>;
  histories: ShoppingHistoryWithItems[];
  setHistories: Dispatch<SetStateAction<ShoppingHistoryWithItems[]>>;
  date: string;
}

const ShoppingHistorySelector = ({
  control,
  histories,
  setHistories,
  date,
}: ShoppingHistorySelectorProps) => {
  const [historyDate, setHistoryDate] = useState<Date | undefined>(
    date ? new Date(date) : new Date()
  );

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const result = await getShoppingHistory();
        if (result.success && result.data) {
          const newHistories = result.data.filter((history) => {
            // historyDateが未選択の場合は全て表示
            if (!historyDate) return true;

            // 日付を比較（時刻を無視）
            const historyDateOnly = format(
              new Date(history.date),
              "yyyy-MM-dd"
            );
            const selectedDateOnly = format(historyDate, "yyyy-MM-dd");

            return historyDateOnly === selectedDateOnly;
          });

          setHistories(newHistories);
        }
      } catch (error) {
        console.error("Error fetching histories:", error);
      }
    };

    fetchHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyDate]);

  return (
    <Controller
      control={control}
      name="historyId"
      render={({ field }) => (
        <Field>
          <Card
            className={`${field.value ? "border-blue-500 bg-slate-200" : ""}`}
          >
            <CardHeader>
              <CardTitle>買い物履歴から選択してください。</CardTitle>
              <DialogDescription>
              カートから購入した場合は自動で紐付けられています。<br />
              手動で追加した支出を、既存の買い物履歴と紐付けたい場合のみ選択してください。
              </DialogDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Popover>
                <PopoverTrigger asChild disabled={field.value !== null}>
                  <Button
                    variant="outline"
                    data-empty={!historyDate}
                    className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                  >
                    <CalendarIcon />
                    {historyDate ? (
                      format(historyDate, "yyyy/MM/dd")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={historyDate}
                    onSelect={setHistoryDate}
                  />
                </PopoverContent>
              </Popover>
              {histories.map((history) => (
                <div
                  key={history.id}
                  className={`flex items-center gap-2 w-full border-2 rounded-md p-2 ${
                    field.value === history.id
                      ? "border-blue-500 bg-blue-50"
                      : field.value !== null
                      ? "border-slate-200 bg-slate-100 opacity-50"
                      : "border-slate-50 bg-slate-50"
                  }`}
                >
                  <Checkbox
                    checked={field.value === history.id}
                    disabled={
                      field.value !== null
                    }
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? history.id : null)
                    }
                  />
                  <div className="w-full flex items-center">
                    <span>{history.name}</span>
                    <span className="ml-auto">
                      金額:¥
                      {history.totalPrice?.toLocaleString()}
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="ml-2">
                          【詳細】
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{history.name}の詳細</DialogTitle>
                        </DialogHeader>
                        <HistoryDetail data={history} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </Field>
      )}
    />
  );
};

export default ShoppingHistorySelector;
