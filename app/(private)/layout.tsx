import AppSidebar from "@/components/sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getAllStock } from "../server-action/stock/getAllStock";
import { handleStockCartSyncBatch } from "../server-action/stock/handleStockCartSyncBatch";

interface layoutProps {
  children: React.ReactNode;
}
const layout = async ({ children }: layoutProps) => {
  const stockResponse = await getAllStock();
  const stocks = stockResponse.data || [];

  if (stocks.length > 0) {
    await handleStockCartSyncBatch(stocks);
  }

  return (
    <SidebarProvider>
      <header className="fixed top-0 left-0 z-50 flex h-12 w-full items-center bg-blue-200 px-4 lg:hidden">
        <SidebarTrigger />
      </header>
      <AppSidebar />
      <div className="p-4 lg:p-6 lg:h-screen w-full flex items-start justify-center pt-16 lg:pt-4 xl:overflow-hidden">
        {children}
      </div>
    </SidebarProvider>
  );
};

export default layout;
