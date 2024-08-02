import { NavItem } from '@/types';

export type User = {
  _id: string;
  id: number;
  name: string;
  email: string;
  business: string;
  role: string;
  status: string;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export type Expense = {
  id: number;
  _id: string;
  createdAt: string;
  amount: number;
  category: string;
};

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Admin',
    href: '/dashboard/user',
    icon: 'user',
    label: 'Admin'
  },

  // {
  //   title: 'Profile',
  //   href: '/dashboard/profile',
  //   icon: 'profile',
  //   label: 'profile'
  // },
  {
    title: 'Customers',
    href: '/dashboard/customers',
    icon: 'customers',
    label: 'customers'
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: 'product',
    label: 'product'
  },
  {
    title: 'Expenses',
    href: '/dashboard/expenses',
    icon: 'expense',
    label: 'expense'
  },
  {
    title: 'Sales',
    href: '/dashboard/sales',
    icon: 'sales',
    label: 'sales'
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: 'settings',
    label: 'settings'
  },
  {
    title: 'Business',
    href: '/dashboard/businessprofile',
    icon: 'business',
    label: 'businessprofile'
  }
];

export type Invoice = {
  id: number;
  name: string;
  email: string;
  reference: string;
  date: string;
  amount: number;
  status: string;
  product: string;
};

export const invoices: Invoice[] = [
  {
    id: 1,
    name: 'Olamide Akintan',
    email: 'olamideakintan@gmail.com',
    reference: 'A09383',
    date: '12.4.2023',
    amount: 200000,
    status: 'paid',
    product: 'watch'
  },
  {
    id: 2,
    name: 'Temidayo Smith',
    email: 'temidayo.smith@gmail.com',
    reference: 'B48274',
    date: '15.5.2023',
    amount: 150000,
    status: 'unpaid',
    product: 'watch'
  },
  {
    id: 3,
    name: 'Chinedu Okeke',
    email: 'chinedu.okeke@gmail.com',
    reference: 'C93847',
    date: '18.6.2023',
    amount: 250000,
    status: 'paid',
    product: 'watch'
  },
  {
    id: 4,
    name: 'Aisha Bello',
    email: 'aisha.bello@gmail.com',
    reference: 'D18274',
    date: '20.7.2023',
    amount: 300000,
    status: 'pending',
    product: 'watch'
  },
  {
    id: 5,
    name: 'Emeka Oji',
    email: 'emeka.oji@gmail.com',
    reference: 'E92847',
    date: '22.8.2023',
    amount: 180000,
    status: 'paid',
    product: 'watch'
  },
  {
    id: 6,
    name: 'Bola Ade',
    email: 'bola.ade@gmail.com',
    reference: 'F48374',
    date: '25.9.2023',
    amount: 220000,
    status: 'unpaid',
    product: 'watch'
  },
  {
    id: 7,
    name: 'Musa Danjuma',
    email: 'musa.danjuma@gmail.com',
    reference: 'G18474',
    date: '27.10.2023',
    amount: 270000,
    status: 'paid',
    product: 'watch'
  },
  {
    id: 8,
    name: 'Ngozi Nwosu',
    email: 'ngozi.nwosu@gmail.com',
    reference: 'H72837',
    date: '30.11.2023',
    amount: 190000,
    status: 'pending',
    product: 'watch'
  },
  {
    id: 9,
    name: 'Kemi Adeoye',
    email: 'kemi.adeoye@gmail.com',
    reference: 'I84737',
    date: '2.12.2023',
    amount: 230000,
    status: 'paid',
    product: 'watch'
  },
  {
    id: 10,
    name: 'Samuel Johnson',
    email: 'samuel.johnson@gmail.com',
    reference: 'J38474',
    date: '5.1.2024',
    amount: 160000,
    status: 'unpaid',
    product: 'watch'
  }
];

export type Customer = {
  id: number;
  _id: string;
  name: string;
  email: string;
  phone: string;
};

export interface Actions {
  previousPage: () => void;
  nextPage: () => void;
  totalPage: number;
  count: number;
  page: number;
}
