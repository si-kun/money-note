import { Prisma } from "@/generated/prisma/client";

// Prisma が自動生成してくれる型を使う
export type IncomeWithCategory = Prisma.IncomeGetPayload<{
  include: { category: true };
}>;
export type PaymentWithCategory = Prisma.PaymentGetPayload<{
  include: {
    category: true;
    shoppingHistory: {
      include: {
        items: {
          include: { stock: true };
        };
      };
    };
  };
}>;

export type BalanceData = Record<
  string,
  {
    income: number;
    payment: number;
    balance: number;
  }
>;

export interface SelectedData {
  date: string;
  incomes: IncomeWithCategory[];
  payments: PaymentWithCategory[];
  totalIncome: number;
  totalPayment: number;
  balance: number;
}

export interface EventData {
  title: string;
  start: string;
  allDay: boolean;
  extendedProps: {
    income: number;
    payment: number;
    balance: number;
  };
}

export interface ProductValue {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stockAdd: boolean;
}
