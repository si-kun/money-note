import { Button } from "@/components/ui/button"
import { Subscription } from "@prisma/client"
import { Column, SortDirection } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

interface HeaderButtonProps {
    column: Column<Subscription>
    text: string
    isSorted? :boolean | SortDirection
}

const HeaderButton = ({column,text,isSorted}:HeaderButtonProps) => {
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