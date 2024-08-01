'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { RecentSales } from '../recent-sales';
import { useSalesAnalytics } from '@/app/context/SalesContext';

const RecentSalesCard = () => {
  const { analyticsData, timeFrame, setTimeFrame, isLoading } =
    useSalesAnalytics();
  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>{analyticsData?.salesCount}</CardDescription>
      </CardHeader>
      <CardContent>
        <RecentSales sales={analyticsData?.recentSales} loading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default RecentSalesCard;
