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
import { useEffect } from 'react';

const formSchema = z.object({
  logo: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  accountName: z.string().min(1, 'Account name is required'),
  bankName: z.string().min(1, 'Bank name is required')
});

type BusinessFormValue = z.infer<typeof formSchema>;

export default function BusinessForm() {
  const [loading, setLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const defaultValues = {
    logo: '',
    address: '',
    accountNumber: '',
    accountName: '',
    bankName: ''
  };

  const form = useForm<BusinessFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  useEffect(() => {
    const fetchUserBusiness = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/users/business');
        if (response.status === 200 && response.data.business) {
          form.reset(response.data.business);
          console.log(response.data.business);
          setBusinessId(response.data.business._id);
          setIsReadOnly(true);
        } else if (response.status === 200 && !response.data.business) {
          // User doesn't have a business yet
          setIsReadOnly(false);
        } else {
          throw new Error('Failed to fetch user business data');
        }
      } catch (error) {
        console.error('Error fetching user business:', error);
        enqueueSnackbar('Failed to fetch business data', {
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

    fetchUserBusiness();
  }, [form]);

  const onSubmit = async (data: BusinessFormValue) => {
    console.log(data);

    try {
      setLoading(true);
      let response;
      if (businessId) {
        response = await axios.put(`/api/business/${businessId}`, data);
      } else {
        response = await axios.post('/api/business', data);
      }

      console.log('my response', response);

      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar(
          businessId
            ? 'Business updated successfully'
            : 'Business added successfully',
          {
            variant: 'success',
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            }
          }
        );
        form.reset(response.data);
        setBusinessId(response.data._id);
        setIsReadOnly(true);
      } else {
        throw new Error(
          businessId ? 'Failed to update business' : 'Failed to add business'
        );
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        businessId ? 'Failed to update business' : 'Failed to add business',
        {
          variant: 'error',
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          }
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsReadOnly(false);
  };

  const handleCancel = () => {
    form.reset();
    setIsReadOnly(true);
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
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter logo URL..."
                    readOnly={isReadOnly}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter business address..."
                    readOnly={isReadOnly}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter account number..."
                    readOnly={isReadOnly}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter account name..."
                    readOnly={isReadOnly}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter bank name..."
                    readOnly={isReadOnly}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            {isReadOnly ? (
              <Button onClick={handleEdit} type="button">
                Edit
              </Button>
            ) : (
              <>
                <Button onClick={handleCancel} type="button" variant="outline">
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  {businessId ? 'Update Business' : 'Add Business'}
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}
