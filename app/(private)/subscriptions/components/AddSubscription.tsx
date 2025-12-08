import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import SubscriptionForm from "./SubscriptionForm";
import { useForm } from "react-hook-form";
import { SubscriptionFormType } from "@/app/types/zod/subscription";
import { useState } from "react";
import { addSubscriptions } from "@/app/server-aciton/subscription/addSubscriptions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AddSubscription = () => {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const formMethods = useForm<SubscriptionFormType>({
    defaultValues: {
      name: "",
      monthlyPrice: 0,
      startDate: new Date(),
      endDate: null,
    },
  });

  const {
    reset,
    formState: { isValid },
  } = formMethods;

  const handleCancel = () => {
    setIsDialogOpen(false);
    reset();
  };

  const handleAdding = async (data: SubscriptionFormType) => {
    try {
      const result = await addSubscriptions(data);

      if (result.success) {
        setIsDialogOpen(false);
        toast.success(result.message);
        reset();
        router.refresh();
      }
    } catch (error) {
      console.error("Error adding subscription:", error);
    }
  };

  const buttonText = isValid ? "追加する" : "入力必須項目があります";

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="bg-green-500 hover:bg-green-400"
        >
          新規追加
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <SubscriptionForm
          formMethods={formMethods}
          startOpen={startOpen}
          setStartOpen={setStartOpen}
          endOpen={endOpen}
          setEndOpen={setEndOpen}
          handleCancel={handleCancel}
          submitButtonText={buttonText}
          submitSubscription={handleAdding}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscription;
