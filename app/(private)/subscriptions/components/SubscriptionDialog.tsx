import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import SubscriptionForm from "./SubscriptionForm";

const SubscriptionDialog = () => {
  return (
    <DialogContent className="w-full">
      <DialogHeader>
        <DialogTitle>{row.name}</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
      <SubscriptionForm
        formMethods={formMethods}
        submitSubscription={handleEditing}
        handleCancel={handleCancel}
        startOpen={startOpen}
        setStartOpen={setStartOpen}
        endOpen={endOpen}
        setEndOpen={setEndOpen}
        submitButtonText={buttonText}
      />
    </DialogContent>
  );
};

export default SubscriptionDialog;
