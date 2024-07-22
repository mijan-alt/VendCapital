'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { User } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<User>[] = [
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
    accessorKey: 'username',
    header: 'NAME',
    accessorFn: (row) => {
      if (row.firstName || row.lastName) {
        return `${row.firstName || ''} ${row.lastName || ''}`.trim();
      }
      return row.username;
    }
  },
  {
    accessorKey: 'email',
    header: 'EMAIL'
  },
  {
    accessorKey: 'business',
    header: 'BUSINESS'
  },
  {
    accessorKey: 'role',
    header: 'ROLE'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
