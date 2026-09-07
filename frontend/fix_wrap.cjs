const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<span className="mb-0\.5 whitespace-pre-wrap" dangerouslySetInnerHTML=\{\{ __html: msg\.content \}\} \/>/g,
  '<span className="mb-0.5 whitespace-pre-wrap break-words [word-break:break-word]" dangerouslySetInnerHTML={{ __html: msg.content }} />'
);

fs.writeFileSync(file, content);
console.log('Fixed message wrapping!');
