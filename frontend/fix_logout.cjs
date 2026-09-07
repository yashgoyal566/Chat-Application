const fs = require('fs');
const file = 'src/context/useAuthStore.js';
let content = fs.readFileSync(file, 'utf8');

// Add import if needed
if (!content.includes('useChatStore')) {
  content = content.replace(
    "import toast from 'react-hot-toast';",
    "import toast from 'react-hot-toast';\nimport { useChatStore } from './useChatStore';"
  );
}

// Update logout
content = content.replace(
  /set\(\{ authUser: null \}\);/g,
  "set({ authUser: null });\n      useChatStore.getState().setSelectedUser(null);"
);

fs.writeFileSync(file, content);
console.log('Cleared selectedUser on logout!');
