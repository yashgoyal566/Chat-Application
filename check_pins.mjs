import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: 'backend/.env' });

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  // Use raw collection to avoid module issues
  const db = mongoose.connection.db;
  const messages = await db.collection('messages').find({ isPinned: true }).toArray();
  console.log('Number of pinned messages in DB:', messages.length);
  process.exit(0);
};

run().catch(console.error);
