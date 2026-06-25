import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    modelName: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['SUV', 'Sedan'],
      trim: true,
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

// Optimize database queries with single-field and compound indexes to prevent lag
vehicleSchema.index({ brand: 1 });
vehicleSchema.index({ type: 1 });
vehicleSchema.index({ modelName: 1 });
vehicleSchema.index({ brand: 1, type: 1 });

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
