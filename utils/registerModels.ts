// utils/registerModels.ts
import mongoose from 'mongoose';
import Sales from '@/models/Sales';
import Customer from '@/models/Customer';
import Product from '@/models/Product';

export function registerModels() {
  if (!mongoose.models.Sales) {
    Sales;
  }
  if (!mongoose.models.Customer) {
    Customer;
  }
  if (!mongoose.models.Product) {
    Product;
  }
}
