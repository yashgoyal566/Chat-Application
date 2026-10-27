import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';
import { useChatStore } from './useChatStore';

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],
  
  connectSocket: () => {
    const authUser = useAuthStore.getState().authUser;
    if (!authUser) return;

    if (get().socket?.connected) return;

    if (get().socket) {
      get().socket.disconnect();
    }

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
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully:', socket.id);
      useChatStore.getState().listenToMessages();
    });

    socket.io?.on('reconnect', () => {
      console.log('Socket reconnected successfully:', socket.id);
      useChatStore.getState().listenToMessages();
    });

    socket.on('getOnlineUsers', (users) => {
      set({ onlineUsers: users });
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    if (get().socket) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));
