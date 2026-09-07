const fs = require('fs');
const file = 'src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /item\.lastMessage\.content\)/g,
  "item.lastMessage.content?.replace(/<[^>]*>?/gm, ''))"
);

fs.writeFileSync(file, content);
console.log('Stripped HTML in sidebar preview!');
