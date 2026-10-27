import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],
  
  connectSocket: () => {
    const authUser = useAuthStore.getState().authUser;
    if (!authUser) return;

    const getSocketUrl = () => {
      if (import.meta.env.MODE === 'development') {
        return 'http://localhost:3002';
      }
      const envUrl = import.meta.env.VITE_BACKEND_URL;
      if (envUrl) {
        return envUrl.replace(/\/+$/, '').replace(/\/api$/, '');
      }
      return 'https://chat-application-1-brgc.onrender.com';
    };

    const SOCKET_URL = getSocketUrl();

    const socket = io(SOCKET_URL, {
      query: { userId: authUser._id },
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('getOnlineUsers', (users) => {
      set({ onlineUsers: users });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));
