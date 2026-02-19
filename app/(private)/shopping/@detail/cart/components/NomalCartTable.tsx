"use client"

import { ShoppingCartItemTable } from "./shoppingCartData-table";
import { columns, ShoppingCartItemWithStock } from "./shoppingColumns";

interface NormalCartTableProps {
  items: ShoppingCartItemWithStock[];
}

const NomalCartTable = ({ items }: NormalCartTableProps) => {
  return <ShoppingCartItemTable items={items} columns={columns} />;
};

export default NomalCartTable;
