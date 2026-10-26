const fs = require('fs');
let content = fs.readFileSync('frontend/src/context/useChatStore.js', 'utf8');

const oldToggle = /togglePinMessage: async \(messageId\) => \{[\s\S]*?toast\.error\('Failed to pin\/unpin message'\);\s*\}/;

const newToggle = `togglePinMessage: async (messageId) => {
    try {
      const res = await axiosInstance.put(\`/messages/\${messageId}/pin\`);
      
      // Safety check
      const pinnedState = res?.data?.data?.isPinned || false;
      
      set((state) => ({
        messages: state.messages.map((msg) => 
          msg._id === messageId ? { ...msg, isPinned: pinnedState } : msg
        )
      }));
      
      if (pinnedState) {
        toast.success("Message Pinned Successfully!");
      } else {
        toast.success("Message Unpinned Successfully!");
      }
    } catch (error) {
      console.error("Pin API Error:", error);
      const errMsg = error?.response?.data?.message || error.message || "Unknown error";
      toast.error(\`Failed: \${errMsg}\`);
    }
  }`;

content = content.replace(oldToggle, newToggle);
fs.writeFileSync('frontend/src/context/useChatStore.js', content);
console.log('Added better error toasts to useChatStore.js!');
