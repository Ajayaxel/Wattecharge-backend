import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      unique: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, 'Service subtitle is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Service icon key is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Service category is required'],
      enum: ['on_demand', 'roadside'],
    },
    cost: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ category: 1, isActive: 1 });

export const Service = mongoose.model('Service', serviceSchema);
