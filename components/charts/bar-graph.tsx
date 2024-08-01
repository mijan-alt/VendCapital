'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useSalesAnalytics } from '@/app/context/SalesContext';
import { useMemo } from 'react';

export const description = 'An interactive bar chart';

const chartConfig = {
  views: {
    label: 'Sales Amount', // Update label
    color: 'hsl(var(--chart-1))'
  }
};

export function BarGraph() {
  const { analyticsData, isLoading } = useSalesAnalytics();

  const salesData = React.useMemo(() => {
    if (!analyticsData) return [];
    return analyticsData.salesByDate.map((sale) => ({
      date: sale.date,
      salesAmount: sale.amount
    }));
  }, [analyticsData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getPeriodDescription = () => {
    // Logic to determine the period based on analyticsData
    if (!analyticsData || !analyticsData.salesByDate.length) {
      return 'No sales data available';
    }

    const startDate = new Date(analyticsData.salesByDate[0].date);
    const endDate = new Date(
      analyticsData.salesByDate[analyticsData.salesByDate.length - 1].date
    );

    const startMonth = startDate.toLocaleDateString('en-US', {
      month: 'short'
    });
    const startDay = startDate.getDate();
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    const endDay = endDate.getDate();

    if (startMonth === endMonth) {
      return `Sales from ${startDay} to ${endDay} ${startMonth}`;
    } else {
      return `Sales from ${startDay} ${startMonth} to ${endDay} ${endMonth}`;
    }
  };

  const periodDescription = getPeriodDescription();

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Sales</CardTitle>
          <CardDescription>{periodDescription}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={salesData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="salesAmount"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey="salesAmount" fill={chartConfig.views.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
