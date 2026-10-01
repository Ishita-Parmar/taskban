import Axios from 'axios';

const axios = Axios.create({
    baseURL: '/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, // Required for Laravel Sanctum SPA Auth
});

export default axios;

// Add a response interceptor to handle 401 errors
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
