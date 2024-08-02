'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './select';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from './input';
import { Button } from './button';
import { ScrollArea, ScrollBar } from './scroll-area';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  previousPage: () => void;
  nextPage: () => void;
  totalPage: number;
  count: number;
  page: number;
  loading: boolean;
  statusFilter: string;
  setStatusFilter;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  previousPage,
  nextPage,
  totalPage,
  count,
  page,
  loading,
  statusFilter,
  setStatusFilter
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  /* this can be used to get the selectedrows 
  console.log("value", table.getFilteredSelectedRowModel()); */

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Input
          placeholder={`Search ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="w-full md:max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            {!loading ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
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
                  {Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="py-3 ps-4">
                        <div className="flex h-5 items-center">
                          <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="px-6 py-2">
                          <div className="block h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="px-6 py-2">
                          <div className="block h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      </td>
                      <td className="h-px w-72 min-w-72">
                        <div className="px-6 py-2">
                          <p className="line-clamp-2 w-full rounded bg-gray-200 text-sm text-gray-500 dark:bg-gray-700"></p>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="px-6 py-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium dark:bg-gray-700"></span>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="px-6 py-3">
                          <span className="inline-flex items-center gap-x-1 rounded-full bg-gray-200 px-1.5 py-1 text-xs font-medium dark:bg-gray-700"></span>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="flex -space-x-2 px-6 py-2">
                          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="px-6 py-2">
                          <div className="hs-dropdown relative inline-block [--placement:bottom-right]">
                            <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {page} of {totalPage}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => previousPage()}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => nextPage()}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
