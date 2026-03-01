"use client"

import { ShoppingCartItemWithStock } from "@/app/types/shopping/shopping";
import { ShoppingCartItemTable } from "./shoppingCartData-table";
import { columns } from "./shoppingColumns";

interface NormalCartTableProps {
  items: ShoppingCartItemWithStock[];
}

const NomalCartTable = ({ items }: NormalCartTableProps) => {
  return <ShoppingCartItemTable items={items} columns={columns} />;
};

export default NomalCartTable;
