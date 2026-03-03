import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stock from './models/Stock.js';

dotenv.config();

const mockStocks = [
    { symbol: 'AAPL', companyName: 'Apple Inc.', currentPrice: 175.5, sector: 'Technology', marketCap: 2800000000000 },
    { symbol: 'MSFT', companyName: 'Microsoft Corporation', currentPrice: 330.11, sector: 'Technology', marketCap: 2400000000000 },
    { symbol: 'GOOGL', companyName: 'Alphabet Inc.', currentPrice: 135.2, sector: 'Communication', marketCap: 1700000000000 },
    { symbol: 'AMZN', companyName: 'Amazon.com, Inc.', currentPrice: 130.0, sector: 'Consumer Cyclical', marketCap: 1300000000000 },
    { symbol: 'TSLA', companyName: 'Tesla, Inc.', currentPrice: 240.5, sector: 'Automotive', marketCap: 750000000000 },
    { symbol: 'META', companyName: 'Meta Platforms', currentPrice: 300.0, sector: 'Communication', marketCap: 800000000000 },
    { symbol: 'NVDA', companyName: 'NVIDIA Corporation', currentPrice: 450.0, sector: 'Semiconductors', marketCap: 1100000000000 },
    { symbol: 'JPM', companyName: 'JPMorgan Chase & Co.', currentPrice: 150.0, sector: 'Financial', marketCap: 400000000000 },
    { symbol: 'V', companyName: 'Visa Inc.', currentPrice: 240.0, sector: 'Financial', marketCap: 500000000000 },
    { symbol: 'WMT', companyName: 'Walmart Inc.', currentPrice: 160.0, sector: 'Consumer Defensive', marketCap: 430000000000 },
    { symbol: 'JNJ', companyName: 'Johnson & Johnson', currentPrice: 165.0, sector: 'Healthcare', marketCap: 430000000000 },
    { symbol: 'UNH', companyName: 'UnitedHealth Group', currentPrice: 500.0, sector: 'Healthcare', marketCap: 470000000000 },
];

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        await Stock.deleteMany();
        console.log('Stocks deleted.');

        await Stock.insertMany(mockStocks);
        console.log('Stocks added.');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
