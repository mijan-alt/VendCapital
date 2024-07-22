'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import EditSettings from '@/components/forms/EditSettings';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Settings', link: '/dashboard/settings' },
  { title: 'update', link: '/dashboard/customers/edit' }
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <EditSettings />
      </div>
    </>
  );
}
