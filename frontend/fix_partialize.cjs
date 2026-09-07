const fs = require('fs');
const file = 'src/context/useChatStore.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /partialize: \(state\) => \(\{ selectedUser: state\.selectedUser, replyingTo: state\.replyingTo \}\)/,
  "partialize: (state) => ({ drafts: state.drafts })"
);
content = content.replace(
  /partialize: \(state\) => \(\{ selectedUser: state\.selectedUser, replyingTo: state\.replyingTo, drafts: state\.drafts \}\)/,
  "partialize: (state) => ({ drafts: state.drafts })"
);

fs.writeFileSync(file, content);
console.log('Fixed partialize to ONLY persist drafts!');
