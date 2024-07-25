'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { Expense } from '@/constants/data';
import { useState } from 'react';

interface ExpenseClientProps {
  data: Expense[];
}

export const ExpenseClient: React.FC<ExpenseClientProps> = ({ data }) => {
  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Expense', link: '/dashboard/expenses' },
    { title: 'Expense', link: '/dashboard/expenses/new' }
  ];
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const perPage = 5;
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const nextPage = () => {
    console.log('hit nextpage');
    if (page < totalPage) {
      setPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Expenses`} description="" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/expenses/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={data}
        previousPage={previousPage}
        nextPage={nextPage}
        totalPage={totalPage}
        count={count}
        page={page}
        loading={loading}
      />
    </>
  );
};
