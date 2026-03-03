import express from 'express';
import { getUsers, getAllTransactions } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/users').get(protect, admin, getUsers);
router.route('/transactions').get(protect, admin, getAllTransactions);

export default router;
