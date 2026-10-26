const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'backend/.env' });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Message = require('./backend/models/Message.js').default || require('./backend/models/Message.js');
  const msg = await Message.findOne();
  if (msg) {
    console.log('Found message:', msg._id);
    console.log('Is pinned?', msg.isPinned);
    
    // Test the API directly by calling the controller logic
    msg.isPinned = !msg.isPinned;
    await msg.save();
    console.log('Successfully saved pin status as:', msg.isPinned);
  } else {
    console.log('No messages found');
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
