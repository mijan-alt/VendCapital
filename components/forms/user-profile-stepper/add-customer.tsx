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
import { SnackbarProvider, enqueueSnackbar, closeSnackbar } from 'notistack';
import { Circles } from 'react-loader-spinner';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';

type Customer = {
  name: string;
  email: string;
  phone: string;
};

interface CustomerFormProp {
  initialData: any | null;
  id?: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  email: z.string().email({
    message: 'Invalid email address.'
  }),
  phone: z.string().min(11, {
    message: 'Phone number must be at least 11 characters.'
  })
});

export default function AddCustomer({ initialData, id }: CustomerFormProp) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = initialData ? 'Edit Customer' : 'Add Customer';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? {
        name: initialData.name ?? '',
        email: initialData.email ?? '',
        phone: initialData.phone
      }
    : {
        name: '',
        email: '',
        phone: ''
      };
  const form = useForm<Customer>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  async function onSubmit(values: Customer) {
    console.log('my customers', values);

    try {
      setLoading(true);

      if (initialData) {
        const response = await axios.put(
          `/api/customers/single-customer/${id}`,
          values
        );

        if (response.status === 201) {
          toast({
            variant: 'default',
            title: 'Success',
            description: 'Editing complete.'
          });
          router.refresh();
          router.push(`/dashboard/customers`);
        }
      } else {
        const response = await axios.post('/api/customers/new', values);
        if (response.status === 200) {
          enqueueSnackbar('Customer added', {
            variant: 'success',
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center'
            },
            action: (key) => (
              <button onClick={() => closeSnackbar(key)}>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )
          });

          setLoading(false);
          form.reset();
        } else {
          enqueueSnackbar('There was an error', {
            variant: 'error',
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center'
            },
            action: (key) => (
              <button onClick={() => closeSnackbar(key)}>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )
          });
          console.error('Error adding customer:', response.data.message);
        }
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      enqueueSnackbar('There was an error', {
        variant: 'error',
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        },
        action: (key) => (
          <button onClick={() => closeSnackbar(key)}>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )
      });
      setLoading(false);
    }
  }

  return (
    <>
      <SnackbarProvider
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter name"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
