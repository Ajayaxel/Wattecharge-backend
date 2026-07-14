import { Product } from './product.model.js';
import { ProductCategory } from './productCategory.model.js';
import mongoose from 'mongoose';

export const getProducts = async (req, res) => {
  try {
    const { category, search, isAdmin } = req.query;
    
    let query = {};
    if (!isAdmin) {
      query.isActive = true;
    }

    if (category && category !== 'All') {
      const cat = await ProductCategory.findOne({ name: category });
      if (cat) {
        query.category = cat._id;
      }
    }

    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products',
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product',
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { category } = req.body;
    let catId = category;
    
    if (mongoose.Types.ObjectId.isValid(category) === false) {
      // If it's a name instead of an ID, find the category, or create it if missing
      let cat = await ProductCategory.findOne({ name: category });
      if (!cat) {
        cat = await ProductCategory.create({ name: category });
      }
      catId = cat._id;
    }

    const product = await Product.create({ ...req.body, category: catId });
    
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product',
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { category } = req.body;
    let updateData = { ...req.body };

    if (category && mongoose.Types.ObjectId.isValid(category) === false) {
      let cat = await ProductCategory.findOne({ name: category });
      if (!cat) {
        cat = await ProductCategory.create({ name: category });
      }
      updateData.category = cat._id;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product',
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting product',
    });
  }
};
