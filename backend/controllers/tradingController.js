import User from '../models/User.js';
import Stock from '../models/Stock.js';
import Transaction from '../models/Transaction.js';
import Portfolio from '../models/Portfolio.js';

// @desc    Buy a stock
// @route   POST /api/trade/buy
// @access  Private
export const buyStock = async (req, res, next) => {
    try {
        const { stockId, quantity } = req.body;
        const userId = req.user._id;

        if (!stockId || !quantity || quantity <= 0) {
            res.status(400);
            throw new Error('Please provide valid stock ID and quantity');
        }

        const stock = await Stock.findById(stockId);
        if (!stock) {
            res.status(404);
            throw new Error('Stock not found');
        }

        const user = await User.findById(userId);
        const totalCost = stock.currentPrice * quantity;

        if (user.walletBalance < totalCost) {
            res.status(400);
            throw new Error('Insufficient funds');
        }

        // 1. Deduct from wallet
        user.walletBalance -= totalCost;
        await user.save();

        // 2. Record Transaction
        const transaction = await Transaction.create({
            user: userId,
            stock: stockId,
            type: 'BUY',
            quantity,
            priceAtExecution: stock.currentPrice,
            totalAmount: totalCost,
        });

        // 3. Update Portfolio
        let portfolioItem = await Portfolio.findOne({ user: userId, stock: stockId });

        if (portfolioItem) {
            // Calculate new average buy price
            const totalValueSoFar = portfolioItem.quantity * portfolioItem.averageBuyPrice;
            const newValueAdded = quantity * stock.currentPrice;
            const newQuantity = portfolioItem.quantity + quantity;
            portfolioItem.averageBuyPrice = (totalValueSoFar + newValueAdded) / newQuantity;
            portfolioItem.quantity = newQuantity;
            await portfolioItem.save();
        } else {
            portfolioItem = await Portfolio.create({
                user: userId,
                stock: stockId,
                quantity,
                averageBuyPrice: stock.currentPrice,
            });
        }

        res.status(201).json({
            message: 'Purchase successful',
            transaction,
            walletBalance: user.walletBalance,
            portfolioItem,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Sell a stock
// @route   POST /api/trade/sell
// @access  Private
export const sellStock = async (req, res, next) => {
    try {
        const { stockId, quantity } = req.body;
        const userId = req.user._id;

        if (!stockId || !quantity || quantity <= 0) {
            res.status(400);
            throw new Error('Please provide valid stock ID and quantity');
        }

        const stock = await Stock.findById(stockId);
        if (!stock) {
            res.status(404);
            throw new Error('Stock not found');
        }

        const portfolioItem = await Portfolio.findOne({ user: userId, stock: stockId });

        if (!portfolioItem || portfolioItem.quantity < quantity) {
            res.status(400);
            throw new Error('Insufficient shares to sell');
        }

        const totalValue = stock.currentPrice * quantity;
        const user = await User.findById(userId);

        // 1. Add to wallet
        user.walletBalance += totalValue;
        await user.save();

        // 2. Record Transaction
        const transaction = await Transaction.create({
            user: userId,
            stock: stockId,
            type: 'SELL',
            quantity,
            priceAtExecution: stock.currentPrice,
            totalAmount: totalValue,
        });

        // 3. Update Portfolio
        portfolioItem.quantity -= quantity;

        if (portfolioItem.quantity === 0) {
            await Portfolio.deleteOne({ _id: portfolioItem._id });
        } else {
            await portfolioItem.save();
        }

        res.status(201).json({
            message: 'Sale successful',
            transaction,
            walletBalance: user.walletBalance,
            portfolioItem: portfolioItem.quantity === 0 ? null : portfolioItem,
        });
    } catch (error) {
        next(error);
    }
};
