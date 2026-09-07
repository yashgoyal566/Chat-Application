const fs = require('fs');
const file = 'src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure that we handle cases where lastMessage is just an ID (e.g. before refresh)
content = content.replace(
  /item\.lastMessage\.image \? '📷 Photo' : item\.lastMessage\.content/g,
  "typeof item.lastMessage === 'string' ? 'Sent a message' : (item.lastMessage.image ? '\uD83D\uDCF7 Photo' : item.lastMessage.content)"
);

fs.writeFileSync(file, content);
