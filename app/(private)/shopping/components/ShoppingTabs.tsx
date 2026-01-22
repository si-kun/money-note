"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

interface ShoppingTabsProps {
  children: React.ReactNode;
}

const ShoppingTabs = ({ children }: ShoppingTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = pathname.includes("/history") ? "history" : "cart";


  const handleTabChange = (value: string) => {
    if (value === 'cart') {
      router.push('/shopping/cart');
    } else {
      router.push('/shopping/history');
    }
  };

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="flex flex-col h-full"
    >
      <TabsList className="w-full shrink-0">
        <TabsTrigger value="cart" className="flex-1">
          カート
        </TabsTrigger>
        <TabsTrigger value="history" className="flex-1">
          履歴
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default ShoppingTabs;
