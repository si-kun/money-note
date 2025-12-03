import AppSidebar from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface layoutProps {
  children: React.ReactNode;
}
const layout = ({ children }: layoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="p-10 h-screen w-screen overflow-hidden">{children}</div>
    </SidebarProvider>
  );
};

export default layout;
