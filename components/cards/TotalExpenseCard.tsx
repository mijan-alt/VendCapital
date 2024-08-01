import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useExpenseAnalytics } from '@/app/context/ExpenseContext';

export function TotalExpensesCard() {
  const { analyticsData, timeFrame, setTimeFrame, isLoading } =
    useExpenseAnalytics();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        <Select value={timeFrame} onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1w">Last week</SelectItem>
            <SelectItem value="2w">Last 2 weeks</SelectItem>
            <SelectItem value="1m">Last month</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading
            ? 'Loading...'
            : analyticsData
            ? formatCurrency(analyticsData.totalExpense)
            : 'N/A'}
        </div>
        <p className="text-xs text-muted-foreground">
          {isLoading
            ? 'Calculating...'
            : analyticsData
            ? `${analyticsData.percentageChange > 0 ? '+' : ''}${
                analyticsData.percentageChange
              }% from previous period`
            : 'N/A'}
        </p>
      </CardContent>
    </Card>
  );
}
