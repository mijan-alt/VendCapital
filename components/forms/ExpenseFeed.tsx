'use client';

import { useEffect, useState } from 'react';

import axios from 'axios';

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
}

export default function ExpenseFeed() {
  const [expenses, setExpenses] = useState(null);
  async function fetchExpenses() {
    try {
      const response = await axios.get('/api/expenses/all');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  console.log(expenses);

  return (
    <div className="mt-4">
      <h2 className="mb-2 text-xl font-bold">Live Expense Feed</h2>

      <ul className="space-y-2">
        {expenses &&
          expenses.map((expense) => (
            <li key={expense._id} className="rounded border p-2">
              <p>
                <strong>Description:</strong> {expense.description}
              </p>
              <p>
                <strong>Amount:</strong> ${expense.amount.toFixed(2)}
              </p>
              <p>
                <strong>Category:</strong> {expense.category}
              </p>
              <p>
                <strong>Created:</strong>{' '}
                {new Date(expense.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}
