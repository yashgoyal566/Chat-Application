const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /className="mb-0\.5 whitespace-pre-wrap break-words \[word-break:break-word\] \[overflow-wrap:anywhere\]"/g,
  'className="mb-0.5 whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere]"'
);

fs.writeFileSync(file, content);
console.log('Applied strict word breaking to inner span');
