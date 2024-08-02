'use client';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { Expense } from '@/constants/data';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from './ExpenseTable';

export const ExpenseClient = () => {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const perPage = 5;
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/expenses/all?page=${page}&perPage=${perPage}`
      );
      if (res.status === 200) {
        const modifiedExpense = res.data.expenses.map(
          (expense: Expense, index: number) => ({
            ...expense,
            id: index
          })
        );
        setExpenses(modifiedExpense);
        setTotalPage(res.data.totalPages);
        setCount(res.data.count);
        setLoading(false);
      }
    } catch (error) {
      console.error('error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [page]);

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
        data={expenses}
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
