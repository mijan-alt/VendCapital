'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Invoice } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/utils/formatCurrency';

export const columns: ColumnDef<Invoice>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL'
  },
  {
    accessorKey: 'reference',
    header: 'REFERENCE'
  },
  {
    accessorKey: 'date',
    header: 'DATE'
  },
  {
    accessorKey: 'amount',
    header: 'AMOUNT',
    accessorFn: (row) => {
      return formatCurrency(row.amount);
    }
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => (
      <span
        className={
          row.original.status === 'paid'
            ? 'rounded-lg bg-green-500 p-1 text-white'
            : 'rounded-lg bg-yellow-500 p-2 text-white'
        }
      >
        {row.original.status}
      </span>
    )
  },
  {
    accessorKey: 'product',
    header: 'PRODUCT'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
