import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import User from '../models/User.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingInterval: 10000, // 10s ping to keep cloud proxy alive
  pingTimeout: 5000,    // 5s wait for pong
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  },
});

// Map of userId -> Set of active socketIds
const userSocketMap = {}; 

export const getReceiverSocketId = (receiverId) => {
  const set = userSocketMap[receiverId];
  if (set && set.size > 0) {
    return Array.from(set)[0];
  }
  return null;
};

io.on('connection', (socket) => {
  const rawUserId = socket.handshake.query.userId;
  const userId = rawUserId && rawUserId !== 'undefined' ? rawUserId.toString() : null;

  if (userId) {
    // Join a room named after the user's ID for bulletproof message routing
    socket.join(userId);

    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);

    // Broadcast list of active online user IDs
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
    console.log(`User connected: ${userId} (socket ${socket.id}). Online count: ${Object.keys(userSocketMap).length}`);
  }

  // Room-based typing events
  socket.on('typing', ({ receiverId }) => {
    if (receiverId) {
      io.to(receiverId.toString()).emit('typing', { senderId: userId });
    }
  });

  socket.on('stop_typing', ({ receiverId }) => {
    if (receiverId) {
      io.to(receiverId.toString()).emit('stop_typing', { senderId: userId });
    }
  });

  socket.on('disconnect', (reason) => {
    if (userId && userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);
      if (userSocketMap[userId].size === 0) {
        delete userSocketMap[userId];
      }
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
      console.log(`Socket disconnected: ${socket.id} (${reason}). Online count: ${Object.keys(userSocketMap).length}`);
    }
  });
});

export { app, io, server };
