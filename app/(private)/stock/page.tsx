import { StockDataTable } from "@/app/(private)/stock/components/stockData-table"
import { Stock } from "@prisma/client"
import { stockColumns } from "./components/stockColumns"
import { getAllStock } from "@/app/server-aciton/stock/getAllStock"

 
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

  return (
    <div className="container mx-auto py-10">
      <StockDataTable columns={stockColumns} data={data} />
    </div>
  )
}

export default StockPage