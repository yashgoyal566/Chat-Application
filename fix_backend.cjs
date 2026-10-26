const fs = require('fs');

let messageController = fs.readFileSync('backend/controllers/message.controller.js', 'utf8');

const oldEmit = `    // Broadcast to the conversation room
    io.to(message.conversation.toString()).emit("message_updated", {
      messageId: message._id,
      changes: { isPinned: message.isPinned }
    });`;

const newEmit = `    // Find the conversation to get the participants
    const conversation = await Conversation.findById(message.conversation);
    if (conversation) {
      conversation.participants.forEach((participantId) => {
        const socketId = getReceiverSocketId(participantId.toString());
        if (socketId) {
          io.to(socketId).emit("message_updated", {
            messageId: message._id,
            changes: { isPinned: message.isPinned }
          });
        }
      });
    }`;

messageController = messageController.replace(oldEmit, newEmit);

fs.writeFileSync('backend/controllers/message.controller.js', messageController);
console.log('Fixed socket emit for pinned messages!');
