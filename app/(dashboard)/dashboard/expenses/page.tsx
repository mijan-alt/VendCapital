import { Breadcrumbs } from '@/components/breadcrumbs';
import { ExpenseClient } from '@/components/tables/expense-tables/expense';
import { expenses } from '@/constants/data';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Expense', link: '/dashboard/expenses' }
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ExpenseClient data={expenses} />
      </div>
    </>
  );
}
