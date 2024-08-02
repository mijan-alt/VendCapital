'use client';
import { Button } from '@/components/ui/button';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Customer } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Actions } from '@/constants/data';
import { DataTable } from './CustomerTable';

// interface CustomerClientProps {
//   data: Customer[];
// }

export const CustomerClient = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const perPage = 5;
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const router = useRouter();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/customers?page=${page}&perPage=${perPage}`
      );
      if (res.status === 200) {
        console.log('response data', res.data);

        const customersWithId = res.data.customers.map(
          (customer: Customer, index: number) => ({
            ...customer,
            id: index
          })
        );
        setCustomers(customersWithId);
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
    fetchCustomers();
  }, []);

  useEffect(() => {
    console.log('this effect is running');
    fetchCustomers();
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
        <Heading title={`Customers`} description="" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/customers/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add customer
        </Button>
      </div>
      <Separator />

      <DataTable
        searchKey="name"
        columns={columns}
        data={customers}
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
