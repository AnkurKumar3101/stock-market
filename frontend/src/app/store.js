import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import stockReducer from '../features/stocks/stockSlice';
import portfolioReducer from '../features/portfolio/portfolioSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        stocks: stockReducer,
        portfolio: portfolioReducer,
    },
});

export default store;
