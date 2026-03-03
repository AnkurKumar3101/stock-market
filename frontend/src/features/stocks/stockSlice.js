import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    stocks: [],
    stockDetails: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    page: 1,
    pages: 1,
};

export const fetchStocks = createAsyncThunk('stocks/fetchAll', async (args = {}, thunkAPI) => {
    try {
        const { keyword = '', pageNumber = '' } = args;
        const response = await api.get(`/stocks?keyword=${keyword}&pageNumber=${pageNumber}`);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const fetchStockDetails = createAsyncThunk('stocks/fetchSingle', async (id, thunkAPI) => {
    try {
        const response = await api.get(`/stocks/${id}`);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const stockSlice = createSlice({
    name: 'stocks',
    initialState,
    reducers: {
        clearStockDetails: (state) => {
            state.stockDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStocks.pending, (state) => { state.isLoading = true; })
            .addCase(fetchStocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.stocks = action.payload.stocks;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
            })
            .addCase(fetchStocks.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(fetchStockDetails.fulfilled, (state, action) => {
                state.stockDetails = action.payload;
            });
    },
});

export const { clearStockDetails } = stockSlice.actions;
export default stockSlice.reducer;
