import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      required: [true, 'Logo URL is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index is automatically created by unique: true on the name field

export const Brand = mongoose.model('Brand', brandSchema);
