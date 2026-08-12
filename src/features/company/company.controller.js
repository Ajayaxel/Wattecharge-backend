import { companyService } from './company.service.js';
import { sendSuccess } from '../../utils/response.js';

// --- Company Controllers ---

export const createCompany = async (req, res, next) => {
  try {
    const company = await companyService.createCompany(req.body);
    return sendSuccess(res, 'Company created successfully', company, 201);
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
