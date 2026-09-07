const fs = require('fs');
const file = 'frontend/src/context/useChatStore.js';
let content = fs.readFileSync(file, 'utf8');

// Fix the accidental global replacement inside listenToMessages
content = content.replace(
  "set((state) => ({ messages: [...state.messages, newMessage] }), { name: 'chat-storage', partialize: (state) => ({ selectedUser: state.selectedUser }) }));",
  "set((state) => ({ messages: [...state.messages, newMessage] }));"
);

fs.writeFileSync(file, content);
