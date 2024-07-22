// app/dashboard/user/edit-role/[userId]/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function EditUserRole({ params, searchParams }) {
  const router = useRouter();
  const { userId } = params;
  console.log(userId, 'userId');
  const [role, setRole] = useState(searchParams.currentRole || '');

  const handleRoleChange = (e: any) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/users/${userId}/role`, { role });
      router.push('/dashboard/user');
      router.refresh(); // This will trigger a refresh of the user list
    } catch (error) {
      console.error('Error updating role:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row space-x-2">
          <select
            value={role}
            onChange={handleRoleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm text-muted-foreground"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
          <Button type="submit">Update Role</Button>
        </div>
      </form>
    </div>
  );
}
