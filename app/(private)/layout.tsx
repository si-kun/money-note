import AppSidebar from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface layoutProps {
  children: React.ReactNode;
}
const layout = ({ children }: layoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="p-6 h-screen w-screen flex items-center justify-center overflow-hidden">{children}</div>
    </SidebarProvider>
  );
};

export default layout;
