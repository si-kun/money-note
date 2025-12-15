import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Ellipsis } from "lucide-react";
import { Row } from "@tanstack/react-table";

interface ActionsCellProps<T> {
  row: Row<T>;
  onClickDelete?: () => void;
  children: (props: {
    row: Row<T>;
    setIsDialogOpen: (open: boolean) => void;
  }) => React.ReactNode;
}

const ActionsCell = <T extends { name: string }>({
  row,
  onClickDelete,
  children,
}: ActionsCellProps<T>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setIsDropdownOpen(false);
    }
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="text-red-600" onClick={onClickDelete}>
          delete
        </DropdownMenuItem>

        <Dialog
          open={isDialogOpen}
          onOpenChange={handleDialogChange}
        >
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>{row.original.name}</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            {children({ row, setIsDialogOpen: handleDialogChange })}
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsCell;
