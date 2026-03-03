import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
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
        type: {
            type: String,
            required: true,
            enum: ['BUY', 'SELL'],
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        priceAtExecution: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
