import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex flex-col flex-1 w-full overflow-hidden">
                <Navbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto overflow-x-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </div>
    );
};

export default AppLayout;
