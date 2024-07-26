// app/dashboard/user/edit-role//page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useSearchParams } from 'next/navigation';

export default function EditUserRole() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userData = JSON.parse(
    decodeURIComponent(searchParams.get('userData') || '{}')
  );

  const [role, setRole] = useState(userData.role || '');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (e: any) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await axios.patch(`/api/users/${userData.userId}/role`, {
        role
      });
      if (response.status == 200) {
        setLoading(false);
        router.push('/dashboard/user');
        router.refresh(); // This will trigger a refresh of the user list
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setLoading(false);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block text-sm  font-bold text-gray-700 text-muted-foreground">
            Name
          </label>
          <input
            type="text"
            name="lastName"
            value={userData?.username}
            readOnly
            className="w-full rounded-lg border px-3 py-2 text-sm text-muted-foreground"
          />
        </div>
        <div className="">
          <select
            value={role}
            onChange={handleRoleChange}
            className="mb-4 w-full rounded-lg border px-3 py-2 text-sm text-muted-foreground"
          >
            <option value="user">User</option>
            <option value="Admin">Admin</option>
            <option value="Business Manager">Business Manager</option>
            <option value="Super Admin">Super Admin</option>
          </select>
          <Button disabled={loading} type="submit">
            Update Role
          </Button>
        </div>
      </form>
    </div>
  );
}
