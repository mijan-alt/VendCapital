import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import type { Metadata } from 'next';
import { ExpenseAnalyticsProvider } from '@/app/context/ExpenseContext';
import { SalesAnalyticsProvider } from '@/app/context/SalesContext';

export const metadata: Metadata = {
  title: 'Vend Capital',
  description: 'A dashboard for managing customers and business'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <SalesAnalyticsProvider>
          <ExpenseAnalyticsProvider>
            <main className="flex-1 overflow-hidden pt-16">{children}</main>
          </ExpenseAnalyticsProvider>
        </SalesAnalyticsProvider>
      </div>
    </>
  );
}
