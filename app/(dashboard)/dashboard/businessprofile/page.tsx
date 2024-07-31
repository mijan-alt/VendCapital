import { Breadcrumbs } from '@/components/breadcrumbs';
import AddBusinessForm from '@/components/forms/addBusiness';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Business', link: '/dashboard/business' }
];

export default async function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <AddBusinessForm />
      </div>
    </ScrollArea>
  );
}
