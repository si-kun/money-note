"use client"

import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
} from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import Link from "next/link";

const SidebarLink = () => {
  // Menu items.
  const items = [
    {
      title: "ホーム",
      url: "/",
      icon: Home,
    },
    {
      title: "収支グラフ",
      url: "/statistics",
      icon: Inbox,
    },
    {
      title: "サブスク",
      url: "/subscriptions",
      icon: Calendar,
    },
    {
      title: "在庫管理",
      url: "/stock",
      icon: Search,
    },
    {
      title: "買い物",
      url: "/shopping/cart",
      icon: Settings,
    },
  ];

  const {setOpenMobile} = useSidebar()

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton onClick={() => setOpenMobile(false)} asChild>
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarLink;
