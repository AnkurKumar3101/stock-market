import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPortfolio } from '../features/portfolio/portfolioSlice';
import Card from '../components/UI/Card';
import Spinner from '../components/UI/Spinner';
import LineChart from '../components/Charts/LineChart';
import { FaWallet, FaChartPie, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { holdings, isLoading } = useSelector((state) => state.portfolio);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(fetchPortfolio());
    }, [user, navigate, dispatch]);

    if (isLoading || !user) return <Spinner />;

    // Calculate generic portfolio stats
    const totalInvested = holdings.reduce((acc, h) => acc + (h.quantity * h.averageBuyPrice), 0);
    const currentPortfolioValue = holdings.reduce((acc, h) => acc + (h.quantity * h.stock.currentPrice), 0);
    const totalValue = user.walletBalance + currentPortfolioValue;
    const initialValue = 100000; // Assuming static start for paper trading

    const totalProfitLoss = totalValue - initialValue;
    const plPercentage = ((totalProfitLoss / initialValue) * 100).toFixed(2);
    const isPositive = totalProfitLoss >= 0;

    // Mock chart data for demonstration purposes
    const mockChartData = Array.from({ length: 30 }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: initialValue + (Math.sin(i / 3) * 5000) + (i * 200),
    }));
    // Replace the last point with actual current value
    mockChartData[mockChartData.length - 1].value = totalValue;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.name}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-100 text-primary dark:bg-gray-700 dark:text-blue-400">
                            <FaWallet size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Purchasing Power</p>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                ${user.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-gray-700 dark:text-purple-400">
                            <FaChartPie size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Invested Value</p>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                ${currentPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 md:col-span-2">
                    <div className="flex flex-col h-full justify-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Account Value</p>
                        <div className="flex items-end gap-3">
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                            <div className={`flex items-center gap-1 text-sm font-semibold mb-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                                <span>${Math.abs(totalProfitLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({plPercentage}%)</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Chart Area */}
            <Card className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Portfolio Performance (30 Days)</h3>
                </div>
                <div className="h-72 w-full">
                    <LineChart data={mockChartData} isPositive={isPositive} />
                </div>
            </Card>

            {/* Quick Holdings view */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Holdings</h3>
                {holdings.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No active investments yet. Head to the Market to start trading.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <th className="px-4 py-3">Symbol</th>
                                    <th className="px-4 py-3">Shares</th>
                                    <th className="px-4 py-3">Avg Price</th>
                                    <th className="px-4 py-3">Current Price</th>
                                    <th className="px-4 py-3">Total Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {holdings.slice(0, 5).map((h) => (
                                    <tr key={h._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{h.stock.symbol}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{h.quantity}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">${h.averageBuyPrice.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">${h.stock.currentPrice.toFixed(2)}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">${(h.quantity * h.stock.currentPrice).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

        </div>
    );
};

export default Dashboard;
