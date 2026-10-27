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
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // { userId: socketId }

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
    // Broadcast online users
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
    console.log('Online Users:', Object.keys(userSocketMap));
  }

  socket.on('typing', ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', { senderId: userId });
    }
  });
  

  socket.on('stop_typing', ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('stop_typing', { senderId: userId });
    }
  });


  socket.on('disconnect', () => {
    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    console.log('Online Users:', Object.keys(userSocketMap));
    }
  });
});

export { app, io, server };
