import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import morgan from 'morgan';
import dns from 'dns';
import authRoutes from './routes/authRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import tradingRoutes from './routes/tradingRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// Force IPv4 first to prevent MongoDB Atlas ECONNREFUSED issues on Node 18+
dns.setDefaultResultOrder('ipv4first');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Basic route
app.get('/', (req, res) => {
    res.send('SB Stocks API is running...');
});

// Routes
app.use('/api/users', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trade', tradingRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/admin', adminRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
