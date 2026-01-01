import { StockDataTable } from "@/app/(private)/stock/components/stockData-table"
import { Stock } from "@prisma/client"
import { stockColumns } from "./components/stockColumns"
import { getAllStock } from "@/app/server-aciton/stock/getAllStock"
import { getShoppingCart } from "@/app/server-aciton/shopping/cart/getShoppingCart"

 
interface StockPageProps {
  searchParams: Promise<{
    page? :string
  }>
}

async function getData(): Promise<Stock[]> {
  // Fetch data from your API here.
  try {
    const response = await getAllStock()
    if(response.data && response.success) {
      return response.data
    }
    return []
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return []
  }
}

const StockPage = async ({searchParams}: StockPageProps) => {

  const data = await getData()
  const cartsResponse = await getShoppingCart()
  const carts = cartsResponse.data || []

  const params = await searchParams;
  const currentPage = Number(params.page || "0");

  return (
    <div className="container mx-auto py-10">
      <StockDataTable columns={stockColumns} data={data} carts={carts} initialPage={currentPage} />
    </div>
  )
}

export default StockPage