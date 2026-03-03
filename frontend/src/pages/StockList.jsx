import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStocks } from '../features/stocks/stockSlice';
import Spinner from '../components/UI/Spinner';
import { FaSearch, FaAngleRight, FaChartLine } from 'react-icons/fa';

const StockList = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');

    const { stocks, isLoading, page, pages } = useSelector((state) => state.stocks);

    useEffect(() => {
        dispatch(fetchStocks({ keyword: searchTerm, pageNumber: 1 }));
    }, [dispatch, searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Market <span className="text-gradient">Overview</span>
                    </h1>
                    <p className="text-base text-slate-500 dark:text-slate-400">
                        Discover, track, and trade the top US Stocks in real-time.
                    </p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaSearch className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search symbol or company..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-md"
                    />
                </div>
            </div>

            {/* List Section */}
            <div>
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Spinner />
                    </div>
                ) : stocks.length === 0 ? (
                    <div className="py-20 text-center glass rounded-3xl dark:glass-dark">
                        <FaChartLine className="mx-auto text-6xl text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">No stocks found</h3>
                        <p className="text-slate-400 dark:text-slate-500">
                            Try adjusting your search term: "{searchTerm}"
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {stocks.map((stock, index) => (
                            <Link
                                to={`/stocks/${stock._id}`}
                                key={stock._id}
                                className="group relative bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Subtle Background Gradient on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {stock.symbol}
                                            </h2>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate max-w-[140px]" title={stock.companyName}>
                                                {stock.companyName}
                                            </p>
                                        </div>
                                        <div className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                            {stock.sector || 'Equities'}
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between mt-8">
                                        <div>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1 font-semibold uppercase tracking-wider">Current Price</p>
                                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                                                ${stock.currentPrice.toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors shadow-sm cursor-pointer">
                                            <FaAngleRight className="text-xl group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination Space Placeholder */}
            {pages > 1 && (
                <div className="flex justify-center mt-12 gap-2 pb-8">
                    {/* Add actual pagination component if needed */}
                </div>
            )}
        </div>
    );
};

export default StockList;
