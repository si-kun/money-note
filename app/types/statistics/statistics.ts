import { IncomeWithCategory, PaymentWithCategory } from "../transaction/transaction";

export interface YearDataResponse {
    income: IncomeWithCategory[];
    payment: PaymentWithCategory[];
  }