"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Stock } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import AddButton from "@/components/button/AddButton";
import StockForm from "./StockForm";
import AddStockDialog from "./AddStockDialog";
import { ShoppingCartWithItems } from "@/app/server-aciton/shopping/cart/getShoppingCart";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  carts: ShoppingCartWithItems[],
  initialPage? :number;
}

export function StockDataTable<TData extends Stock, TValue>({
  columns,
  data,
  carts,
  initialPage = 0,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [rowSelection, setRowSelection] = useState({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const [pagination, setPagination] = useState({
    pageIndex: initialPage,
    pageSize: 10,
  })


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination,
    },
    onRowSelectionChange: setRowSelection,
    meta: {
      carts,
    },
  });

  useEffect(() => {
    const page = Number(searchParams.get("page") || "0");
    setPagination((prev) => ({
      ...prev,
      pageIndex: page,
    }))
  },[searchParams])

  const handlePageChange = (newPageIndex: number) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPageIndex,
    }))
    router.push(`?page=${newPageIndex}`);
  }

  return (
    <div>
      <div className="flex items-center justify-center py-4 gap-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="flex-1"
        />
        <AddButton>
          {(setIsDialogOpen) => <StockForm setIsDialogOpen={setIsDialogOpen} />}
        </AddButton>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${
                    row.original.quantity !== null &&
                    row.original.quantity < (row.original.minQuantity ?? 0)
                      ? "bg-red-100"
                      : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button
            disabled={!table.getCanPreviousPage()}
            // onClick={() => table.previousPage()}
            onClick={() => handlePageChange(pagination.pageIndex - 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-slate-400"
          >
            prev
          </Button>
          <Button
            disabled={!table.getCanNextPage()}
            // onClick={() => table.nextPage()}
            onClick={() => handlePageChange(pagination.pageIndex + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-slate-400"
          >
            next
          </Button>
        </div>
        <AddStockDialog table={table} />
      </div>
    </div>
  );
}
