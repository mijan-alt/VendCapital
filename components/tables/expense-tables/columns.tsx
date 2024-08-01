'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { Expense } from '@/constants/data';
import { formatCurrency } from '@/utils/formatCurrency';

export const columns: ColumnDef<Expense>[] = [
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
    accessorKey: '_id',
    header: 'REFERENCE'
  },
  {
    accessorKey: 'createdAt',
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
    accessorKey: 'category',
    header: 'CATEGORY'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
