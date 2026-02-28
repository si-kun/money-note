import { ShoppingHistoryWithItems } from "@/app/types/shopping/shopping"
import { SummayHistoryDataTable } from "../summary/SummaryHistoryData-table"
import { historyColumns } from "@/app/(private)/shopping/@detail/history/components/historyColumn"
 
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