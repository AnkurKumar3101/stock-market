import express from 'express';
import {
    getPortfolio,
    getTransactions,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getPortfolio);
router.route('/transactions').get(protect, getTransactions);
router.route('/watchlist')
    .get(protect, getWatchlist)
    .post(protect, addToWatchlist);
router.route('/watchlist/:id').delete(protect, removeFromWatchlist);

export default router;
