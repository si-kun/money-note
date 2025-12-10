import { Subscription } from "@prisma/client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getAllSubscription } from "@/app/server-aciton/subscription/getAllSubscription";

const SubscriptionPage = async () => {
  async function getData(): Promise<Subscription[]> {
    // Fetch data from your API here.
    try {
      const result = await getAllSubscription();
      if (result.success) {
        return result.data;
      } else {
        console.error("Failed to fetch subscriptions:", result.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      return [];
    }
  }

  const data = await getData();

  return (
    <div className="container mx-auto py-10 h-full">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default SubscriptionPage;
