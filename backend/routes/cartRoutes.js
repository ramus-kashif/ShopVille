import express from 'express';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cartController.js';
import { isAuthorized } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', isAuthorized, getCart);
router.post('/add', isAuthorized, addToCart);
router.post('/remove', isAuthorized, removeFromCart);
router.post('/clear', isAuthorized, clearCart);

export default router; 