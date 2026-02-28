"use client";

import {
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { Stock, StockCategory } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import AddButton from "@/components/button/AddButton";
import StockForm from "./StockForm";
import AddStockDialog from "./AddStockDialog";
import { getStockColumns } from "./stockColumns";
import { ShoppingCartWithItems } from "@/app/types/shopping/shopping";

interface DataTableProps<TData> {
  stocks: TData[];
  carts: ShoppingCartWithItems[];
  categories: StockCategory[];
  initialPage?: number;
}

export function StockDataTable<TData extends Stock>({
  stocks,
  carts,
  categories,
  initialPage = 0,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [rowSelection, setRowSelection] = useState({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const [pagination, setPagination] = useState({
    pageIndex: initialPage,
    pageSize: 10,
  });

  const columns = getStockColumns(categories);

  const table = useReactTable({
    data: stocks,
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
      categories,
    },
  });

  useEffect(() => {
    const page = Number(searchParams.get("page") || "0");
    setPagination((prev) => ({
      ...prev,
      pageIndex: page,
    }));
  }, [searchParams]);

  const handlePageChange = (newPageIndex: number) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPageIndex,
    }));
    router.push(`?page=${newPageIndex}`);
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-center py-4 gap-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="flex-1"
        />
        <Select
          defaultValue="all"
          value={table.getColumn("stockCategory")?.getFilterValue() as string}
          onValueChange={(value) => {
            if (value === "all") {
              table.getColumn("stockCategory")?.setFilterValue(undefined);
              return;
            }
            table.getColumn("stockCategory")?.setFilterValue(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="カテゴリー" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <AddButton
          title="新しい在庫を追加"
          description="在庫の詳細を入力して、新しい在庫を追加します。"
        >
          {(setIsDialogOpen) => <StockForm setIsDialogOpen={setIsDialogOpen} categories={categories} />}
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
            onClick={() => handlePageChange(pagination.pageIndex - 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-slate-400"
          >
            prev
          </Button>
          <Button
            disabled={!table.getCanNextPage()}
            onClick={() => handlePageChange(pagination.pageIndex + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-slate-400"
          >
            next
          </Button>
        </div>
        <AddStockDialog table={table} carts={carts} />
      </div>
    </div>
  );
}
