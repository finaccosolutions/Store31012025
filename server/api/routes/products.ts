import express from 'express';
import { authenticateJWT, isSupplier } from '../middleware/auth';
import * as productController from '../controllers/productController';

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:slug', productController.getProductsByCategory);
router.get('/search', productController.searchProducts);

// Protected supplier routes
router.post('/', authenticateJWT, isSupplier, productController.createProduct);
router.put('/:id', authenticateJWT, isSupplier, productController.updateProduct);
router.delete('/:id', authenticateJWT, isSupplier, productController.deleteProduct);

export default router;