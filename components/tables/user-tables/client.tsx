'use client';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { User } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { DataTable } from './UserTable';

export const UserClient = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const perPage = 5;
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  console.log(session, 'session in client.tsx');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/users?page=${page}&perPage=${perPage}`);
      if (res.status === 200) {
        const usersWithId = res.data.user.map((user: User, index: number) => ({
          ...user,
          id: index
        }));
        setUsers(usersWithId);
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
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log('this effect is running');
    fetchUsers();
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

  console.log('my users', users);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Manage Administrators`} description="" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/user/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Admin
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={users}
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
