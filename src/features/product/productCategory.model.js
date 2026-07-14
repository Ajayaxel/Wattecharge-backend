import mongoose from 'mongoose';

const productCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product category name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

export const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
