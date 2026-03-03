import Portfolio from '../models/Portfolio.js';
import Transaction from '../models/Transaction.js';
import Watchlist from '../models/Watchlist.js';

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
export const getPortfolio = async (req, res, next) => {
    try {
        const portfolio = await Portfolio.find({ user: req.user._id }).populate('stock');
        res.json(portfolio);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user transactions
// @route   GET /api/portfolio/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id })
            .populate('stock', 'symbol companyName')
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user watchlist
// @route   GET /api/portfolio/watchlist
// @access  Private
export const getWatchlist = async (req, res, next) => {
    try {
        const watchlist = await Watchlist.find({ user: req.user._id }).populate('stock');
        res.json(watchlist);
    } catch (error) {
        next(error);
    }
};

// @desc    Add stock to watchlist
// @route   POST /api/portfolio/watchlist
// @access  Private
export const addToWatchlist = async (req, res, next) => {
    try {
        const { stockId } = req.body;

        const exists = await Watchlist.findOne({ user: req.user._id, stock: stockId });
        if (exists) {
            res.status(400);
            throw new Error('Stock already in watchlist');
        }

        const watchlistItem = await Watchlist.create({
            user: req.user._id,
            stock: stockId,
        });

        // Populate stock details before returning
        await watchlistItem.populate('stock');

        res.status(201).json(watchlistItem);
    } catch (error) {
        next(error);
    }
};

// @desc    Remove stock from watchlist
// @route   DELETE /api/portfolio/watchlist/:id
// @access  Private
export const removeFromWatchlist = async (req, res, next) => {
    try {
        const item = await Watchlist.findOne({ _id: req.params.id, user: req.user._id });

        if (item) {
            await Watchlist.deleteOne({ _id: item._id });
            res.json({ message: 'Removed from watchlist' });
        } else {
            res.status(404);
            throw new Error('Watchlist item not found');
        }
    } catch (error) {
        next(error);
    }
};
