import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    serviceType: {
      type: String,
      required: [true, 'Service type classification is required'],
      enum: ['instant_boost', 'slot_booking', 'roadside_help'],
    },
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'completed', 'cancelled'],
      default: 'pending',
    },
    location: {
      latitude: {
        type: Number,
        required: [true, 'Location latitude coordinate is required'],
      },
      longitude: {
        type: Number,
        required: [true, 'Location longitude coordinate is required'],
      },
      address: {
        type: String,
        default: 'Hanover St 24, New York',
      },
    },
    payment: {
      method: {
        type: String,
        enum: ['wallet', 'card', 'cod'],
        required: [true, 'Payment method selection is required'],
      },
      amount: {
        type: Number,
        required: [true, 'Total payment amount is required'],
      },
      status: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid',
      },
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
