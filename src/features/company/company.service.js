import { Company } from './company.model.js';
import { CompanyCode } from './companyCode.model.js';
import { User } from '../auth/auth.model.js';

export const companyService = {
  // Company CRUD
  async createCompany(data) {
    const company = new Company(data);
    await company.save();
    return company;
  },

  async getAllCompanies() {
    return await Company.find().sort({ createdAt: -1 });
  },

  async getCompanyById(id) {
    const company = await Company.findById(id);
    if (!company) throw new Error('Company not found');
    return company;
  },

  async updateCompany(id, data) {
    const company = await Company.findByIdAndUpdate(id, data, { new: true });
    if (!company) throw new Error('Company not found');
    return company;
  },

  async deleteCompany(id) {
    const company = await Company.findByIdAndDelete(id);
    if (!company) throw new Error('Company not found');
    // Consider setting isActive to false instead of hard deleting
    return company;
  },

  // Company Code CRUD
  async createCompanyCode(data) {
    const code = new CompanyCode(data);
    await code.save();
    return code;
  },

  async getAllCompanyCodes() {
    return await CompanyCode.find().populate('companyId', 'name contactEmail');
  },

  async getCompanyCodeById(id) {
    const code = await CompanyCode.findById(id).populate('companyId');
    if (!code) throw new Error('Company Code not found');
    return code;
  },

  async updateCompanyCode(id, data) {
    const code = await CompanyCode.findByIdAndUpdate(id, data, { new: true });
    if (!code) throw new Error('Company Code not found');
    return code;
  },

  async deleteCompanyCode(id) {
    const code = await CompanyCode.findByIdAndDelete(id);
    if (!code) throw new Error('Company Code not found');
    return code;
  },

  // Apply Code
  async applyCompanyCode(userId, codeString) {
    const code = await CompanyCode.findOne({ code: codeString, isActive: true });
    if (!code) {
      throw new Error('Invalid or inactive company code');
    }

    if (code.expiresAt && new Date(code.expiresAt) < new Date()) {
      throw new Error('Company code has expired');
    }

    if (code.maxUses !== null && code.currentUses >= code.maxUses) {
      throw new Error('Company code usage limit reached');
    }

    const company = await Company.findById(code.companyId);
    if (!company || !company.isActive) {
      throw new Error('Associated company is no longer active');
    }

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (user.companyCodeId && user.companyCodeId.toString() === code._id.toString()) {
      throw new Error('You have already applied this company code');
    }

    // Update user
    user.companyId = company._id;
    user.companyCodeId = code._id;
    await user.save();

    // Increment code usage
    code.currentUses += 1;
    await code.save();

    return {
      message: 'Company code applied successfully',
      discountPercentage: code.discountPercentage,
      companyName: company.name
    };
  }
};
