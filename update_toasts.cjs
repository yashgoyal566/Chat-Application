const fs = require('fs');
let content = fs.readFileSync('frontend/src/context/useChatStore.js', 'utf8');

const oldToggle = /togglePinMessage: async \(messageId\) => \{[\s\S]*?toast\.error\('Failed to pin message'\);\s*\}/;

const newToggle = `togglePinMessage: async (messageId) => {
    try {
      const res = await axiosInstance.put(\`/messages/\${messageId}/pin\`);
      // Update the local state instantly
      set((state) => ({
        messages: state.messages.map((msg) => 
          msg._id === messageId ? { ...msg, isPinned: res.data.data.isPinned } : msg
        )
      }));
      if (res.data.data.isPinned) {
        toast.success("Message Pinned!");
      } else {
        toast.success("Message Unpinned!");
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to pin/unpin message');
    }
  }`;

content = content.replace(oldToggle, newToggle);
fs.writeFileSync('frontend/src/context/useChatStore.js', content);
console.log('Added success/unpin toasts to togglePinMessage!');
