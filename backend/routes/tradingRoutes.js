import express from 'express';
import { buyStock, sellStock } from '../controllers/tradingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/buy', protect, buyStock);
router.post('/sell', protect, sellStock);

export default router;
