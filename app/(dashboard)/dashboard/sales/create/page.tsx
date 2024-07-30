import { Breadcrumbs } from '@/components/breadcrumbs';

import AddSales from '@/components/forms/AddSales';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Sales', link: '/dashboard/sales' },
  { title: 'Create', link: '/dashboard/sales/create' }
];
export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <AddSales />
      </div>
    </ScrollArea>
  );
}
