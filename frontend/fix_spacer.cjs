const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace `<div ref={messagesEndRef} />` with `<div className="h-[120px] shrink-0 pointer-events-none" /><div ref={messagesEndRef} />`
content = content.replace(
  /<div ref=\{messagesEndRef\} \/>/g,
  '<div className="h-[120px] shrink-0 pointer-events-none" /><div ref={messagesEndRef} />'
);

fs.writeFileSync(file, content);
console.log('Added spacer!');
