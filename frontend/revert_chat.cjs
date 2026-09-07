const fs = require('fs');
const file = 'src/context/useChatStore.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { persist }')) {
  content = content.replace(
    "import { create } from 'zustand';",
    "import { create } from 'zustand';\nimport { persist } from 'zustand/middleware';"
  );
}

content = content.replace(
  /export const useChatStore = create\(\(set, get\) => \(\{/g,
  'export const useChatStore = create(persist((set, get) => ({'
);

content = content.replace(
  /  setReplyingTo: \(message\) => set\(\{ replyingTo: message \}\),\n\}\)\);/g,
  "  setReplyingTo: (message) => set({ replyingTo: message }),\n}), { name: 'chat-storage', partialize: (state) => ({ selectedUser: state.selectedUser, replyingTo: state.replyingTo }) }));"
);

fs.writeFileSync(file, content);
console.log('Reverted useChatStore.js');
