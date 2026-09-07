import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3002/api',
  withCredentials: true,
});

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      set({ authUser: res.data.data });
    } catch (error) {
      console.log('Error in checkAuth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/register', data);
      set({ authUser: res.data.data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || 'Signup failed' };
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data.data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
    } catch (error) {
      console.log('Error in logout:', error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put('/users/profile', data);
      set({ authUser: res.data.data });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.log('Error in updateProfile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
