import axios from 'axios';

const api = axios.create({
    baseURL: 'https://profound-fascination-production-0fb5.up.railway.app/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;