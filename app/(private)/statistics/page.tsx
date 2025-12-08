"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getAllYearData } from "@/app/server-aciton/statistics/getAllYearData";
import { useEffect, useMemo, useState } from "react";
import {
  IncomeWithCategory,
  PaymentWithCategory,
} from "@/app/types/balance/balance";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StatisticsPage = () => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const [yearIncomeData, setYearIncomeData] = useState<IncomeWithCategory[]>(
    []
  );
  const [yearPaymentData, setYearPaymentData] = useState<PaymentWithCategory[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllYearData({ year: currentYear });
        if (result.success && result.data) {
          setYearIncomeData(result.data.income);
          setYearPaymentData(result.data.payment);
          toast.success(result.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [currentYear]);

  console.log(yearIncomeData[0]?.incomeDate instanceof Date);

  const chartData = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const incomeTotal = yearIncomeData
      .filter((income) => income.incomeDate.getMonth() + 1 === month)
      .reduce((sum, income) => sum + income.amount, 0);

    const paymentTotal = yearPaymentData
      .filter((payment) => payment.paymentDate.getMonth() + 1 === month)
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      month: new Date(currentYear, index).toLocaleString("default", {
        month: "long",
      }),
      income: incomeTotal,
      payment: paymentTotal,
    };
  });

  const paymentYearCategoryChartData = Array.from(
    { length: 12 },
    (_, index) => {
      const month = index + 1;

      const categoryTotals = yearPaymentData
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

  const getCategoryColor = (categoryName: string) => {
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const categoryConfig = useMemo(() => {
    return yearPaymentData.reduce((acc, payment) => {
      const categoryName = payment.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          label: categoryName,
          color: getCategoryColor(categoryName),
        };
      }
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [yearPaymentData]);

  const paymentCategoryChartData = Object.entries(
    yearPaymentData.reduce((acc, payment) => {
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

  console.log(paymentCategoryChartData);

  const paymentCategoryConfig = useMemo(() => {
    return yearPaymentData.reduce((acc, payment) => {
      const categoryName = payment.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          label: categoryName,
          color: getCategoryColor(categoryName),
        };
      }
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [yearPaymentData]);

  const chartConfig = {
    income: {
      label: "income",
      color: "#2563eb",
    },
    payment: {
      label: "payment",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <Tabs defaultValue="yearData" className="">
      <TabsList>
        <TabsTrigger value="yearData">年間データ</TabsTrigger>
        <TabsTrigger value="yearCategory">年間支出カテゴリー別</TabsTrigger>
        <TabsTrigger value="category">カテゴリー別</TabsTrigger>
      </TabsList>
      <TabsContent value="yearData">
        <ChartContainer config={chartConfig} className="h-[80vh] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="payment" fill="var(--color-payment)" radius={4} />
          </BarChart>
        </ChartContainer>
      </TabsContent>
      <TabsContent value="yearCategory">
        <ChartContainer config={categoryConfig} className="h-[80vh] w-full">
          <BarChart accessibilityLayer data={paymentYearCategoryChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {categoryConfig &&
              Object.keys(categoryConfig).map((category) => (
                <Bar
                  key={category}
                  dataKey={category}
                  fill={categoryConfig[category].color}
                  radius={4}
                />
              ))}
          </BarChart>
        </ChartContainer>
      </TabsContent>
      <TabsContent value="category">
        <ChartContainer
          config={paymentCategoryConfig}
          className="h-[80vh] w-full"
        >
          <BarChart accessibilityLayer data={paymentCategoryChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="amount" fill="#8884d8" radius={4} />
          </BarChart>
        </ChartContainer>
      </TabsContent>
    </Tabs>
  );
};

export default StatisticsPage;
