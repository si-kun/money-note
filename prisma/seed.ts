import { prisma } from "@/lib/prisma/prisma";

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
  await prisma.user.upsert({
    where: { id: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0" },
    update: {},  // 更新しない
    create: {
      id: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      email: "demo-user@gmail.com",
      userName: "デモユーザー",
    },
  })

  // ユーザーの作成
  console.log("ユーザーの作成を開始");
  console.log("ユーザーの作成が完了しました");

  // カテゴリーの作成
  console.log("カテゴリーの作成を開始");
  await prisma.category.createMany({
    data: [
      {
        id: "cat-1",
        name: "食費",
        type: "PAYMENT",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
      {
        id: "cat-2",
        name: "交通費",
        type: "PAYMENT",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
      {
        id: "cat-3",
        name: "娯楽",
        type: "PAYMENT",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
      {
        id: "cat-4",
        name: "光熱費",
        type: "PAYMENT",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
      {
        id: "cat-5",
        name: "その他",
        type: "PAYMENT",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
      {
        id: "cat-6",
        name: "給料",
        type: "INCOME",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
      {
        id: "cat-7",
        name: "買い物",
        type: "PAYMENT",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
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
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
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
      userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
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
      userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
    },
    {
      id: "sub-2",
      name: "Spotify",
      startDate: new Date(year - 2, 3, 10),
      endDate: new Date(year - 1, 4, 11),
      monthlyPrice: 980,
      userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
    },
    {
      id: "sub-3",
      name: "Amazon Prime",
      startDate: new Date(year - 3, 7, 20),
      endDate: null,
      monthlyPrice: 500,
      userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
    },
    {
      id: "sub-4",
      name: "Spotify",
      startDate: new Date(year, 2, 10),
      endDate: null,
      monthlyPrice: 980,
      userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
    }
  );

  await prisma.subscription.createMany({
    data: subscriptionsData,
  });
  console.log("サブスク作成が完了しました");

  // StockCategoryの作成
  console.log("StockCategoryの作成を開始");
  await prisma.stockCategory.createMany({
    data: [
      {
        id: "stock-cat-1",
        categoryName: "野菜",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
      {
        id: "stock-cat-2",
        categoryName: "果物",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
      {
        id: "stock-cat-3",
        categoryName: "乳製品",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
      {
        id: "stock-cat-4",
        categoryName: "調味料",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
      {
        id: "stock-cat-5",
        categoryName: "日用品",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
      {
        id: "stock-cat-6",
        categoryName: "穀物・麺類",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
      {
        id: "stock-cat-7",
        categoryName: "飲料",
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
      },
    ],
  });
  console.log("StockCategoryの作成が完了しました");

  // stockデータの作成
  console.log("stockデータの作成を開始");
  await prisma.stock.createMany({
    data: [
      // 果物
      {
        id: "stock-1",
        name: "リンゴ",
        quantity: 10,
        minQuantity: 3,
        unit: "個",
        unitPrice: 150,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-2",
      },
      {
        id: "stock-2",
        name: "バナナ",
        quantity: 6,
        minQuantity: 2,
        unit: "房",
        unitPrice: 120,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-2",
      },

      // 乳製品
      {
        id: "stock-3",
        name: "牛乳",
        quantity: 2,
        minQuantity: 1,
        unit: "本",
        unitPrice: 200,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-3",
      },
      {
        id: "stock-4",
        name: "卵",
        quantity: 1,
        minQuantity: 1,
        unit: "パック",
        unitPrice: 250,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-3",
      },
      {
        id: "stock-15",
        name: "バター",
        quantity: 1,
        minQuantity: 1,
        unit: "個",
        unitPrice: 300,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-3",
      },
      {
        id: "stock-16",
        name: "ヨーグルト",
        quantity: 3,
        minQuantity: 1,
        unit: "個",
        unitPrice: 120,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-3",
      },
      {
        id: "stock-17",
        name: "チーズ",
        quantity: 2,
        minQuantity: 1,
        unit: "パック",
        unitPrice: 350,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-3",
      },

      // 日用品
      {
        id: "stock-5",
        name: "トイレットペーパー",
        quantity: 4,
        minQuantity: 2,
        unit: "ロール",
        unitPrice: 100,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-5",
      },
      {
        id: "stock-18",
        name: "ティッシュ",
        quantity: 3,
        minQuantity: 2,
        unit: "箱",
        unitPrice: 180,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-5",
      },
      {
        id: "stock-19",
        name: "洗剤",
        quantity: 1,
        minQuantity: 1,
        unit: "本",
        unitPrice: 450,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-5",
      },
      {
        id: "stock-20",
        name: "シャンプー",
        quantity: 2,
        minQuantity: 1,
        unit: "本",
        unitPrice: 600,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-5",
      },
      {
        id: "stock-27",
        name: "ラップ",
        quantity: 0,
        minQuantity: 1,
        unit: "個",
        unitPrice: 250,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-5",
      },
      {
        id: "stock-28",
        name: "アルミホイル",
        quantity: 0,
        minQuantity: 1,
        unit: "個",
        unitPrice: 300,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-5",
      },

      // 穀物・麺類
      {
        id: "stock-6",
        name: "米",
        quantity: 3,
        minQuantity: 1,
        unit: "kg",
        unitPrice: 500,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-6",
      },
      {
        id: "stock-7",
        name: "パスタ",
        quantity: 5,
        minQuantity: 2,
        unit: "袋",
        unitPrice: 180,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-6",
      },
      {
        id: "stock-14",
        name: "食パン",
        quantity: 2,
        minQuantity: 1,
        unit: "斤",
        unitPrice: 150,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-6",
      },

      // 野菜
      {
        id: "stock-8",
        name: "玉ねぎ",
        quantity: 8,
        minQuantity: 3,
        unit: "個",
        unitPrice: 50,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-1",
      },
      {
        id: "stock-9",
        name: "じゃがいも",
        quantity: 12,
        minQuantity: 4,
        unit: "個",
        unitPrice: 40,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-1",
      },
      {
        id: "stock-10",
        name: "にんじん",
        quantity: 7,
        minQuantity: 2,
        unit: "本",
        unitPrice: 60,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-1",
      },
      {
        id: "stock-11",
        name: "キャベツ",
        quantity: 2,
        minQuantity: 1,
        unit: "玉",
        unitPrice: 180,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-1",
      },
      {
        id: "stock-12",
        name: "豆腐",
        quantity: 3,
        minQuantity: 1,
        unit: "丁",
        unitPrice: 80,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-1",
      },
      {
        id: "stock-13",
        name: "納豆",
        quantity: 4,
        minQuantity: 2,
        unit: "パック",
        unitPrice: 90,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-1",
      },

      // 調味料
      {
        id: "stock-21",
        name: "砂糖",
        quantity: 0,
        minQuantity: 1,
        unit: "袋",
        unitPrice: 200,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-4",
      },
      {
        id: "stock-22",
        name: "塩",
        quantity: 0,
        minQuantity: 1,
        unit: "袋",
        unitPrice: 150,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-4",
      },
      {
        id: "stock-23",
        name: "しょうゆ",
        quantity: 0,
        minQuantity: 1,
        unit: "本",
        unitPrice: 300,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-4",
      },
      {
        id: "stock-24",
        name: "みりん",
        quantity: 0,
        minQuantity: 1,
        unit: "本",
        unitPrice: 350,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-4",
      },

      // 飲料
      {
        id: "stock-25",
        name: "お茶",
        quantity: 1,
        minQuantity: 3,
        unit: "本",
        unitPrice: 180,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-7",
      },
      {
        id: "stock-26",
        name: "コーヒー",
        quantity: 1,
        minQuantity: 2,
        unit: "袋",
        unitPrice: 500,
        userId: "2f604489-0ac2-4f25-ba10-8bbe1035c0c0",
        stockCategoryId: "stock-cat-7",
      },
    ],
  });
  console.log("stockデータの作成が完了しました");

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
