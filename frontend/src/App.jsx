import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/useAuthStore';
import { useSocketStore } from './context/useSocketStore';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ChatLayout from './components/layout/ChatLayout';

export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [authUser, connectSocket, disconnectSocket]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader className="h-10 w-10 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={authUser ? <ChatLayout /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}
