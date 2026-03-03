import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { updateBalanceLocally } from '../auth/authSlice';

const initialState = {
    holdings: [],
    transactions: [],
    watchlist: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const fetchPortfolio = createAsyncThunk('portfolio/fetchPortfolio', async (_, thunkAPI) => {
    try {
        const response = await api.get('/portfolio');
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const fetchWatchlist = createAsyncThunk('portfolio/fetchWatchlist', async (_, thunkAPI) => {
    try {
        const response = await api.get('/portfolio/watchlist');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const buyStock = createAsyncThunk('portfolio/buy', async (tradeData, thunkAPI) => {
    try {
        const response = await api.post('/trade/buy', tradeData);
        thunkAPI.dispatch(updateBalanceLocally(response.data.walletBalance));
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const sellStock = createAsyncThunk('portfolio/sell', async (tradeData, thunkAPI) => {
    try {
        const response = await api.post('/trade/sell', tradeData);
        thunkAPI.dispatch(updateBalanceLocally(response.data.walletBalance));
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        resetPortfolioStatus: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPortfolio.pending, (state) => { state.isLoading = true; })
            .addCase(fetchPortfolio.fulfilled, (state, action) => {
                state.isLoading = false;
                state.holdings = action.payload;
            })
            .addCase(fetchPortfolio.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(fetchWatchlist.fulfilled, (state, action) => {
                state.watchlist = action.payload;
            })
            .addCase(buyStock.fulfilled, (state, action) => {
                const itemIndex = state.holdings.findIndex(p => p.stock._id === action.payload.portfolioItem.stock);
                if (itemIndex >= 0) {
                    // we'd ideally fetch updated populated item, but for now we append/update raw item or refetch
                    // Best practice is to refetch all holdings on buy/sell success for simplicity
                }
                state.isSuccess = true;
            })
            .addCase(sellStock.fulfilled, (state) => {
                state.isSuccess = true;
            });
    },
});

export const { resetPortfolioStatus } = portfolioSlice.actions;
export default portfolioSlice.reducer;
