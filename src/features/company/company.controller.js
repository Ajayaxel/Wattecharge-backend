import { companyService } from './company.service.js';
import { sendSuccess } from '../../utils/response.js';

// --- Company Controllers ---

export const parseLicensePdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'PDF file is required' });
    }
    const extractedData = await companyService.parseLicensePdf(req.file);
    return sendSuccess(res, 'Trade License PDF parsed successfully', extractedData, 200);
  } catch (error) {
    next(error);
  }
};

export const parseVehiclePdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'PDF file is required' });
    }
    const extractedData = await companyService.parseVehiclePdf(req.file);
    return sendSuccess(res, 'Vehicle PDF / Report parsed successfully', extractedData, 200);
  } catch (error) {
    next(error);
  }
};

export const verifyFaceRecognition = async (req, res, next) => {
  try {
    const { imageBase64, signatoryName } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'Face snapshot image is required' });
    }
    const result = await companyService.verifyFace(imageBase64, signatoryName);
    return sendSuccess(res, 'Face recognition & liveness check completed', result, 200);
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req, res, next) => {
  try {
    const companyData = { ...req.body };
    if (req.files?.licensePdf?.[0]) {
      companyData.licensePdfUrl = `/uploads/${req.files.licensePdf[0].filename}`;
    }
    if (req.files?.agreementPdf?.[0]) {
      companyData.agreementPdfUrl = `/uploads/${req.files.agreementPdf[0].filename}`;
    }
    const company = await companyService.createCompany(companyData);
    return sendSuccess(res, 'Company onboarded successfully', company, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.getAllCompanies();
    return sendSuccess(res, 'Companies retrieved successfully', companies, 200);
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    return sendSuccess(res, 'Company retrieved successfully', company, 200);
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const company = await companyService.updateCompany(req.params.id, req.body);
    return sendSuccess(res, 'Company updated successfully', company, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    await companyService.deleteCompany(req.params.id);
    return sendSuccess(res, 'Company deleted successfully', null, 200);
  } catch (error) {
    next(error);
  }
};

export const getCompanyMembers = async (req, res, next) => {
  try {
    const members = await companyService.getCompanyMembers(req.params.id);
    return sendSuccess(res, 'Company members retrieved successfully', members, 200);
  } catch (error) {
    next(error);
  }
};

export const inviteCompanyMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const result = await companyService.inviteCompanyMember(req.params.id, email);
    return sendSuccess(res, result.message, result, 200);
  } catch (error) {
    next(error);
  }
};

// --- Company Code Controllers ---

export const createCompanyCode = async (req, res, next) => {
  try {
    const code = await companyService.createCompanyCode(req.body);
    return sendSuccess(res, 'Company code created successfully', code, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllCompanyCodes = async (req, res, next) => {
  try {
    const codes = await companyService.getAllCompanyCodes();
    return sendSuccess(res, 'Company codes retrieved successfully', codes, 200);
  } catch (error) {
    next(error);
  }
};

export const getCompanyCodeById = async (req, res, next) => {
  try {
    const code = await companyService.getCompanyCodeById(req.params.id);
    return sendSuccess(res, 'Company code retrieved successfully', code, 200);
  } catch (error) {
    next(error);
  }
};

export const updateCompanyCode = async (req, res, next) => {
  try {
    const code = await companyService.updateCompanyCode(req.params.id, req.body);
    return sendSuccess(res, 'Company code updated successfully', code, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteCompanyCode = async (req, res, next) => {
  try {
    await companyService.deleteCompanyCode(req.params.id);
    return sendSuccess(res, 'Company code deleted successfully', null, 200);
  } catch (error) {
    next(error);
  }
};

// --- User Apply Code ---

export const applyCompanyCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const result = await companyService.applyCompanyCode(req.user._id, code);
    return sendSuccess(res, result.message, result, 200);
  } catch (error) {
    next(error);
  }
};

// --- Fleet Company Vehicle Controllers ---

export const getCompanyVehicles = async (req, res, next) => {
  try {
    const vehicles = await companyService.getCompanyVehicles(req.params.id);
    return sendSuccess(res, 'Company fleet vehicles retrieved successfully', vehicles, 200);
  } catch (error) {
    next(error);
  }
};

export const addCompanyVehicles = async (req, res, next) => {
  try {
    const result = await companyService.addCompanyVehicles(req.params.id, req.body);
    const count = Array.isArray(result) ? result.length : 1;
    return sendSuccess(res, `${count} Vehicle(s) added to company fleet successfully`, result, 201);
  } catch (error) {
    next(error);
  }
};

export const deleteCompanyVehicle = async (req, res, next) => {
  try {
    await companyService.deleteCompanyVehicle(req.params.id, req.params.vehicleId);
    return sendSuccess(res, 'Vehicle removed from company fleet successfully', null, 200);
  } catch (error) {
    next(error);
  }
};
