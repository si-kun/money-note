import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface AddButtonProps {
    children: (setIsDialogOpen: (open: boolean) => void) => React.ReactNode;
    title: string;
    description: string;
}

const AddButton = ({children,title,description}:AddButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="hover:bg-green-300">
          新規登録
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        {children(setIsDialogOpen)}
      </DialogContent>
    </Dialog>
  );
};
export default AddButton