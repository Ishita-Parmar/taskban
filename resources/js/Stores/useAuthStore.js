import { create } from 'zustand';
import axios from '../lib/axios';

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: true,
    
    fetchUser: async () => {
        try {
            const response = await axios.get('/user');
            set({ user: response.data, isLoading: false });
        } catch (error) {
            set({ user: null, isLoading: false });
        }
    },
    
    login: async (credentials) => {
        const response = await axios.post('/login', credentials);
        localStorage.setItem('auth_token', response.data.access_token);
        set({ user: response.data.user });
    },
    
    register: async (credentials) => {
        const response = await axios.post('/register', credentials);
        localStorage.setItem('auth_token', response.data.access_token);
        set({ user: response.data.user });
    },
    
    logout: async () => {
        try {
            await axios.post('/logout');
        } catch (e) {}
        localStorage.removeItem('auth_token');
        set({ user: null });
    }
}));
