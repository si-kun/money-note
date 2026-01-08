import { ShoppingHistoryWithItems } from "@/app/server-aciton/shopping/history/getShoppingHistory"
import { SummayHistoryDataTable } from "./SummaryHistoryData-table"
import { historyColumns } from "../shopping/history/components/historyColumn"
 
interface HistoryDetailProps {
    data: ShoppingHistoryWithItems
}

const HistoryDetail = ({data}:HistoryDetailProps) => {
    
 
    return (
      <div className="container mx-auto py-10 flex flex-col gap-5">
        <SummayHistoryDataTable columns={historyColumns} data={data.items} />
        <span className="ml-auto">合計金額:¥{data.totalPrice}</span>
      </div>
    )
}

export default HistoryDetail