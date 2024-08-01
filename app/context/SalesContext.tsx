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

interface SaleData {
  _id: string;
  customer: {
    name: string;
    email: string;
  };
  totalPrice: number;
  createdAt: string;
}

interface AnalyticsData {
  totalSales: number;
  salesCount: number;
  percentageChange: number;
  salesByDate: { date: string; amount: number }[];
  recentSales: SaleData[];
}

interface SalesAnalyticsContextType {
  analyticsData: AnalyticsData | null;
  timeFrame: TimeFrame;
  setTimeFrame: (timeFrame: TimeFrame) => void;
  isLoading: boolean;
  refreshSalesData;
}

const SalesAnalyticsContext = createContext<
  SalesAnalyticsContextType | undefined
>(undefined);

export const useSalesAnalytics = () => {
  const context = useContext(SalesAnalyticsContext);
  if (!context) {
    throw new Error(
      'useSalesAnalytics must be used within a SalesAnalyticsProvider'
    );
  }
  return context;
};

interface SalesAnalyticsProviderProps {
  children: ReactNode;
}

export const SalesAnalyticsProvider: React.FC<SalesAnalyticsProviderProps> = ({
  children
}) => {
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
        `/api/sales/analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching sales analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [timeFrame, refreshTrigger, fetchAnalytics]);

  const refreshSalesData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <SalesAnalyticsContext.Provider
      value={{
        analyticsData,
        timeFrame,
        setTimeFrame,
        isLoading,
        refreshSalesData
      }}
    >
      {children}
    </SalesAnalyticsContext.Provider>
  );
};
