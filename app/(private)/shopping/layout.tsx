import ShoppingTabs from "./components/ShoppingTabs";

export default async function ShoppingLayout({
  list,
  detail,
}: {
  list: React.ReactNode;
  detail: React.ReactNode;
}) {
  return (
    <div className="flex w-full gap-6 h-full overflow-hidden">
      {/* 左側: カード/履歴リスト */}
      <div className="w-[30vw] flex flex-col h-full overflow-hidden">
        <ShoppingTabs />
        {list}
      </div>

      {/* 右側: 選択されたアイテムのテーブル */}
      <div className="flex-1">{detail}</div>
    </div>
  );
}
