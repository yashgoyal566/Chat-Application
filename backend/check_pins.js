import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  const db = mongoose.connection.db;
  const messages = await db.collection('messages').find({ isPinned: true }).toArray();
  console.log('Number of pinned messages in DB:', messages.length);
  process.exit(0);
};

run().catch(console.error);
