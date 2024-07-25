'use client';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import axios from 'axios';

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

export default function ExpenseForm() {
  const [loading, setLoading] = useState(false);

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
      const response = await axios.post('/api/expenses', {
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
                  <Input
                    type="text"
                    placeholder="Enter expense category..."
                    {...field}
                  />
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
