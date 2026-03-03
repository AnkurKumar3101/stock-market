import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import Spinner from '../components/UI/Spinner';
import Card from '../components/UI/Card';

const AdminPanel = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchAdminData = async () => {
            try {
                const { data } = await api.get('/admin/users');
                setUsers(data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load admin data');
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [user, navigate]);

    const handleSeedMockData = async () => {
        try {
            if (window.confirm('Are you sure you want to seed mock stock data? This clears current stocks.')) {
                await api.post('/stocks/seed');
                toast.success('Mock stock data seeded successfully');
            }
        } catch (error) {
            toast.error('Data seed failed');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage platform users and data</p>
                </div>
                <button
                    onClick={handleSeedMockData}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition shadow-md"
                >
                    Seed Mock Stocks
                </button>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Registered Users ({users.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Balance</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">{u._id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{u.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{u.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 dark:text-green-400 font-semibold">
                                        ${u.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminPanel;
