"use client"

import {
  CalendarRange,
  ChartColumn,
  Package,
  ShoppingCart,
  Subscript,
} from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import Link from "next/link";

  // Menu items.
  const items = [
    {
      title: "ホーム",
      url: "/",
      icon: CalendarRange,
    },
    {
      title: "収支グラフ",
      url: "/statistics",
      icon: ChartColumn,
    },
    {
      title: "サブスク",
      url: "/subscriptions",
      icon: Subscript,
    },
    {
      title: "在庫管理",
      url: "/stock",
      icon: Package,
    },
    {
      title: "買い物",
      url: "/shopping/cart",
      icon: ShoppingCart,
    },
  ];

const SidebarLink = () => {


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
