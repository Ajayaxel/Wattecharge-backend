import express from 'express';
import { getProductCategories, createProductCategory } from './productCategory.controller.js';

const router = express.Router();

router.get('/', getProductCategories);
router.post('/', createProductCategory);

export default router;
