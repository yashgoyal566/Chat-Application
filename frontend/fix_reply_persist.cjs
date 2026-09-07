const fs = require('fs');
const file = 'src/context/useChatStore.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "partialize: (state) => ({ selectedUser: state.selectedUser })",
  "partialize: (state) => ({ selectedUser: state.selectedUser, replyingTo: state.replyingTo })"
);

fs.writeFileSync(file, content);
