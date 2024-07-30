'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProductForm } from '@/components/forms/product-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Products', link: '/dashboard/products' }
];

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    // Fetch the product data if we are editing an existing product
    axios
      .get(`/api/products/single-product/${id}`)
      .then((response) => {
        setInitialData(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch product', error);
      });
  }, [id]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs
          items={[
            ...breadcrumbItems,
            { title: 'Edit', link: `/dashboard/products/${id}` }
          ]}
        />
        <ProductForm
          categories={[
            { _id: 'books', name: 'Books' },
            { _id: 'electronics', name: 'Electronics' },
            { _id: 'clothing', name: 'Clothing' },
            { _id: 'food', name: 'Food' }
          ]}
          initialData={initialData}
          productId={id as string}
        />
      </div>
    </ScrollArea>
  );
};

export default EditProductPage;
