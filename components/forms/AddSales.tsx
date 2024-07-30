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

type Sale = {
  customer: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'unpaid' | 'paid';
};

type Customer = {
  _id: string;
  name: string;
  email: string;
  phone: string;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantityInStock: number;
  brand?: string;
};

const formSchema = z.object({
  customer: z.string().min(1, { message: 'Please select a customer.' }),
  product: z.string().min(1, { message: 'Please select a product.' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1.' }),
  unitPrice: z.number().min(0, { message: 'Price cannot be negative.' }),
  totalPrice: z.number().min(0, { message: 'Total price cannot be negative.' }),
  status: z.enum(['unpaid', 'paid'])
});

export default function RecordSale() {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');

  const form = useForm<Sale>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: '',
      product: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      status: 'unpaid'
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, productsResponse] = await Promise.all([
          axios.get('/api/customers/all'),
          axios.get('/api/products/fetch-products')
        ]);
        setCustomers(customersResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        enqueueSnackbar('Error fetching data', { variant: 'error' });
      }
    };

    fetchData();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.phone.includes(customerSearchTerm)
  );

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.category
        .toLowerCase()
        .includes(productSearchTerm.toLowerCase()) ||
      (product.brand &&
        product.brand.toLowerCase().includes(productSearchTerm.toLowerCase()))
  );

  const updateTotalPrice = () => {
    const quantity = form.getValues('quantity');
    const unitPrice = form.getValues('unitPrice');
    const totalPrice = quantity * unitPrice;
    form.setValue('totalPrice', totalPrice);
  };

  const onProductSelect = (productId: string) => {
    const selectedProduct = products.find(
      (product) => product._id === productId
    );
    if (selectedProduct) {
      form.setValue('unitPrice', selectedProduct.price);
      updateTotalPrice();
    }
  };

  async function onSubmit(values: Sale) {
    try {
      setLoading(true);
      const response = await axios.post('/api/sales/new', values);

      if (response.status === 200) {
        enqueueSnackbar('Sale recorded successfully', { variant: 'success' });
        form.reset();
      } else {
        enqueueSnackbar('Error recording sale', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error recording sale:', error);
      enqueueSnackbar('Error recording sale', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SnackbarProvider />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="customer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="Search customers by name, email, or phone"
                      value={customerSearchTerm}
                      onChange={(e) => setCustomerSearchTerm(e.target.value)}
                      className="mb-2"
                    />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCustomers.map((customer) => (
                          <SelectItem key={customer._id} value={customer._id}>
                            {customer.name} - {customer.email} ({customer.phone}
                            )
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="Search products by name, category, or brand"
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="mb-2"
                    />
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        onProductSelect(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredProducts.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.name} - {product.category} - $
                            {product.price} (In stock: {product.quantityInStock}
                            )
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value));
                      updateTotalPrice();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Price</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(parseFloat(e.target.value));
                      updateTotalPrice();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {loading ? 'Recording...' : 'Record Sale'}
          </Button>
        </form>
      </Form>
    </>
  );
}
