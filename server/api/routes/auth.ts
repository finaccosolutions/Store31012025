import express from 'express';
import * as authController from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/supplier/register', authController.registerSupplier);
router.post('/supplier/login', authController.login);

// Protected routes
router.post('/logout', authenticateJWT, authController.logout);
router.get('/me', authenticateJWT, authController.getCurrentUser);
router.put('/me', authenticateJWT, authController.updateProfile);
router.put('/me/password', authenticateJWT, authController.changePassword);

export default router;