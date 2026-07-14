import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from './product.controller.js';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes (assuming no middleware for now as requested for fast prototyping)
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
