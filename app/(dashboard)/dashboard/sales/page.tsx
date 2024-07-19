import { Breadcrumbs } from '@/components/breadcrumbs';
import { Sales } from '@/components/tables/sales-table/sales';
import { invoices } from '@/constants/data';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Sales', link: '/dashboard/sales' }
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <Sales data={invoices} />
      </div>
    </>
  );
}
