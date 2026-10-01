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
        await axios.get('/sanctum/csrf-cookie', { baseURL: '' });
        const response = await axios.post('/login', credentials);
        set({ user: response.data.user });
    },
    
    register: async (credentials) => {
        await axios.get('/sanctum/csrf-cookie', { baseURL: '' });
        const response = await axios.post('/register', credentials);
        set({ user: response.data.user });
    },
    
    logout: async () => {
        await axios.post('/logout');
        set({ user: null });
    }
}));
