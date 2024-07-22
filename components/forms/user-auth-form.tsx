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
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import GoogleSignInButton from '../github-auth-button';
import { SnackbarProvider, enqueueSnackbar, closeSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Eye, EyeOff } from 'lucide-react'; // Import Eye icons

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    email: '',
    password: '',
    username: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    console.log(data);
    let userdata = { ...data, username: data.email.split('@')[0] };

    try {
      setLoading(true);
      const response = await axios.post('/api/register', userdata);

      console.log('my response', response);

      if (response.status == 200) {
        enqueueSnackbar('Sign up successfull', {
          variant: 'success',
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          },

          action: (key) => (
            <button onClick={() => closeSnackbar(key)}>
              {' '}
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className=""
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
        router.push('/signin');
      } else if (response.status === 409) {
        enqueueSnackbar('User is already in use', {
          variant: 'error',
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          },

          action: (key) => (
            <button onClick={() => closeSnackbar(key)}>
              {' '}
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className=""
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
    } catch (error) {
      enqueueSnackbar('User is already in use', {
        variant: 'error',
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        },

        action: (key) => (
          <button onClick={() => closeSnackbar(key)}>
            {' '}
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className=""
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
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="******"
                      disabled={loading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Signup
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleSignInButton />
    </>
  );
}
