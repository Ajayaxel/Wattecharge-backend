import mongoose from 'mongoose';

const companyVehicleSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
      index: true,
    },
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
    vinNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    plateEmirate: {
      type: String,
      trim: true,
      default: 'Dubai',
    },
    plateCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'A',
    },
    plateNumber: {
      type: String,
      trim: true,
      required: [true, 'Plate number is required'],
    },
    fullPlate: {
      type: String,
      trim: true,
      default: '',
    },
    makeYear: {
      type: String,
      default: '2023',
    },
    issueDate: {
      type: String,
      default: '',
    },
    expiryDate: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'MAINTENANCE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    insuranceCo: {
      type: String,
      default: '',
    },
    mortgagedBy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

companyVehicleSchema.index({ companyId: 1, plateNumber: 1 });
companyVehicleSchema.index({ vinNumber: 1 });

export const CompanyVehicle = mongoose.model('CompanyVehicle', companyVehicleSchema);
