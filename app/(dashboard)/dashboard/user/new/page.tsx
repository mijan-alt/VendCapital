import { Breadcrumbs } from '@/components/breadcrumbs';

import { AddAdmin } from '@/components/forms/user-profile-stepper/add-admin';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'User', link: '/dashboard/user' },
  { title: 'New', link: '/dashboard/user/new' }
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <AddAdmin />
      </div>
    </>
  );
}
