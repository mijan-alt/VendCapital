// contexts/SalesContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

type Sale = {
  _id: string;
  customer: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'unpaid' | 'paid';
  createdAt: string;
};

type SalesContextType = {
  sales: Sale[];
  isLoading: boolean;
  error: string | null;
  fetchSales: () => Promise<void>;
  addSale: (sale: Omit<Sale, '_id' | 'createdAt'>) => Promise<void>;
  updateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
};

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const useSalesContext = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSalesContext must be used within a SalesProvider');
  }
  return context;
};

export const SalesProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children
}) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<Sale[]>('/api/sales');
      setSales(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sales');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSale = useCallback(async (sale: Omit<Sale, '_id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<Sale>('/api/sales/new', sale);
      setSales((prevSales) => [...prevSales, response.data]);
      setError(null);
    } catch (err) {
      setError('Failed to add sale');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSale = useCallback(async (id: string, updates: Partial<Sale>) => {
    setIsLoading(true);
    try {
      const response = await axios.put<Sale>(`/api/sales/${id}`, updates);
      setSales((prevSales) =>
        prevSales.map((sale) =>
          sale._id === id ? { ...sale, ...response.data } : sale
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to update sale');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    sales,
    isLoading,
    error,
    fetchSales,
    addSale,
    updateSale
  };

  return (
    <SalesContext.Provider value={value}>{children}</SalesContext.Provider>
  );
};
