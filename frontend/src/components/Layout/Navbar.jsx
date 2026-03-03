import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import { FaSignOutAlt, FaBars, FaWallet } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    return (
        <nav className="glass dark:glass-dark sticky top-0 z-40 border-b border-white/20 dark:border-slate-800 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-[72px]">
                    <div className="flex items-center">
                        {user && (
                            <button
                                onClick={toggleSidebar}
                                className="mr-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors lg:hidden"
                            >
                                <FaBars size={22} />
                            </button>
                        )}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                                SB
                            </div>
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">
                                Stocks
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                <div className="hidden sm:flex items-center gap-4 bg-slate-100/50 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 backdrop-blur-sm shadow-sm">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Trader</span>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-full shadow-inner text-sm">
                                        <FaWallet />
                                        <span>${(user.walletBalance || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="p-2 sm:px-4 sm:py-2 flex items-center gap-2 text-sm font-bold text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full transition-colors shadow-sm"
                                    title="Logout"
                                >
                                    <FaSignOutAlt className="text-lg sm:text-base" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 text-sm font-bold transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-6 py-2 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg">
                                    Start Trading
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
