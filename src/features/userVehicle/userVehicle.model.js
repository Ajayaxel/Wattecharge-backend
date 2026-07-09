import mongoose from 'mongoose';

const userVehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required'],
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle license number is required'],
      trim: true,
    },
    chargingPortType: {
      type: String,
      required: [true, 'Charging port type is required'],
      trim: true,
    },
    batteryPercent: {
      type: Number,
      default: () => Math.floor(Math.random() * 56) + 40, // Random battery between 40% and 95%
    },
    rangeKm: {
      type: Number,
      default: function() {
        return this.batteryPercent * 4; // e.g. 400km range at 100% battery
      }
    },
    status: {
      type: String,
      enum: ['active', 'parked'],
      default: 'parked',
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

export const UserVehicle = mongoose.model('UserVehicle', userVehicleSchema);
