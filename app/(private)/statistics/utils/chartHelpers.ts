import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/transaction/transaction";

export const getCategoryColor = (categoryName: string) => {
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

interface CalcChartDataProps {
  initialIncome: IncomeWithCategory[];
  initialPayment: PaymentWithCategory[];
  currentYear: number;
}

export const calcChartData  = ({
  initialIncome,
  initialPayment,
  currentYear,
}: CalcChartDataProps) => {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const incomeTotal = initialIncome
      .filter((income) => income.incomeDate.getMonth() + 1 === month)
      .reduce((sum, income) => sum + income.amount, 0);

    const paymentTotal = initialPayment
      .filter((payment) => payment.paymentDate.getMonth() + 1 === month)
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      month: new Date(currentYear, index).toLocaleString("default", {
        month: "long",
        timeZone: "Asia/Tokyo",
      }),
      income: incomeTotal,
      payment: paymentTotal,
    };
  });

};

interface CalcPaymentYearCategoryChartDataProps {
  initialPayment: PaymentWithCategory[];
  currentYear: number;
}

export const calcPaymentYearCategoryChartData = ({
  initialPayment,
  currentYear,
}: CalcPaymentYearCategoryChartDataProps) => {
  return Array.from(
    { length: 12 },
    (_, index) => {
      const month = index + 1;

      const categoryTotals = initialPayment
        .filter((payment) => payment.paymentDate.getMonth() + 1 === month)
        .reduce((acc, payment) => {
          const categoryName = payment.category.name;
          if (!acc[categoryName]) {
            acc[categoryName] = payment.amount;
          } else {
            acc[categoryName] += payment.amount;
          }
          return acc;
        }, {} as Record<string, number>);

      return {
        month: new Date(currentYear, index).toLocaleString("default", {
          month: "long",
        }),
        ...categoryTotals,
      };
    }
  );
};

export const calcPaymentCategoryChartData = (
  initialPayment: PaymentWithCategory[]
) => {
  return Object.entries(
    initialPayment.reduce((acc, payment) => {
      const categoryName = payment.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = payment.amount;
      } else {
        acc[categoryName] += payment.amount;
      }
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, amount]) => ({
    category,
    amount,
    fill: getCategoryColor(category),
  }));
};
