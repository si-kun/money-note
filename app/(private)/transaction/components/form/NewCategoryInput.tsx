import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

interface NewCategoryInputProps {
  showNewCategory: boolean;
  setShowNewCategory: Dispatch<SetStateAction<boolean>>;
  newCategoryName: string;
  setNewCategoryName: Dispatch<SetStateAction<string>>;
  handleCreateCategory: () => Promise<void>;
}

const NewCategoryInput = ({
  showNewCategory,
  setShowNewCategory,
  newCategoryName,
  setNewCategoryName,
  handleCreateCategory,
}: NewCategoryInputProps) => {
  return (
    <div className="p-2 border-t">
      {!showNewCategory ? (
        <Button
          type="button"
          variant={"outline"}
          onClick={() => setShowNewCategory(true)}
        >
          新規作成
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            onChange={(e) => setNewCategoryName(e.target.value)}
            value={newCategoryName}
            placeholder="カテゴリー名を入力"
          />
          <Button
            type="button"
            variant={"outline"}
            className="bg-green-500 hover:bg-green-400"
            onClick={handleCreateCategory}
          >
            追加
          </Button>
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => setShowNewCategory(false)}
          >
            キャンセル
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewCategoryInput;
