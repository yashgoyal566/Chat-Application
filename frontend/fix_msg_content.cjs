const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\{msg\.content && <span className="mb-0\.5">\{msg\.content\}<\/span>\}/g,
  '{msg.content && <span className="mb-0.5 whitespace-pre-wrap">{parseFormattedText(msg.content)}</span>}'
);

fs.writeFileSync(file, content);
console.log('Fixed msg.content rendering!');
