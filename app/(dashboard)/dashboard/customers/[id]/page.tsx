'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useState, useEffect } from 'react';
import AddCustomer from '@/components/forms/user-profile-stepper/add-customer';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Customers', link: '/dashboard/customers' }
];
export default function EditCustomer() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    // Fetch the product data if we are editing an existing product
    axios
      .get(`/api/customers/single-customer/${id}`)
      .then((response) => {
        setInitialData(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch product', error);
      });
  }, [id]);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs
          items={[
            ...breadcrumbItems,
            { title: 'Edit', link: `/dashboard/customers/${id}` }
          ]}
        />
        <AddCustomer initialData={initialData} id={id as string} />
      </div>
    </>
  );
}
