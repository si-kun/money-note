import { StockDataTable } from "@/app/(private)/stock/components/stockData-table";
import { getAllStock } from "@/app/server-aciton/stock/getAllStock";
import { getShoppingCart } from "@/app/server-aciton/shopping/cart/getShoppingCart";
import { getStockCategory } from "@/app/server-aciton/getStockCategory";

export const dynamic = "force-dynamic";

interface StockPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const StockPage = async ({ searchParams }: StockPageProps) => {
  const stockResponse = await getAllStock();
  const stocks = stockResponse.data || [];

  const cartsResponse = await getShoppingCart();
  const carts = cartsResponse.data || [];

  const params = await searchParams;
  const currentPage = Number(params.page || "0");
  const categoriesResponse = await getStockCategory();
  const categories = categoriesResponse.data || [];

  return (
    <StockDataTable
      stocks={stocks}
      carts={carts}
      categories={categories}
      initialPage={currentPage}
    />
  );
};

export default StockPage;
