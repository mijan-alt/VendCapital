'use client';
import React from 'react';
import { AreaGraph } from '@/components/charts/area-graph';
import { BarGraph } from '@/components/charts/bar-graph';
import { PieGraph } from '@/components/charts/pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Overview } from '@/components/overview';
import { RecentSales } from '@/components/recent-sales';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useMemo } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { TotalExpensesCard } from './cards/TotalExpenseCard';
import { TotalSalesCard } from './cards/TotalSalesCard';
import RecentSalesCard from './cards/RecentSales';

const Welcomeback = () => {
  const { data: session } = useSession();
  const firstName = session?.user.name ? session.user.name.split(' ')[0] : '';
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {` Hi, Welcome back ${firstName}`}
        </h2>
        <div className="hidden items-center space-x-2 md:flex">
          <CalendarDateRangePicker />
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <TotalSalesCard />
            <TotalExpensesCard />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <BarGraph />
            </div>

            <RecentSalesCard />

            <div className="col-span-4">
              <AreaGraph />
            </div>
            <div className="col-span-4 md:col-span-3">
              <PieGraph />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Welcomeback;
