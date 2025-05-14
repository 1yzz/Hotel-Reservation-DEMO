import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Initialize user service
authController['userService'].initialize().catch(console.error);

// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));

// Protected routes
router.post('/employee', requireAuth, requireAdmin, (req, res) => authController.createEmployee(req, res));
router.get('/verify', requireAuth, (req, res) => authController.verify(req, res));

export default router; 