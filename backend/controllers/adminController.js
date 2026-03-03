import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
export const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({})
            .populate('user', 'id name email')
            .populate('stock', 'symbol companyName')
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};
