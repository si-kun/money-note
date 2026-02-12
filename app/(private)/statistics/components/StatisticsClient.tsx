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
import { YearDataResponse } from "@/app/server-aciton/statistics/getAllYearData";
import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCategoryColor } from "../utils/chartHelpers";
import { useCategoryConfig } from "../hooks/useCategoryConfig";

interface StatisticsClientProps {
  data: YearDataResponse | null;
  currentYear: number;
}

const StatisticsClient = ({ data, currentYear }: StatisticsClientProps) => {
  const router = useRouter();

  const initialIncome = useMemo(() => data?.income ?? [], [data?.income]);
  const initialPayment = useMemo(() => data?.payment ?? [], [data?.payment]);
  const categoryConfig = useCategoryConfig({ payments: initialPayment });

  const chartData = Array.from({ length: 12 }, (_, index) => {
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
  const paymentYearCategoryChartData = Array.from(
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

  const paymentCategoryChartData = Object.entries(
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

  const handleNextYear = () => {
    const nextYear = currentYear + 1;
    router.push(`/statistics?year=${nextYear}`);
  };

  const handlePrevYear = () => {
    const prevYear = currentYear - 1;
    router.push(`/statistics?year=${prevYear}`);
  };

  return (
    <div>
      <p>{currentYear}</p>
      <Tabs defaultValue="yearData" className="">
        <TabsList>
          <TabsTrigger value="yearData">年間データ</TabsTrigger>
          <TabsTrigger value="yearCategory">年間支出カテゴリー別</TabsTrigger>
          <TabsTrigger value="category">カテゴリー別</TabsTrigger>
          <div>
            <Button onClick={handlePrevYear}>
              <CircleArrowLeft />
              前年度
            </Button>
            <Button onClick={handleNextYear}>
              <CircleArrowRight />
              次年度
            </Button>
          </div>
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
          <ChartContainer config={categoryConfig} className="h-[80vh] w-full">
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
    </div>
  );
};

export default StatisticsClient;
