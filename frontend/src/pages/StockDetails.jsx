import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchStockDetails, clearStockDetails } from '../features/stocks/stockSlice';
import { buyStock, sellStock } from '../features/portfolio/portfolioSlice';
import Spinner from '../components/UI/Spinner';
import Card from '../components/UI/Card';
import LineChart from '../components/Charts/LineChart';
import { FaArrowLeft, FaShoppingCart, FaExchangeAlt } from 'react-icons/fa';

const StockDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [quantity, setQuantity] = useState('');
    const [isBuying, setIsBuying] = useState(true);

    const { user } = useSelector((state) => state.auth);
    const { stockDetails, isLoading: stockLoading } = useSelector((state) => state.stocks);
    const { holdings, isLoading: tradeLoading } = useSelector((state) => state.portfolio);

    useEffect(() => {
        dispatch(fetchStockDetails(id));
        return () => {
            dispatch(clearStockDetails());
        };
    }, [dispatch, id]);

    const existingHolding = holdings.find((h) => h.stock._id === id || h.stock === id);
    const sharesOwned = existingHolding ? existingHolding.quantity : 0;

    const handleTrade = async (e) => {
        e.preventDefault();
        const qty = Number(quantity);

        if (qty <= 0) {
            toast.error('Please enter a valid quantity');
            return;
        }

        const tradeData = { stockId: id, quantity: qty };

        if (isBuying) {
            const cost = qty * stockDetails.currentPrice;
            if (cost > user.walletBalance) {
                toast.error('Insufficient funds');
                return;
            }
            try {
                await dispatch(buyStock(tradeData)).unwrap();
                toast.success(`Successfully bought ${qty} shares of ${stockDetails.symbol}`);
                setQuantity('');
            } catch (err) {
                toast.error(err);
            }
        } else {
            if (qty > sharesOwned) {
                toast.error('Insufficient shares to sell');
                return;
            }
            try {
                await dispatch(sellStock(tradeData)).unwrap();
                toast.success(`Successfully sold ${qty} shares of ${stockDetails.symbol}`);
                setQuantity('');
            } catch (err) {
                toast.error(err);
            }
        }
    };

    if (stockLoading || !stockDetails) return <Spinner />;

    // Mock past data generator relative to current price for chart
    const currentPrice = stockDetails.currentPrice;
    const mockChartData = Array.from({ length: 30 }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: currentPrice * (1 + (Math.sin(i / 2) * 0.1) + ((i - 15) * 0.005))
    }));
    mockChartData[mockChartData.length - 1].value = currentPrice;

    const isPositive = mockChartData[29].value >= mockChartData[0].value;

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition"
            >
                <FaArrowLeft /> Back to Market
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details & Chart */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{stockDetails.symbol}</h1>
                                <p className="text-lg text-gray-500 dark:text-gray-400">{stockDetails.companyName}</p>
                                <div className="mt-2 inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                                    {stockDetails.sector || 'Equities'}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-black text-gray-900 dark:text-white">
                                    ${stockDetails.currentPrice.toFixed(2)}
                                </p>
                                {/* Mock daily change display */}
                                <p className={`text-sm font-semibold mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                    {isPositive ? '+' : '-'}${(currentPrice * 0.024).toFixed(2)} ({isPositive ? '+' : '-'}2.4%) Today
                                </p>
                            </div>
                        </div>

                        <div className="h-80 w-full mt-8">
                            <LineChart data={mockChartData} title={`${stockDetails.symbol} - 30 Day Trend`} isPositive={isPositive} />
                        </div>
                    </Card>
                </div>

                {/* Right Column - Trading Panel */}
                <div className="space-y-6">
                    <Card className="p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-t-4 border-t-primary">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <FaExchangeAlt className="text-primary" /> Execute Trade
                        </h3>

                        <div className="flex rounded-md p-1 bg-gray-200 dark:bg-gray-700 mb-6">
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition ${isBuying ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                                onClick={() => setIsBuying(true)}
                            >
                                Buy
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition ${!isBuying ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                                onClick={() => setIsBuying(false)}
                            >
                                Sell
                            </button>
                        </div>

                        <form onSubmit={handleTrade} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Quantity (Shares)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center"
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-400">
                                    <span>Current Price:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">${stockDetails.currentPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                                    <span>Estimated Total:</span>
                                    <span>${(Number(quantity) * stockDetails.currentPrice).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={tradeLoading}
                                className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isBuying
                                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    } disabled:opacity-50`}
                            >
                                <FaShoppingCart />
                                {isBuying ? 'Place Buy Order' : 'Place Sell Order'}
                            </button>
                        </form>

                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-gray-500 dark:text-gray-400">Buying Power</span>
                                <span className="font-semibold text-gray-900 dark:text-white">${user.walletBalance.toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 dark:text-gray-400">Shares Owned</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{sharesOwned}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StockDetails;
