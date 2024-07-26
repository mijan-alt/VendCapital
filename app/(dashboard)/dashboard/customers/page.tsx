import { Breadcrumbs } from '@/components/breadcrumbs';
import { CustomerClient } from '@/components/tables/customers-tables/CustomerClient';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Customer', link: '/dashboard/customers' }
];

export default async function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <CustomerClient />
      </div>
    </>
  );
}
