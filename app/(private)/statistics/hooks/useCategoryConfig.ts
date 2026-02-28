import { useMemo } from "react";
import { getCategoryColor } from "../utils/chartHelpers";
import { PaymentWithCategory } from "@/app/types/transaction/transaction";

interface UseCategoryConfigProps {
  payments: PaymentWithCategory[];
}

export const useCategoryConfig = ({ payments }: UseCategoryConfigProps) => {
  return useMemo(() => {
    return payments.reduce((acc, payment) => {
      const categoryName = payment.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          label: categoryName,
          color: getCategoryColor(categoryName),
        };
      }
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [payments]);
};
