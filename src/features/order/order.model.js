import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  }
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // For simplicity in prototyping, user is optional if not logged in
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['wallet', 'cod', 'paymob'],
    },
    paymentStatus: {
      type: String,
      default: 'pending',
      enum: ['pending', 'paid', 'failed'],
    },
    status: {
      type: String,
      default: 'processing',
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    }
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model('Order', orderSchema);
