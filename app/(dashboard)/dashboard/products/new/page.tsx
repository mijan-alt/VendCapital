import React from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProductForm } from '@/components/forms/product-form';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Products', link: '/dashboard/products' },
  { title: 'Create', link: '/dashboard/products/new' }
];

export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ProductForm
          categories={[
            { _id: 'books', name: 'Books' },
            { _id: 'electronics', name: 'Electronics' },
            { _id: 'clothing', name: 'Clothing' },
            { _id: 'food', name: 'Food' }
          ]}
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
