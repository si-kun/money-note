import { StockDataTable } from "@/app/(private)/stock/components/stockData-table"
import { Stock } from "@prisma/client"
import { stockColumns } from "./components/stockColumns"
import { getAllStock } from "@/app/server-aciton/stock/getAllStock"
import { getShoppingCart } from "@/app/server-aciton/shopping/cart/getShoppingCart"

 
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

const StockPage = async () => {

  const data = await getData()
  const cartsResponse = await getShoppingCart()
  const carts = cartsResponse.data || []

  return (
    <div className="container mx-auto py-10">
      <StockDataTable columns={stockColumns} data={data} carts={carts} />
    </div>
  )
}

export default StockPage