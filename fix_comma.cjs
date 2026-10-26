const fs = require('fs');
let content = fs.readFileSync('frontend/src/context/useChatStore.js', 'utf8');

// The file currently has a syntax error.
// togglePinMessage: async (messageId) => { ... }
//   setDraft: (userId, text) => set((state) => {
// We need to add a comma.

content = content.replace(
  /\s*\}\s*setDraft: \(userId, text\) => set/,
  `},\n  setDraft: (userId, text) => set`
);

fs.writeFileSync('frontend/src/context/useChatStore.js', content);
console.log('Fixed useChatStore comma!');
