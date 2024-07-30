'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { invoices } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { Invoice } from '@/constants/data';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface SalesProps {
  data: Invoice[];
}

export const Sales = () => {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const perPage = 5;
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [invoice, setInvoice] = useState<Invoice[]>([]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/sales/paginated?page=${page}&perPage=${perPage}`
      );
      if (res.status === 200) {
        console.log('response data', res.data);

        const salesdata = res.data.sales.map((sale, index) => {
          return {
            reference: sale._id,
            id: index,
            name: sale.customer.name,
            email: sale.customer.email,
            amount: sale.totalPrice,
            date: sale.createdAt,
            status: sale.status
          };
        });
      }
    } catch (error) {
      console.error('error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

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
        <Heading title={`Sales`} description="" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/sales/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add sales
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={invoices}
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
