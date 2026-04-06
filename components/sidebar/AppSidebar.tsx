import { CircleUser } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { getAuthUserWithProfile } from "@/lib/supabase/getAuthUserWithProfile";
import LogoutButton from "@/app/(auth)/components/LogoutButton";
import SidebarLink from "./SidebarLink";
import MobileSidebarClose from "./MobileSidebarClose";

const AppSidebar = async () => {
  const userProfile = await getAuthUserWithProfile();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <MobileSidebarClose />
          </div>
          <SidebarGroupContent>
            <SidebarLink />
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
