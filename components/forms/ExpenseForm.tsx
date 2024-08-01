'use client';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useExpenseAnalytics } from '@/app/context/ExpenseContext';
const formSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number'
    }),
  category: z.string().min(1, 'Category is required')
});

type ExpenseFormValue = z.infer<typeof formSchema>;

const categories = [
  'Cost of Goods Sold (COGS)',
  'Administrative Expenses',
  'Sales and Marketing',
  'Research and Development (R&D)',
  'Rent',
  'Utilities',
  'Salaries and Wages',
  'Employee Benefits',
  'Technology and IT',
  'Facilities and Maintenance',
  'Transportation and Travel',
  'Financial Expenses',
  'Miscellaneous Expenses'
];

export default function ExpenseForm() {
  const [loading, setLoading] = useState(false);
  const { refreshExpenseData } = useExpenseAnalytics();
  const [expenses, setExpenses] = useState(null);

  const defaultValues = {
    description: '',
    amount: '',
    category: ''
  };

  const form = useForm<ExpenseFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ExpenseFormValue) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/expense', {
        ...data,
        amount: parseFloat(data.amount)
      });

      if (response.status === 201) {
        enqueueSnackbar('Expense added successfully', {
          variant: 'success',
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          }
        });
        form.reset();
        refreshExpenseData();
      } else {
        throw new Error('Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      enqueueSnackbar('Failed to add expense', {
        variant: 'error',
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SnackbarProvider
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter expense description..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter expense amount..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="scrollbar-thumb-rounded max-h-48 overflow-y-auto">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button disabled={loading} type="submit">
              Add Expense
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
