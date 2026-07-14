import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['topup', 'payment', 'refund'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'success',
    },
    reference: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model('Transaction', transactionSchema);
