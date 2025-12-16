import { prisma } from "@/lib/prisma/prisma";
import { Stock } from "@prisma/client";

interface PaymentData {
  id: string;
  title: string | undefined;
  amount: number;
  paymentDate: Date;
  categoryId: string;
  userId: string;
}
interface IncomeData {
  id: string;
  title: string | undefined;
  amount: number;
  incomeDate: Date;
  categoryId: string;
  userId: string;
}

interface SubscriptionData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date | null;
  monthlyPrice: number;
  userId: string;
}

const CATEGORY_TITLES: Record<string, string[]> = {
  "cat-1": ["ラーメン", "コンビニ", "レストラン", "カフェ", "寿司", "焼肉"], // 食費
  "cat-2": ["電車", "バス", "タクシー", "自転車レンタル"], // 交通費
  "cat-3": ["映画", "ゲーム", "カラオケ", "スポーツ観戦"], // 娯楽
  "cat-4": ["電気代", "ガス代", "水道代", "インターネット料金"], // 光熱費
  "cat-5": ["雑貨", "医療費", "教育費", "ギフト"], // その他
  "cat-6": ["月給"], // 給料
};

async function main() {
  console.log("シードデータの作成を開始");

  //ユーザーテーブルの削除
  console.log("ユーザーテーブルの削除を開始");
  await prisma.user.deleteMany({});

  // ユーザーの作成
  console.log("ユーザーの作成を開始");
  await prisma.user.create({
    data: {
      id: "test-user-id",
      email: "testuser@gmail.com",
      userName: "Test User",
    },
  });
  console.log("ユーザーの作成が完了しました");

  // カテゴリーの作成
  console.log("カテゴリーの作成を開始");
  await prisma.category.createMany({
    data: [
      { id: "cat-1", name: "食費", type: "EXPENSE", userId: "test-user-id" },
      { id: "cat-2", name: "交通費", type: "EXPENSE", userId: "test-user-id" },
      { id: "cat-3", name: "娯楽", type: "EXPENSE", userId: "test-user-id" },
      { id: "cat-4", name: "光熱費", type: "EXPENSE", userId: "test-user-id" },
      { id: "cat-5", name: "その他", type: "EXPENSE", userId: "test-user-id" },
      { id: "cat-6", name: "給料", type: "INCOME", userId: "test-user-id" },
    ],
  });
  console.log("カテゴリーの作成が完了しました");

  // 支払いの作成
  console.log("支払い作成を開始");

  // グラフを作るので各月にデータを追加
  const today = new Date();
  const year = today.getFullYear();

  // ランダムにタイトルを選ぶ関数
  const getRondomTitle = (categoryId: string): string | undefined => {
    const titles = CATEGORY_TITLES[categoryId];
    if (!titles || titles.length === 0) return undefined;

    // 50%の確率でタイトルを返さない
    if (Math.random() < 0.5) return undefined;

    return titles[Math.floor(Math.random() * titles.length)];
  };

  const paymentsData: PaymentData[] = [];

  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 28; day++) {
      paymentsData.push({
        id: `record-${month}-${day}`,
        title: getRondomTitle(`cat-${(day % 5) + 1}`),
        amount: Math.floor(Math.random() * 10000) + 500,
        paymentDate: new Date(year, month - 1, day),
        userId: "test-user-id",
        categoryId: `cat-${(day % 5) + 1}`,
      });
    }
  }

  await prisma.payment.createMany({
    data: paymentsData,
  });
  console.log("支払い作成が完了しました");

  // 収入の作成
  console.log("収入作成を開始");
  const incomesData: IncomeData[] = [];

  for (let month = 1; month <= 12; month++) {
    incomesData.push({
      id: `income-${month}`,
      title: "月給",
      amount: Math.floor(Math.random() * 200000) + 100000,
      incomeDate: new Date(year, month - 1, 1),
      userId: "test-user-id",
      categoryId: `cat-6`,
    });
  }
  await prisma.income.createMany({
    data: incomesData,
  });
  console.log("収入作成が完了しました");

  // サブスクの作成
  console.log("サブスク作成を開始");
  const subscriptionsData: SubscriptionData[] = [];

  subscriptionsData.push(
    {
      id: "sub-1",
      name: "Netflix",
      startDate: new Date(year - 1, 5, 15),
      endDate: null,
      monthlyPrice: 1200,
      userId: "test-user-id",
    },
    {
      id: "sub-2",
      name: "Spotify",
      startDate: new Date(year - 2, 3, 10),
      endDate: new Date(year - 1, 4, 11),
      monthlyPrice: 980,
      userId: "test-user-id",
    },
    {
      id: "sub-3",
      name: "Amazon Prime",
      startDate: new Date(year - 3, 7, 20),
      endDate: null,
      monthlyPrice: 500,
      userId: "test-user-id",
    },
    {
      id: "sub-4",
      name: "Spotify",
      startDate: new Date(year, 2, 10),
      endDate: null,
      monthlyPrice: 980,
      userId: "test-user-id",
    }
  );

  await prisma.subscription.createMany({
    data: subscriptionsData,
  });
  console.log("サブスク作成が完了しました");

  // stockデータの作成
  console.log("stockデータの作成を開始");
  const STOCK_DATA: Stock[] = [
    {
      id: "stock-1",
      name: "リンゴ",
      quantity: 10,
      minQuantity: 3,
      unit: "個",
      unitPrice: 150,
      userId: "test-user-id",
    },
    {
      id: "stock-2",
      name: "バナナ",
      quantity: 6,
      minQuantity: 2,
      unit: "房",
      unitPrice: 120,
      userId: "test-user-id",
    },
    {
      id: "stock-3",
      name: "牛乳",
      quantity: 2,
      minQuantity: 1,
      unit: "本",
      unitPrice: 200,
      userId: "test-user-id",
    },
    {
      id: "stock-4",
      name: "卵",
      quantity: 1,
      minQuantity: 1,
      unit: "パック",
      unitPrice: 250,
      userId: "test-user-id",
    },
    {
      id: "stock-5",
      name: "トイレットペーパー",
      quantity: 4,
      minQuantity: 2,
      unit: "ロール",
      unitPrice: 100,
      userId: "test-user-id",
    },
    {
      id: "stock-6",
      name: "米",
      quantity: 3,
      minQuantity: 1,
      unit: "kg",
      unitPrice: 500,
      userId: "test-user-id",
    },
    {
      id: "stock-7",
      name: "パスタ",
      quantity: 5,
      minQuantity: 2,
      unit: "袋",
      unitPrice: 180,
      userId: "test-user-id",
    },
    {
      id: "stock-8",
      name: "玉ねぎ",
      quantity: 8,
      minQuantity: 3,
      unit: "個",
      unitPrice: 50,
      userId: "test-user-id",
    },
    {
      id: "stock-9",
      name: "じゃがいも",
      quantity: 12,
      minQuantity: 4,
      unit: "個",
      unitPrice: 40,
      userId: "test-user-id",
    },
    {
      id: "stock-10",
      name: "にんじん",
      quantity: 7,
      minQuantity: 2,
      unit: "本",
      unitPrice: 60,
      userId: "test-user-id",
    },
    {
      id: "stock-11",
      name: "キャベツ",
      quantity: 2,
      minQuantity: 1,
      unit: "玉",
      unitPrice: 180,
      userId: "test-user-id",
    },
    {
      id: "stock-12",
      name: "豆腐",
      quantity: 3,
      minQuantity: 1,
      unit: "丁",
      unitPrice: 80,
      userId: "test-user-id",
    },
    {
      id: "stock-13",
      name: "納豆",
      quantity: 4,
      minQuantity: 2,
      unit: "パック",
      unitPrice: 90,
      userId: "test-user-id",
    },
    {
      id: "stock-14",
      name: "食パン",
      quantity: 2,
      minQuantity: 1,
      unit: "斤",
      unitPrice: 150,
      userId: "test-user-id",
    },
    {
      id: "stock-15",
      name: "バター",
      quantity: 1,
      minQuantity: 1,
      unit: "個",
      unitPrice: 300,
      userId: "test-user-id",
    },
    {
      id: "stock-16",
      name: "ヨーグルト",
      quantity: 3,
      minQuantity: 1,
      unit: "個",
      unitPrice: 120,
      userId: "test-user-id",
    },
    {
      id: "stock-17",
      name: "チーズ",
      quantity: 2,
      minQuantity: 1,
      unit: "パック",
      unitPrice: 350,
      userId: "test-user-id",
    },
    {
      id: "stock-18",
      name: "ティッシュ",
      quantity: 3,
      minQuantity: 2,
      unit: "箱",
      unitPrice: 180,
      userId: "test-user-id",
    },
    {
      id: "stock-19",
      name: "洗剤",
      quantity: 1,
      minQuantity: 1,
      unit: "本",
      unitPrice: 450,
      userId: "test-user-id",
    },
    {
      id: "stock-20",
      name: "シャンプー",
      quantity: 2,
      minQuantity: 1,
      unit: "本",
      unitPrice: 600,
      userId: "test-user-id",
    },
    {
      id: "stock-21",
      name: "砂糖",
      quantity: 0,
      minQuantity: 1,
      unit: "袋",
      unitPrice: 200,
      userId: "test-user-id",
    },
    {
      id: "stock-22",
      name: "塩",
      quantity: 0,
      minQuantity: 1,
      unit: "袋",
      unitPrice: 150,
      userId: "test-user-id",
    },
    {
      id: "stock-23",
      name: "しょうゆ",
      quantity: 0,
      minQuantity: 1,
      unit: "本",
      unitPrice: 300,
      userId: "test-user-id",
    },
    {
      id: "stock-24",
      name: "みりん",
      quantity: 0,
      minQuantity: 1,
      unit: "本",
      unitPrice: 350,
      userId: "test-user-id",
    },
    {
      id: "stock-25",
      name: "お茶",
      quantity: 1,
      minQuantity: 3,
      unit: "本",
      unitPrice: 180,
      userId: "test-user-id",
    },
    {
      id: "stock-26",
      name: "コーヒー",
      quantity: 1,
      minQuantity: 2,
      unit: "袋",
      unitPrice: 500,
      userId: "test-user-id",
    },
    {
      id: "stock-27",
      name: "ラップ",
      quantity: 0,
      minQuantity: 1,
      unit: "個",
      unitPrice: 250,
      userId: "test-user-id",
    },
    {
      id: "stock-28",
      name: "アルミホイル",
      quantity: 0,
      minQuantity: 1,
      unit: "個",
      unitPrice: 300,
      userId: "test-user-id",
    },
  ];
  await prisma.stock.createMany({
    data: STOCK_DATA,
  });
  console.log("stockデータの作成が完了しました");

  console.log("ShoppingCart,CartItemデータを作成開始");
  // ShoppingCart データ
  const SHOPPING_CART_DATA = [
    {
      id: "shopping-cart-1",
      userId: "test-user-id",
    },
    {
      id: "shopping-cart-2",
      userId: "test-user-id",
    },
    {
      id: "shopping-cart-3",
      userId: "test-user-id",
    },
    {
      id: "shopping-cart-4",
      userId: "test-user-id",
    },
    {
      id: "shopping-cart-5",
      userId: "test-user-id",
    },
  ];

  // ShoppingCartItem データ
// SHOPPING_CART_ITEM_DATA を更新（historyId を割り振り）
const SHOPPING_CART_ITEM_DATA = [
  // shopping-history-1 のアイテム（過去の購入履歴）
  { id: "cart-item-1", itemName: "牛乳", quantity: 2, unit: "本", checked: false, memo: null, cartId: null, historyId: "shopping-history-1", stockId: null },
  { id: "cart-item-2", itemName: "食パン", quantity: 1, unit: "斤", checked: false, memo: null, cartId: null, historyId: "shopping-history-1", stockId: null },
  { id: "cart-item-3", itemName: "卵", quantity: 1, unit: "パック", checked: false, memo: null, cartId: null, historyId: "shopping-history-1", stockId: null },
  { id: "cart-item-4", itemName: "バナナ", quantity: 1, unit: "房", checked: false, memo: null, cartId: null, historyId: "shopping-history-1", stockId: null },

  // shopping-history-2 のアイテム
  { id: "cart-item-5", itemName: "ヨーグルト", quantity: 3, unit: "個", checked: false, memo: null, cartId: null, historyId: "shopping-history-2", stockId: null },
  { id: "cart-item-6", itemName: "豆腐", quantity: 2, unit: "丁", checked: false, memo: null, cartId: null, historyId: "shopping-history-2", stockId: null },
  { id: "cart-item-7", itemName: "納豆", quantity: 3, unit: "パック", checked: false, memo: null, cartId: null, historyId: "shopping-history-2", stockId: null },
  { id: "cart-item-8", itemName: "トマト", quantity: 4, unit: "個", checked: false, memo: null, cartId: null, historyId: "shopping-history-2", stockId: null },

  // shopping-history-3 のアイテム
  { id: "cart-item-9", itemName: "きゅうり", quantity: 3, unit: "本", checked: false, memo: null, cartId: null, historyId: "shopping-history-3", stockId: null },
  { id: "cart-item-10", itemName: "レタス", quantity: 1, unit: "玉", checked: false, memo: null, cartId: null, historyId: "shopping-history-3", stockId: null },
  { id: "cart-item-11", itemName: "鶏もも肉", quantity: 300, unit: "g", checked: false, memo: null, cartId: null, historyId: "shopping-history-3", stockId: null },
  { id: "cart-item-12", itemName: "豚バラ肉", quantity: 200, unit: "g", checked: false, memo: null, cartId: null, historyId: "shopping-history-3", stockId: null },

  // shopping-history-4 のアイテム
  { id: "cart-item-13", itemName: "サラダ油", quantity: 1, unit: "本", checked: false, memo: null, cartId: null, historyId: "shopping-history-4", stockId: null },
  { id: "cart-item-14", itemName: "醤油", quantity: 1, unit: "本", checked: false, memo: null, cartId: null, historyId: "shopping-history-4", stockId: null },
  { id: "cart-item-15", itemName: "味噌", quantity: 1, unit: "袋", checked: false, memo: null, cartId: null, historyId: "shopping-history-4", stockId: null },
  { id: "cart-item-16", itemName: "お茶", quantity: 2, unit: "本", checked: false, memo: null, cartId: null, historyId: "shopping-history-4", stockId: null },

  // shopping-history-5 のアイテム
  { id: "cart-item-17", itemName: "ティッシュ", quantity: 5, unit: "箱", checked: false, memo: null, cartId: null, historyId: "shopping-history-5", stockId: null },
  { id: "cart-item-18", itemName: "トイレットペーパー", quantity: 12, unit: "ロール", checked: false, memo: null, cartId: null, historyId: "shopping-history-5", stockId: null },
  { id: "cart-item-19", itemName: "洗剤", quantity: 1, unit: "本", checked: false, memo: null, cartId: null, historyId: "shopping-history-5", stockId: null },
  { id: "cart-item-20", itemName: "シャンプー", quantity: 1, unit: "本", checked: false, memo: null, cartId: null, historyId: "shopping-history-5", stockId: null },

  // shopping-cart-1 のアイテム（現在のカート）
  { id: "cart-item-21", itemName: "りんご", quantity: 5, unit: "個", checked: false, memo: null, cartId: "shopping-cart-1", historyId: null, stockId: null },
  { id: "cart-item-22", itemName: "じゃがいも", quantity: 6, unit: "個", checked: false, memo: null, cartId: "shopping-cart-1", historyId: null, stockId: null },
  { id: "cart-item-23", itemName: "玉ねぎ", quantity: 4, unit: "個", checked: false, memo: null, cartId: "shopping-cart-1", historyId: null, stockId: null },
  { id: "cart-item-24", itemName: "にんじん", quantity: 3, unit: "本", checked: false, memo: null, cartId: "shopping-cart-1", historyId: null, stockId: null },
  { id: "cart-item-25", itemName: "キャベツ", quantity: 1, unit: "玉", checked: false, memo: null, cartId: "shopping-cart-1", historyId: null, stockId: null },

  // shopping-cart-2 のアイテム
  { id: "cart-item-26", itemName: "牛肉", quantity: 300, unit: "g", checked: false, memo: null, cartId: "shopping-cart-2", historyId: null, stockId: null },
  { id: "cart-item-27", itemName: "ハム", quantity: 1, unit: "パック", checked: false, memo: null, cartId: "shopping-cart-2", historyId: null, stockId: null },
  { id: "cart-item-28", itemName: "チーズ", quantity: 2, unit: "個", checked: false, memo: null, cartId: "shopping-cart-2", historyId: null, stockId: null },
  { id: "cart-item-29", itemName: "バター", quantity: 1, unit: "箱", checked: false, memo: null, cartId: "shopping-cart-2", historyId: null, stockId: null },
  { id: "cart-item-30", itemName: "マヨネーズ", quantity: 1, unit: "本", checked: false, memo: null, cartId: "shopping-cart-2", historyId: null, stockId: null },

  // shopping-cart-3 のアイテム
  { id: "cart-item-31", itemName: "カレールー", quantity: 1, unit: "箱", checked: false, memo: null, cartId: "shopping-cart-3", historyId: null, stockId: null },
  { id: "cart-item-32", itemName: "パスタ", quantity: 2, unit: "袋", checked: false, memo: null, cartId: "shopping-cart-3", historyId: null, stockId: null },
  { id: "cart-item-33", itemName: "パスタソース", quantity: 3, unit: "袋", checked: false, memo: null, cartId: "shopping-cart-3", historyId: null, stockId: null },
  { id: "cart-item-34", itemName: "インスタントラーメン", quantity: 5, unit: "袋", checked: false, memo: null, cartId: "shopping-cart-3", historyId: null, stockId: null },
  { id: "cart-item-35", itemName: "お米", quantity: 5, unit: "kg", checked: false, memo: null, cartId: "shopping-cart-3", historyId: null, stockId: null },

  // shopping-cart-4 のアイテム
  { id: "cart-item-36", itemName: "コーヒー", quantity: 1, unit: "袋", checked: false, memo: null, cartId: "shopping-cart-4", historyId: null, stockId: null },
  { id: "cart-item-37", itemName: "紅茶", quantity: 1, unit: "箱", checked: false, memo: null, cartId: "shopping-cart-4", historyId: null, stockId: null },
  { id: "cart-item-38", itemName: "ジュース", quantity: 2, unit: "本", checked: false, memo: null, cartId: "shopping-cart-4", historyId: null, stockId: null },
  { id: "cart-item-39", itemName: "お菓子", quantity: 3, unit: "袋", checked: false, memo: null, cartId: "shopping-cart-4", historyId: null, stockId: null },
  { id: "cart-item-40", itemName: "アイスクリーム", quantity: 2, unit: "個", checked: false, memo: null, cartId: "shopping-cart-4", historyId: null, stockId: null },
];

  await prisma.shoppingCart.createMany({
    data: SHOPPING_CART_DATA,
  });

  console.log("ShoppingHistory,HistoryItemデータを作成開始");
  // ShoppingHistory データ
  const SHOPPING_HISTORY_DATA = [
    {
      id: "shopping-history-1",
      userId: "test-user-id",
      date: new Date(2024, 10, 15),
      totalPrice: 3500,
      paymentId: null,
    },
    {
      id: "shopping-history-2",
      userId: "test-user-id",
      date: new Date(2024, 10, 22),
      totalPrice: 2800,
      paymentId: null,
    },
    {
      id: "shopping-history-3",
      userId: "test-user-id",
      date: new Date(2024, 11, 1),
      totalPrice: 4200,
      paymentId: null,
    },
    {
      id: "shopping-history-4",
      userId: "test-user-id",
      date: new Date(2024, 11, 8),
      totalPrice: 3100,
      paymentId: null,
    },
    {
      id: "shopping-history-5",
      userId: "test-user-id",
      date: new Date(2024, 11, 15),
      totalPrice: 2600,
      paymentId: null,
    },
  ];

  await prisma.shoppingHistory.createMany({
    data: SHOPPING_HISTORY_DATA,
  })
  console.log("ShoppingHistory,HistoryItemデータが完了しました");

  await prisma.shoppingCartItem.createMany({
    data: SHOPPING_CART_ITEM_DATA,
  });
  console.log("ShoppingCart,CartItemデータが完了しました");


  console.log("シードデータの作成が完了しました");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
