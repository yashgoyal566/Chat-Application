const fs = require('fs');

// 1. Update Message.js
let messageModel = fs.readFileSync('backend/models/Message.js', 'utf8');
if (!messageModel.includes('isPinned:')) {
  messageModel = messageModel.replace(
    /replyTo: \{[\s\S]*?\},/,
    "$& \n    isPinned: {\n      type: Boolean,\n      default: false,\n    },"
  );
  fs.writeFileSync('backend/models/Message.js', messageModel);
  console.log('Updated Message.js');
}

// 2. Update message.controller.js
let messageController = fs.readFileSync('backend/controllers/message.controller.js', 'utf8');
if (!messageController.includes('togglePinMessage')) {
  const togglePinFunc = `\n\nexport const togglePinMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.isPinned = !message.isPinned;
    await message.save();

    // Broadcast to the conversation room
    io.to(message.conversation.toString()).emit("message_updated", {
      messageId: message._id,
      changes: { isPinned: message.isPinned }
    });

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error("Error toggling pin:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};\n`;
  messageController += togglePinFunc;
  fs.writeFileSync('backend/controllers/message.controller.js', messageController);
  console.log('Updated message.controller.js');
}

// 3. Update message.routes.js
let messageRoutes = fs.readFileSync('backend/routes/message.routes.js', 'utf8');
if (!messageRoutes.includes('togglePinMessage')) {
  messageRoutes = messageRoutes.replace(
    /import \{ sendMessage, getMessages \} from '\.\.\/controllers\/message\.controller\.js';/,
    "import { sendMessage, getMessages, togglePinMessage } from '../controllers/message.controller.js';"
  );
  messageRoutes = messageRoutes.replace(
    /router\.post\('\/send\/:id', protect, sendMessage\);/,
    "router.post('/send/:id', protect, sendMessage);\nrouter.put('/:id/pin', protect, togglePinMessage);"
  );
  fs.writeFileSync('backend/routes/message.routes.js', messageRoutes);
  console.log('Updated message.routes.js');
}
