const fs = require('fs');
const file = 'src/context/useChatStore.js';
let content = fs.readFileSync(file, 'utf8');

// Add drafts state
content = content.replace(
  'selectedUser: null,',
  'selectedUser: null,\n  drafts: {},'
);

// Add setDraft method
content = content.replace(
  'setReplyingTo: (message) => set({ replyingTo: message }),',
  "setReplyingTo: (message) => set({ replyingTo: message }),\n  setDraft: (userId, text) => set((state) => ({ drafts: { ...state.drafts, [userId]: text } })),"
);

// Add drafts to partialize
content = content.replace(
  /partialize: \(state\) => \(\{ selectedUser: state\.selectedUser, replyingTo: state\.replyingTo \}\)/,
  'partialize: (state) => ({ selectedUser: state.selectedUser, replyingTo: state.replyingTo, drafts: state.drafts })'
);

fs.writeFileSync(file, content);
console.log('Added drafts to chat store!');
