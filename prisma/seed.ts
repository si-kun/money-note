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
  "cat-1": ["ラーメン", "コンビニ", "レストラン", "カフェ","寿司","焼肉"], // 食費
  "cat-2": ["電車", "バス", "タクシー", "自転車レンタル"],              // 交通費
  "cat-3": ["映画", "ゲーム", "カラオケ", "スポーツ観戦"],              // 娯楽
  "cat-4": ["電気代", "ガス代", "水道代", "インターネット料金"],        // 光熱費
  "cat-5": ["雑貨", "医療費", "教育費", "ギフト"],                    // その他
  "cat-6": ["月給"],                                                  // 給料
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
    if(Math.random() < 0.5) return undefined;

    return titles[Math.floor(Math.random() * titles.length)];
  }

  const paymentsData: PaymentData[] = [];

  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 28; day++) {
      paymentsData.push({
        id: `record-${month}-${day}`,
        title: getRondomTitle(`cat-${(day % 5) + 1}`),
        amount: Math.floor(Math.random() * 10000) + 500,
        paymentDate: new Date(year, month -1 , day),
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
      incomeDate: new Date(year, month -1, 1),
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
