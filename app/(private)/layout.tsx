import AppSidebar from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllStock } from "../server-aciton/stock/getAllStock";
import { handleStockCartSyncBatch } from "../server-aciton/stock/handleStockCartSyncBatch";

interface layoutProps {
  children: React.ReactNode;
}
const layout = async ({ children }: layoutProps) => {

  console.log("layout: Syncing stock with carts...");

  const stockResponse = await getAllStock();
  const stocks = stockResponse.data || []

  if(stocks.length > 0) {
    await handleStockCartSyncBatch(stocks);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="p-6 h-screen w-screen flex items-center justify-center overflow-hidden">{children}</div>
    </SidebarProvider>
  );
};

export default layout;
