import { Button } from "@/components/ui/button"
import { Column, SortDirection } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

interface HeaderButtonProps<TData> {
    column: Column<TData, unknown>
    text: string
    isSorted? :boolean | SortDirection
}

const HeaderButton = <TData,>({column,text,isSorted}:HeaderButtonProps<TData>) => {
  return (
    <Button className={`${isSorted ? "bg-blue-400 text-white" : ""}`} variant={"ghost"}
    onClick={() => column.toggleSorting (column.getIsSorted() === "asc")}
    >
      {text}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}

export default HeaderButton