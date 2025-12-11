"use client";
import { getSubscription, SubscriptionResponse } from "@/app/server-aciton/balance/getSubscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScanSearch } from "lucide-react";
import { DataTable } from "../../subscriptions/data-table";
import { columns } from "../../subscriptions/columns";
import { useEffect, useState } from "react";

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

  const [isOpen,setIsOpen] = useState(false);
  const [displayData,setDisplayData] = useState<SubscriptionResponse>(monthlySubscription);

  const fetchData = async () => {
    const result = await getSubscription({year,month});
    if(result.success) {
      setDisplayData(result.data);
    }
  }

  useEffect(() => {
    const handleUpdate = () => {
      if(isOpen){
        fetchData();
      }
    }

    window.addEventListener("subscriptionUpdated", handleUpdate);

    return () => {
      window.removeEventListener("subscriptionUpdated", handleUpdate);
    }
  },[isOpen,year,month])


  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>サブスク</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 items-center">
        <span>登録数:{monthlySubscription.subscription.length}</span>
        <span>
          合計金額:¥
          {monthlySubscription.totalAmount.toLocaleString()}
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
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
              <DataTable
                data={displayData.subscription}
                columns={columns}
                maxHeight="65vh"
              />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
