import express from 'express';
import {
    getStocks,
    getStockById,
    seedStocks,
} from '../controllers/stockController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getStocks);
router.route('/seed').post(protect, admin, seedStocks);
router.route('/:id').get(getStockById);

export default router;
