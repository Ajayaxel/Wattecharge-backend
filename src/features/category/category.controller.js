import { Category } from './category.model.js';
import { Vehicle } from '../vehicle/vehicle.model.js';
import { sendSuccess } from '../../utils/response.js';
import { APIError } from '../../utils/response.js';

/**
 * Handles HTTP GET requests to retrieve all categories.
 */
export const getCategories = async (req, res, next) => {
  try {
    const { hasVehicles, brand } = req.query;

    let filter = {};
    if (hasVehicles === 'true') {
      const vehicleFilter = { isActive: true };
      if (brand) {
        // Case-insensitive brand matching
        vehicleFilter.brand = { $regex: new RegExp(`^${brand.trim()}$`, 'i') };
      }
      const activeTypes = await Vehicle.distinct('type', vehicleFilter);
      filter = { name: { $in: activeTypes } };
    }

    const categories = await Category.find(filter).sort({ name: 1 });
    const serializedCategories = categories.map(cat => ({
      id: cat._id.toString(),
      name: cat.name,
      description: cat.description,
    }));
    return sendSuccess(res, 'Categories retrieved successfully.', serializedCategories, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP POST requests to create a new category (Admin privilege required).
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      throw new APIError('Category name is required.', 400);
    }

    // Check if category name already exists (case-insensitive)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });
    if (existingCategory) {
      throw new APIError('Category name already exists.', 400);
    }

    const newCategory = await Category.create({
      name: name.trim(),
      description: (description || '').trim(),
    });

    const serializedCategory = {
      id: newCategory._id.toString(),
      name: newCategory.name,
      description: newCategory.description,
    };

    return sendSuccess(res, 'Category created successfully.', serializedCategory, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP PUT requests to update an existing category (Admin privilege required).
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      throw new APIError('Category not found.', 404);
    }

    if (name && name.trim().toLowerCase() !== category.name.toLowerCase()) {
      // Check if new name already exists (case-insensitive)
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
      });
      if (existingCategory) {
        throw new APIError('Category name already exists.', 400);
      }
      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    await category.save();

    const serializedCategory = {
      id: category._id.toString(),
      name: category.name,
      description: category.description,
    };

    return sendSuccess(res, 'Category updated successfully.', serializedCategory, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP DELETE requests to delete a category (Admin privilege required).
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      throw new APIError('Category not found.', 404);
    }

    // Block deletion if any active vehicle is using this category (stored in 'type' field in Vehicle schema)
    const vehicleExists = await Vehicle.exists({ 
      type: { $regex: new RegExp(`^${category.name}$`, 'i') },
      isActive: true
    });
    if (vehicleExists) {
      throw new APIError('Cannot delete category because it is associated with one or more active fleet vehicles.', 400);
    }

    await Category.findByIdAndDelete(id);
    return sendSuccess(res, 'Category deleted successfully.', null, 200);
  } catch (error) {
    next(error);
  }
};
