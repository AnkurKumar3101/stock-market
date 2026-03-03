import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPortfolio, fetchWatchlist } from '../features/portfolio/portfolioSlice';
import Spinner from '../components/UI/Spinner';
import Card from '../components/UI/Card';
import { FaTrash, FaExternalLinkAlt } from 'react-icons/fa';

const PortfolioList = () => {
    const dispatch = useDispatch();

    const { holdings, watchlist, isLoading } = useSelector((state) => state.portfolio);

    useEffect(() => {
        dispatch(fetchPortfolio());
        dispatch(fetchWatchlist());
    }, [dispatch]);

    if (isLoading) return <Spinner />;

    return (
        <div className="space-y-8">
            {/* Portfolio Section */}
            <section>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Portfolio</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your active investments</p>
                </div>

                <Card className="p-0 overflow-hidden">
                    {holdings.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            Your portfolio is empty. Head to the <Link to="/stocks" className="text-primary hover:underline">Market</Link> to start investing.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asset</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Shares</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Cost</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Price</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Return</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                                    {holdings.map((item) => {
                                        const totalCost = item.quantity * item.averageBuyPrice;
                                        const currentValue = item.quantity * item.stock.currentPrice;
                                        const pl = currentValue - totalCost;
                                        const plPercent = (pl / totalCost) * 100;
                                        const isPositive = pl >= 0;

                                        return (
                                            <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-bold text-gray-900 dark:text-white">{item.stock.symbol}</div>
                                                    <div className="text-xs text-gray-500">{item.stock.companyName}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900 dark:text-gray-300">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600 dark:text-gray-400">
                                                    ${item.averageBuyPrice.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600 dark:text-gray-400">
                                                    ${item.stock.currentPrice.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                                        {isPositive ? '+' : ''}${pl.toFixed(2)}
                                                        <span className="text-xs block">({isPositive ? '+' : ''}{plPercent.toFixed(2)}%)</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <Link to={`/stocks/${item.stock._id}`} className="text-primary hover:text-blue-700 transition" title="Trade">
                                                        <FaExternalLinkAlt className="mx-auto" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </section>

            {/* Watchlist Section */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Watchlist</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track stocks without buying</p>
                    </div>
                </div>

                <Card className="p-0 overflow-hidden">
                    {watchlist.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            Watchlist is empty.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                                    {watchlist.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 dark:text-white">{item.stock.symbol}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{item.stock.companyName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900 dark:text-white">${item.stock.currentPrice.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center gap-4">
                                                    <Link to={`/stocks/${item.stock._id}`} className="text-primary hover:text-blue-700 transition">
                                                        Trade
                                                    </Link>
                                                    <button className="text-red-500 hover:text-red-700 transition">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </section>
        </div>
    );
};

export default PortfolioList;
