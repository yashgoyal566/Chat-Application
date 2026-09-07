const fs = require('fs');
const file = 'frontend/src/context/useChatStore.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { persist }')) {
  content = content.replace(
    "import { create } from 'zustand';",
    "import { create } from 'zustand';\nimport { persist } from 'zustand/middleware';"
  );
  
  content = content.replace(
    "export const useChatStore = create((set, get) => ({",
    "export const useChatStore = create(persist((set, get) => ({"
  );
  
  content = content.replace(
    /\}\)\);/g,
    "}), { name: 'chat-storage', partialize: (state) => ({ selectedUser: state.selectedUser }) }));"
  );
  
  fs.writeFileSync(file, content);
}
