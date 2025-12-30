-- AlterTable
ALTER TABLE "ShoppingCart" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '買い物リスト';

-- AlterTable
ALTER TABLE "ShoppingHistory" ADD COLUMN     "name" TEXT DEFAULT '買い物履歴';
