'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from 'react';

type TimeFrame = '1w' | '2w' | '1m' | '3m';

interface AnalyticsData {
  totalExpense: number;
  expensesCount: number;
  percentageChange: number;
  expensesByDate: { date: string; amount: number }[];
}

interface ExpenseAnalyticsContextType {
  analyticsData: AnalyticsData | null;
  timeFrame: TimeFrame;
  setTimeFrame: (timeFrame: TimeFrame) => void;
  isLoading: boolean;
  refreshExpenseData;
}

const ExpenseAnalyticsContext = createContext<
  ExpenseAnalyticsContextType | undefined
>(undefined);

export const useExpenseAnalytics = () => {
  const context = useContext(ExpenseAnalyticsContext);
  if (!context) {
    throw new Error(
      'useExpenseAnalytics must be used within an ExpenseAnalyticsProvider'
    );
  }
  return context;
};

interface ExpenseAnalyticsProviderProps {
  children: ReactNode;
}

export const ExpenseAnalyticsProvider: React.FC<
  ExpenseAnalyticsProviderProps
> = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1w');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    const endDate = new Date();
    let startDate = new Date();

    switch (timeFrame) {
      case '1w':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '2w':
        startDate.setDate(endDate.getDate() - 14);
        break;
      case '1m':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
    }

    try {
      const response = await fetch(
        `/api/expenses/analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [timeFrame, refreshTrigger, fetchAnalytics]);

  const refreshExpenseData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <ExpenseAnalyticsContext.Provider
      value={{
        analyticsData,
        timeFrame,
        setTimeFrame,
        isLoading,
        refreshExpenseData
      }}
    >
      {children}
    </ExpenseAnalyticsContext.Provider>
  );
};
