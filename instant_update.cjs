const fs = require('fs');
let content = fs.readFileSync('frontend/src/context/useChatStore.js', 'utf8');

const oldToggle = /togglePinMessage: async \(messageId\) => \{\s*try \{\s*await axiosInstance\.put\(`\/messages\/\$\{messageId\}\/pin`\);\s*\} catch \(error\) \{\s*toast\.error\('Failed to pin message'\);\s*\}\s*\}/;

const newToggle = `togglePinMessage: async (messageId) => {
    try {
      const res = await axiosInstance.put(\`/messages/\${messageId}/pin\`);
      // Update the local state instantly so we don't have to wait for the socket!
      set((state) => ({
        messages: state.messages.map((msg) => 
          msg._id === messageId ? { ...msg, isPinned: res.data.data.isPinned } : msg
        )
      }));
    } catch (error) {
      console.error(error);
      toast.error('Failed to pin message');
    }
  }`;

content = content.replace(oldToggle, newToggle);
fs.writeFileSync('frontend/src/context/useChatStore.js', content);
console.log('Added instant UI update to useChatStore.js');
