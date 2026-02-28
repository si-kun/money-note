import {
  Calendar,
  CircleUser,
  Home,
  Inbox,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { getAuthUserWithProfile } from "@/lib/supabase/getAuthUserWithProfile";
import LogoutButton from "@/app/(auth)/components/LogoutButton";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Statistics",
    url: "/statistics",
    icon: Inbox,
  },
  {
    title: "Subscriptions",
    url: "/subscriptions",
    icon: Calendar,
  },
  {
    title: "Stock",
    url: "/stock",
    icon: Search,
  },
  {
    title: "shopping",
    url: "/shopping/cart",
    icon: Settings,
  },
];

const AppSidebar = async() => {

  const userProfile = await getAuthUserWithProfile()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton className="flex items-center gap-2 hover:cursor-pointer">
            <CircleUser />
            <span>{userProfile.userName}</span>
          </SidebarMenuButton>
            <LogoutButton />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
