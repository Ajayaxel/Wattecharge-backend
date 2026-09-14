import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    fleetCode: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      sparse: true, // allows null/undefined without breaking uniqueness
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    fleetAddress: {
      type: String,
      trim: true,
      default: '',
    },
    allowedEmailDomains: {
      type: [String],
      default: [],
    },
    // Onboarding & Trade License Extraction fields
    tradeLicenseNo: {
      type: String,
      trim: true,
      default: '',
    },
    tradeName: {
      type: String,
      trim: true,
      default: '',
    },
    legalType: {
      type: String,
      trim: true,
      default: 'Limited Liability Company(LLC)',
    },
    licenseIssueDate: {
      type: String,
      default: '',
    },
    licenseExpiryDate: {
      type: String,
      default: '',
    },
    dcciNo: {
      type: String,
      default: '',
    },
    registerNo: {
      type: String,
      default: '',
    },
    licenseMembers: {
      type: [String],
      default: [],
    },
    licensePdfUrl: {
      type: String,
      default: '',
    },

    // Agreement & E-Sign fields
    agreementAccepted: {
      type: Boolean,
      default: false,
    },
    agreementAcceptedAt: {
      type: Date,
      default: null,
    },
    agreementPdfUrl: {
      type: String,
      default: '',
    },
    digitalSignature: {
      type: String,
      default: '',
    },
    signatoryName: {
      type: String,
      default: '',
    },
    signatoryTitle: {
      type: String,
      default: '',
    },

    // Face Recognition & Liveness fields
    faceScanSnapshot: {
      type: String,
      default: '',
    },
    faceMatchStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'FAILED'],
      default: 'PENDING',
    },
    faceLivenessScore: {
      type: Number,
      default: 0,
    },
    onboardingStep: {
      type: Number,
      default: 1,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    adminUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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

export const Company = mongoose.model('Company', companySchema);
