import { ProductCategory } from './productCategory.model.js';

export const getProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product categories',
    });
  }
};

export const createProductCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const exists = await ProductCategory.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await ProductCategory.create({ name, description });
    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product category',
    });
  }
};
