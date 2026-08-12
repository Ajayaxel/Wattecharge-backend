import mongoose from 'mongoose';

const companyCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Company code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: [0, 'Discount must be at least 0'],
      max: [100, 'Discount cannot exceed 100'],
    },
    maxUses: {
      type: Number,
      default: null, // null means unlimited
    },
    currentUses: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const CompanyCode = mongoose.model('CompanyCode', companyCodeSchema);
