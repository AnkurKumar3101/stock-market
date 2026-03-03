import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            index: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        currentPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        sector: {
            type: String,
        },
        marketCap: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
