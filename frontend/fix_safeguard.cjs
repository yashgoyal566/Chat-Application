const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\{content\.trim\(\) && \(/g,
  '{(content || \'\').replace(/<[^>]*>?/gm, \'\').trim() && ('
);

fs.writeFileSync(file, content);
console.log('Safeguarded send button!');
