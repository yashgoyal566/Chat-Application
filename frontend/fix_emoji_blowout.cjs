const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add min-w-0 to the wrapper
content = content.replace(
  /className=\{`flex items-end max-w-\[75%\] \$\{isMe \? 'flex-row-reverse' : 'flex-row'\}`\}/g,
  "className={`flex items-end min-w-0 max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}"
);

// Add min-w-0 to the Bubble Container
content = content.replace(
  /className=\{`flex flex-col \$\{isMe \? 'items-end' : 'items-start'\}`\}/g,
  "className={`flex flex-col min-w-0 ${isMe ? 'items-end' : 'items-start'}`}"
);

// Add overflow-wrap anywhere to the text span
content = content.replace(
  /className="mb-0\.5 whitespace-pre-wrap break-words \[word-break:break-word\]"/g,
  'className="mb-0.5 whitespace-pre-wrap break-words [word-break:break-word] [overflow-wrap:anywhere]"'
);

fs.writeFileSync(file, content);
console.log('Fixed flexbox blowout!');
