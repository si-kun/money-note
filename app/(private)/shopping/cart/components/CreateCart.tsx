"use client";

import { createShoppingCart } from "@/app/server-aciton/shopping/cart/createCart";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const CreateCart = () => {
  const [newCartName, setNewCartName] = useState("");

  const handleNewCart = async () => {
    try {
      await createShoppingCart(newCartName);
      toast.success(`${newCartName} カートが作成されました`);
      setNewCartName("");
    } catch (error) {
      console.error("カートの作成中にエラーが発生しました:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="p-4">
        <Button className="h-20" type="button" variant={"secondary"}>
          カートを作成
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>カート</DialogTitle>
          <DialogDescription>
            新しいカートを作成します。カート名を入力してください。
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cartName">カート名</Label>
          <Input
            value={newCartName}
            onChange={(e) => setNewCartName(e.target.value)}
            id="cartName"
            placeholder="カート名を入力してください"
          />
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleNewCart}>
            カートを作成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCart;
