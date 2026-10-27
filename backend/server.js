import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import groupRoutes from './routes/group.routes.js';

import { app, server } from './sockets/socket.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
