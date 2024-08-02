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

import { useMemo } from 'react';

import { useExpenseAnalytics } from '@/app/context/ExpenseContext';

const chartConfig = {
  views: {
    label: 'Expense Amount', // Update label
    color: 'hsl(var(--chart-1))'
  }
};
export function LineGraph() {
  const { analyticsData, isLoading } = useExpenseAnalytics();

  const expenseData = React.useMemo(() => {
    if (!analyticsData) return [];
    return analyticsData.expensesByDate.map((expense) => ({
      date: expense.date,
      expense: expense.amount
    }));
  }, [analyticsData]);

  const getPeriodDescription = () => {
    // Logic to determine the period based on analyticsData
    if (!analyticsData || !analyticsData.expensesByDate.length) {
      return 'No sales data available';
    }

    const startDate = new Date(analyticsData.expensesByDate[0].date);
    const endDate = new Date(
      analyticsData.expensesByDate[analyticsData.expensesByDate.length - 1].date
    );

    const startMonth = startDate.toLocaleDateString('en-US', {
      month: 'short'
    });
    const startDay = startDate.getDate();
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    const endDay = endDate.getDate();

    if (startMonth === endMonth) {
      return `Expenses from ${startDay} to ${endDay} ${startMonth}`;
    } else {
      return `Expenses from ${startDay} ${startMonth} to ${endDay} ${endMonth}`;
    }
  };

  const periodDescription = getPeriodDescription();

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            data={expenseData}
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
                  nameKey="expense"
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
            <Bar dataKey="expense" fill={chartConfig.views.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
