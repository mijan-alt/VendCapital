'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import UserProfileSettings from '@/components/forms/settings';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Settings', link: '/dashboard/settings' }
];
export default function page() {
  return (
    <ScrollArea>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <UserProfileSettings />
      </div>
    </ScrollArea>
  );
}
