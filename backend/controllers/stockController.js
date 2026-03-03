import Stock from '../models/Stock.js';

// @desc    Fetch all stocks (with simple pagination & search)
// @route   GET /api/stocks
// @access  Public
export const getStocks = async (req, res, next) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                $or: [
                    { symbol: { $regex: req.query.keyword, $options: 'i' } },
                    { companyName: { $regex: req.query.keyword, $options: 'i' } },
                ],
            }
            : {};

        const count = await Stock.countDocuments({ ...keyword });
        const stocks = await Stock.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ stocks, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single stock
// @route   GET /api/stocks/:id
// @access  Public
export const getStockById = async (req, res, next) => {
    try {
        const stock = await Stock.findById(req.params.id);

        if (stock) {
            res.json(stock);
        } else {
            res.status(404);
            throw new Error('Stock not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Seed Mock Database Stocks (Admin only)
// @route   POST /api/stocks/seed
// @access  Private/Admin
export const seedStocks = async (req, res, next) => {
    try {
        const mockStocks = [
            {
                symbol: 'AAPL',
                companyName: 'Apple Inc.',
                currentPrice: 175.5,
                sector: 'Technology',
                marketCap: 2800000000000,
            },
            {
                symbol: 'MSFT',
                companyName: 'Microsoft Corporation',
                currentPrice: 330.11,
                sector: 'Technology',
                marketCap: 2400000000000,
            },
            {
                symbol: 'GOOGL',
                companyName: 'Alphabet Inc.',
                currentPrice: 135.2,
                sector: 'Communication Services',
                marketCap: 1700000000000,
            },
            {
                symbol: 'AMZN',
                companyName: 'Amazon.com, Inc.',
                currentPrice: 130.0,
                sector: 'Consumer Cyclical',
                marketCap: 1300000000000,
            },
            {
                symbol: 'TSLA',
                companyName: 'Tesla, Inc.',
                currentPrice: 240.5,
                sector: 'Consumer Cyclical',
                marketCap: 750000000000,
            },
        ];

        await Stock.deleteMany();
        const createdStocks = await Stock.insertMany(mockStocks);
        res.status(201).json(createdStocks);
    } catch (error) {
        next(error);
    }
};
