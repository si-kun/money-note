import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Field, FieldGroup } from "@/components/ui/field";

import { Textarea } from "@/components/ui/textarea";
import TypeToggleButton from "./TypeToggleButton";

import { Controller } from "react-hook-form";

import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import FloatingLabel from "./FloatingLabel";
import { SelectedData } from "@/app/types/balance/balance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Stock } from "@prisma/client";
import { useEffect, useState } from "react";
import { getAllStock } from "@/app/server-aciton/stock/getAllStock";
import { StockListDataTable } from "./StockListDataTable";
import { stockListColumns } from "./stockListColumns";

import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface TransactionFormProps {
  selectedDate: SelectedData;
}

const TransactionForm = ({ selectedDate }: TransactionFormProps) => {

  const [stockData, setStockData] = useState<Stock[]>([]);
  const [stockOpen, setStockOpen] = useState(false);

  useEffect(() => {
    if(stockOpen === true) {
      const fetchStockData = async () => {
        try {
          const result = await getAllStock();
          if(result.success && result.data) {
            setStockData(result.data);
          }
        } catch(error) {
          console.error("Error fetching stock data:", error);
        }
      }
      fetchStockData();
    }
  },[stockOpen])

  const {
    form,
    onSubmit,
    filteredCategory,
    shoppingCategoryId,
    typeValue,
    open,
    setOpen,
    updateProduct,
    newAddProduct,
    addInputProduct,
    setAddInputProduct,
    totalCartPrice,
  } = useTransactionForm();

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen === false) {
          form.reset();
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger
        asChild
        className="text-blue-500 hover:cursor-pointer hover:bg-blue-400 hover:text-white"
      >
        <Button type="button" variant={"secondary"}>
          <CirclePlus />
          内訳を追加
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[30vw] h-[80vh] flex flex-col py-5 overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <DialogHeader>
                <DialogTitle>{selectedDate.date}の収支を追加する</DialogTitle>
                <DialogDescription>
                  収入・支出の内訳を追加します。
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-5">
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2">
                      <TypeToggleButton field={field} type="INCOME" />
                      <TypeToggleButton field={field} type="PAYMENT" />
                    </div>
                  )}
                />
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="relative">
                      <FloatingLabel label="タイトル" fieldState={fieldState} />
                      <Input
                        type="text"
                        className="p-4 h-14"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="categoryId"
                  render={({ field, fieldState }) => (
                    <Field className="relative">
                      <FloatingLabel
                        label="カテゴリー"
                        fieldState={fieldState}
                      />
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger
                          onBlur={field.onBlur}
                          className="w-full data-[size=default]:h-14 p-4"
                        >
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="">
                          {filteredCategory.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                {shoppingCategoryId && typeValue === "PAYMENT" && (
                  <Card>
                    <CardHeader className="flex items-center justify-between">
                      <div>
                        <CardTitle>買い物リストを作成</CardTitle>
                        <CardDescription>
                          リストから選択。または手動で入力
                        </CardDescription>
                      </div>
                      <Dialog open={stockOpen} onOpenChange={setStockOpen}>
                        <DialogTrigger asChild>
                          <Button type="button" variant={"secondary"}>
                            リストから追加
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="min-w-[40vw]">
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <StockListDataTable data={stockData} columns={stockListColumns} onSelectionChange={(selectedRows) => {
                            const currentHistories = form.getValues("addHistories") || [];

                            // 重複チェック
                            const newProducts = selectedRows.filter((stock) => !currentHistories.some((item) => item.name === stock.name))
                            .map((stock) => ({
                              id: uuidv4(),
                              name: stock.name,
                              price: Number(stock.unitPrice),
                              quantity: 1,
                              stockAdd: false,
                            }))

                            // 重複がある場合は、警告
                            if(newProducts.length < selectedRows.length) {
                              toast.warning("一部の商品はすでに内訳に存在しているため、追加されませんでした。");
                            }

                            form.setValue("addHistories", [...currentHistories, ...newProducts]);

                            if(newProducts.length > 0) {
                              toast.success("選択した商品を内訳に追加しました");
                            }
                            setStockOpen(false);
                          }} />
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="ProductName">商品名を入力</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="ProductName"
                            value={addInputProduct}
                            onChange={(e) => setAddInputProduct(e.target.value)}
                          />
                          <Button
                            type="button"
                            onClick={newAddProduct}
                            variant={"secondary"}
                          >
                            追加
                          </Button>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <Table>
                        <TableCaption>
                          内訳として追加する商品の一覧です。
                          <br />
                          在庫に追加する場合はチェックを入れてください。
                        </TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>登録</TableHead>
                            <TableHead className="w-[120px]">商品名</TableHead>
                            <TableHead>個数</TableHead>
                            <TableHead>値段</TableHead>
                            <TableHead className="text-right w-[100px]">
                              合計
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <Controller
                          control={form.control}
                          name="addHistories"
                          render={({ field }) => (
                            <TableBody>
                              {field.value?.map((product) => {
                                const totalPrice =
                                  product.quantity * product.price;

                                return (
                                  <TableRow key={product.id}>
                                    <TableCell className="font-medium">
                                      <Checkbox
                                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                        checked={product.stockAdd}
                                        onCheckedChange={(value) =>
                                          form.setValue(
                                            "addHistories",
                                            field.value?.map((p) =>
                                              p.id === product.id
                                                ? {
                                                    ...p,
                                                    stockAdd: value === true,
                                                  }
                                                : p
                                            )
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {product.name}
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={product.quantity || ""}
                                        placeholder="0"
                                        onChange={(e) =>
                                          updateProduct(
                                            product.id,
                                            "quantity",
                                            Number(e.target.value)
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={product.price || ""}
                                        onChange={(e) =>
                                          updateProduct(
                                            product.id,
                                            "price",
                                            Number(e.target.value)
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className="text-right">
                                      ¥{totalPrice.toLocaleString()}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          )}
                        />
                      </Table>
                    </CardContent>
                  </Card>
                )}

                <Controller
                  control={form.control}
                  name="amount"
                  render={({ field, fieldState }) => (
                    <Field className="relative">
                      <FloatingLabel label="金額" fieldState={fieldState} />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="p-4 h-14"
                          value={field.value || totalCartPrice || ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          onBlur={field.onBlur}
                        />
                        {shoppingCategoryId && typeValue === "PAYMENT" && (
                          <Button
                            className="h-14"
                            onClick={() => {
                              form.setValue("amount", totalCartPrice);
                              form.trigger("amount");
                            }}
                            variant={"secondary"}
                            type="button"
                          >
                            カートの金額を反映
                          </Button>
                        )}
                      </div>
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="memo"
                  render={({ field, fieldState }) => (
                    <Field className="relative">
                      <FloatingLabel label="メモ" fieldState={fieldState} />
                      <Textarea
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="p-4 h-25 resize-none"
                      />
                    </Field>
                  )}
                />
                <Button
                  disabled={!form.formState.isValid}
                  type="submit"
                  className={`bg-green-500 ${
                    !form.formState.isValid
                      ? "opacity-50 cursor-not-allowed hover:bg-green-500"
                      : "hover:bg-green-600"
                  }`}
                >
                  保存
                </Button>
              </div>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
