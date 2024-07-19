import { Breadcrumbs } from '@/components/breadcrumbs';

import AddCustomer from '@/components/forms/user-profile-stepper/add-customer';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Customers', link: '/dashboard/customers' },
  { title: 'New', link: '/dashboard/customers/new' }
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <AddCustomer />
      </div>
    </>
  );
}
