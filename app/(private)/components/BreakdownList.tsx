import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SelectedData } from "@/app/types/balance/balance";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getCategory } from "@/app/server-aciton/balance/getCategory";

interface BreakdownList {
  selectedDate: SelectedData | null;
}

const BreakdownList = ({ selectedDate }: BreakdownList) => {

  // const categorys = await getCategory();

  return (
    <div className="flex flex-col h-full max-h-full flex-1 gap-3 py-1 overflow-y-auto">
      {selectedDate?.incomes?.map((income) => (
        <Card className="bg-blue-200" key={income.id}>
          <CardContent className="flex">
            <span className="w-[30%]">{income.category.name}</span>
            <span className="w-[40%]">{income.title || ""}</span>
            <span className="ml-auto">¥{income.amount.toLocaleString()}</span>
          </CardContent>
        </Card>
      ))}

      {selectedDate?.payments?.map((payment) => (
        <Card className="bg-red-200" key={payment.id}>
          <CardContent className="flex items-center">
            <span className="w-[30%]">【{payment.category.name}】</span>
            <span className="w-[40%]">{payment.title || ""}</span>
            <span className="ml-auto">¥{payment.amount.toLocaleString()}</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="p-2 ml-2 bg-yellow-200"
                  variant={"secondary"}
                  type="button"
                >
                  【編集】
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    【{payment.category.name}】{payment.title}
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <Label>カテゴリーを選択</Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BreakdownList;
