import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getAllSubscription } from "@/app/server-aciton/subscription/getAllSubscription";

export const dynamic = "force-dynamic";

const SubscriptionPage = async () => {

  const resultSubscriptions = await getAllSubscription();

  const data = resultSubscriptions.success ? resultSubscriptions.data : [];
  const errorMessage = resultSubscriptions.success ? null : resultSubscriptions.message;

  return (
    <div className="container h-full">
      <DataTable columns={columns} data={data} errorMessage={errorMessage} />
    </div>
  );
};

export default SubscriptionPage;
