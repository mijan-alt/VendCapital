// models/Product.ts
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price must be a positive number']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category for this product']
    },
    quantityInStock: {
      type: Number,
      required: [true, 'Please specify the quantity in stock'],
      min: [0, 'Quantity cannot be negative']
    },
    images: [
      {
        type: String, // URLs to product images
        required: [true, 'Please provide at least one product image']
      }
    ],
    brand: {
      type: String,
      required: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Product ||
  mongoose.model('Product', ProductSchema);
