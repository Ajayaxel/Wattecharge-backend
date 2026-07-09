import { Brand } from './brand.model.js';
import { Vehicle } from '../vehicle/vehicle.model.js';
import { sendSuccess } from '../../utils/response.js';
import { APIError } from '../../utils/response.js';

/**
 * Handles HTTP GET requests to retrieve all brands.
 */
export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    const serializedBrands = brands.map(brand => ({
      id: brand._id.toString(),
      name: brand.name,
      logoUrl: brand.logoUrl,
    }));
    return sendSuccess(res, 'Brands retrieved successfully.', serializedBrands, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP POST requests to create a new brand (Admin privilege required).
 */
export const createBrand = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      throw new APIError('Brand name is required.', 400);
    }

    // Check if brand name already exists (case-insensitive)
    const existingBrand = await Brand.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });
    if (existingBrand) {
      throw new APIError('Brand name already exists.', 400);
    }

    let logoUrl = '';
    if (req.file) {
      // Construct full URL using req.protocol and req.get('host')
      logoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (req.body.logoUrl && req.body.logoUrl.trim()) {
      logoUrl = req.body.logoUrl.trim();
    } else {
      throw new APIError('Brand logo file or logoUrl is required.', 400);
    }

    const newBrand = await Brand.create({
      name: name.trim(),
      logoUrl,
    });

    const serializedBrand = {
      id: newBrand._id.toString(),
      name: newBrand.name,
      logoUrl: newBrand.logoUrl,
    };

    return sendSuccess(res, 'Brand created successfully.', serializedBrand, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP DELETE requests to delete a brand (Admin privilege required).
 */
export const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
      throw new APIError('Brand not found.', 404);
    }

    // Block deletion if any active vehicle is using this brand
    const vehicleExists = await Vehicle.exists({ 
      brand: { $regex: new RegExp(`^${brand.name}$`, 'i') },
      isActive: true
    });
    if (vehicleExists) {
      throw new APIError('Cannot delete brand because it is associated with one or more fleet vehicles.', 400);
    }

    await Brand.findByIdAndDelete(id);
    return sendSuccess(res, 'Brand deleted successfully.', null, 200);
  } catch (error) {
    next(error);
  }
};
