import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
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
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate watchlist entries per user-stock
watchlistSchema.index({ user: 1, stock: 1 }, { unique: true });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;
