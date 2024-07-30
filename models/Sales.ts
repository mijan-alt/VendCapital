import mongoose from 'mongoose';

// Define the schema for a Sale
const SaleSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1.']
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price cannot be negative.']
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative.'],
      // Automatically calculate totalPrice based on quantity and unitPrice
      default: function () {
        return this.quantity * this.unitPrice;
      }
    },
    status: {
      type: String,
      enum: ['unpaid', 'paid'],
      required: true,
      default: 'unpaid'
    }
  },
  {
    timestamps: true
  }
);

// Middleware to update totalPrice before saving the document
SaleSchema.pre('save', function (next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

export default mongoose.models.Sale || mongoose.model('Sale', SaleSchema);
