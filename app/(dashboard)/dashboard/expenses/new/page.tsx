import { Breadcrumbs } from '@/components/breadcrumbs';
import ExpenseForm from '@/components/forms/ExpenseForm';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Expenses', link: '/dashboard/expenses' },
  { title: 'New', link: '/dashboard/expenses/new' }
];
export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ExpenseForm />
      </div>
    </ScrollArea>
  );
}
