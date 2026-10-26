const fs = require('fs');
const file = 'frontend/src/context/useChatStore.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('togglePinMessage')) {
  // Add togglePinMessage API action
  content = content.replace(
    /setReplyingTo: \(message\) => set\(\{ replyingTo: message \}\),/,
    `setReplyingTo: (message) => set({ replyingTo: message }),
  
  togglePinMessage: async (messageId) => {
    try {
      await axiosInstance.put(\`/messages/\${messageId}/pin\`);
    } catch (error) {
      toast.error('Failed to pin message');
    }
  },`
  );
}

if (!content.includes('socket.on("message_updated"')) {
  // Add socket listener for message_updated
  const messageUpdatedListener = `    socket.on("message_updated", (updatedData) => {
      set((state) => ({
        messages: state.messages.map((msg) => 
          msg._id === updatedData.messageId 
            ? { ...msg, ...updatedData.changes } 
            : msg
        )
      }));
    });

    socket.on("receive_message"`;
    
  content = content.replace(/socket\.on\("receive_message"/, messageUpdatedListener);
}

fs.writeFileSync(file, content);
console.log('Fixed useChatStore.js!');
