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
      <AppSidebar />
      <div className="p-4 lg:p-6 lg:h-screen w-screen flex items-start justify-center mt-12 lg:mt-0 xl:overflow-hidden">
        <header className="bg-blue-200 fixed top-0 left-0 w-full p-4 h-12 flex items-center  lg:hidden">
          <SidebarTrigger />
        </header>
        {children}
      </div>
    </SidebarProvider>
  );
};

export default layout;
