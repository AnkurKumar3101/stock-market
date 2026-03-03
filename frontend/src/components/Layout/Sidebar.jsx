import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaChartLine,
    FaWallet,
    FaList,
    FaCog,
    FaSearchDollar,
    FaTimes
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) return null;

    const getLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${isActive
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-[1.02]'
            : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400'
        }`;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar Content */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:translate-x-0 lg:static lg:inset-auto text-sm ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between h-[72px] px-6 lg:hidden border-b border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Menu</span>
                    <button onClick={toggleSidebar} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-1 h-full overflow-y-auto no-scrollbar pt-6">
                    <div className="mb-8 px-4 lg:hidden bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 opacity-70">Account</p>
                        <p className="font-bold text-slate-900 dark:text-white text-base">{user.name}</p>
                        <p className="text-green-500 font-bold mt-1 text-lg">${(user.walletBalance || 0).toLocaleString()}</p>
                    </div>

                    <div className="mb-6">
                        <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Platform</p>
                        <div className="space-y-1">
                            <NavLink to="/" end className={getLinkClass} onClick={() => window.innerWidth < 1024 && toggleSidebar()}>
                                <FaChartLine className="text-lg opacity-80" />
                                <span>Dashboard</span>
                            </NavLink>
                            <NavLink to="/stocks" className={getLinkClass} onClick={() => window.innerWidth < 1024 && toggleSidebar()}>
                                <FaSearchDollar className="text-lg opacity-80" />
                                <span>Market Overview</span>
                            </NavLink>
                            <NavLink to="/portfolio" className={getLinkClass} onClick={() => window.innerWidth < 1024 && toggleSidebar()}>
                                <FaWallet className="text-lg opacity-80" />
                                <span>My Portfolio</span>
                            </NavLink>
                            <NavLink to="/watchlist" className={getLinkClass} onClick={() => window.innerWidth < 1024 && toggleSidebar()}>
                                <FaList className="text-lg opacity-80" />
                                <span>Watchlist</span>
                            </NavLink>
                        </div>
                    </div>

                    {user.role === 'admin' && (
                        <div className="mt-8">
                            <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">Administration</p>
                            <NavLink to="/admin" className={getLinkClass} onClick={() => window.innerWidth < 1024 && toggleSidebar()}>
                                <FaCog className="text-lg opacity-80" />
                                <span>Admin Panel</span>
                            </NavLink>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
