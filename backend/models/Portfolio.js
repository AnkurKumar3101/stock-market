import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true,
        },
        stock: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Stock',
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        averageBuyPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate portfolio entries per user-stock
portfolioSchema.index({ user: 1, stock: 1 }, { unique: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
