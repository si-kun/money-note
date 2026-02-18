"use client";

import { SubscriptionResponse } from "@/app/server-aciton/balance/getSubscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScanSearch } from "lucide-react";
import { DataTable } from "../../subscriptions/data-table";
import { columns } from "../../subscriptions/columns";
import { useState } from "react";

interface SubscriptionCardProps {
  monthlySubscription: SubscriptionResponse;
  year: number;
  month: number;
}

const SubscriptionCard = ({
  monthlySubscription,
  year,
  month,
}: SubscriptionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>サブスク</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 items-center">
        <span>登録数:{monthlySubscription?.subscription?.length ?? 0}</span>
        <span>
          合計金額:¥
          {(monthlySubscription.totalAmount ?? 0).toLocaleString()}
        </span>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild className="ml-auto">
            <Button
              className="hover:cursor-pointer"
              variant={"secondary"}
              type="button"
            >
              <ScanSearch />
              詳細を見る
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-6xl w-full h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>
                {year}年{month}月のサブスク継続一覧
              </DialogTitle>
              <DialogDescription>
                登録されているサブスクリプションの一覧です。
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <DataTable
                data={monthlySubscription.subscription}
                columns={columns}
                maxHeight="100%"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant={"secondary"}>
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
