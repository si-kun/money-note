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
    icon: React.ReactNode
}

const AddDialog = ({children,title,description,icon}:AddButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="hover:bg-green-300">
          <span className="lg:hidden">{icon}</span>
          <span className="hidden lg:block">新規作成</span>
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
export default AddDialog;