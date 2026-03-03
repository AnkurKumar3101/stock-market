import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout & UI Contexts
import AppLayout from './components/Layout/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import StockList from './pages/StockList';
import StockDetails from './pages/StockDetails';
import PortfolioList from './pages/PortfolioList';
import AdminPanel from './pages/AdminPanel';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<AppLayout />}>
                <Route index element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="stocks" element={
                    <ProtectedRoute>
                        <StockList />
                    </ProtectedRoute>
                } />
                <Route path="stocks/:id" element={
                    <ProtectedRoute>
                        <StockDetails />
                    </ProtectedRoute>
                } />
                <Route path="portfolio" element={
                    <ProtectedRoute>
                        <PortfolioList />
                    </ProtectedRoute>
                } />
                <Route path="watchlist" element={
                    <ProtectedRoute>
                        <PortfolioList />
                    </ProtectedRoute>
                } />
                <Route path="admin" element={
                    <ProtectedRoute adminOnly={true}>
                        <AdminPanel />
                    </ProtectedRoute>
                } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;
