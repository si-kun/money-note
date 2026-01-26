import { updateCategory } from "@/app/server-aciton/stock/updateCategory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StockCategory } from "@prisma/client";
import { toast } from "sonner";

interface CategorySelectProps {
  categories?: StockCategory[];
  categoryId?: string;
  stockName: string;
  stockId: string;
}

const CategorySelect = ({
  categories,
  categoryId,
  stockName,
  stockId,
}: CategorySelectProps) => {
  const selectedCategory = categories?.find((cat) => cat.id === categoryId);

  // カテゴリー変更
  const handleUpdateCategory = async (
    newCategoryId: string,
    stockId: string
  ) => {
    try {
      const response = await updateCategory({
        categoryId: newCategoryId,
        stockId,
      });
      if (response.success) {
        toast.success(`${stockName}のカテゴリーを更新しました`);
      }
    } catch (error) {
      console.error("カテゴリー更新エラー", error);
      toast.error("カテゴリーの更新に失敗しました");
    }
  };

  return (
    <Select
      defaultValue={selectedCategory ? selectedCategory.id : undefined}
      onValueChange={(value) => {handleUpdateCategory(value, stockId)}}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="カテゴリーが未選択" />
      </SelectTrigger>
      <SelectContent>
        {categories?.map((cat) => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.categoryName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
