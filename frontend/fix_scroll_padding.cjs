const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure the scroll container has the padding
content = content.replace(
  /<div className="flex-1 overflow-y-auto px-6 py-6">/m,
  '<div className="flex-1 overflow-y-auto px-6 pt-6 pb-[140px]">'
);

// To be absolutely safe, let's also inject a spacer div right above the messagesEndRef
content = content.replace(
  /<\/div>\s*\}\)\}\s*<\/div>\s*\)\}\s*<div ref=\{messagesEndRef\} \/>/m,
  `</div>
            )}
            <div className="h-[100px] shrink-0 pointer-events-none" />
            <div ref={messagesEndRef} />`
);

fs.writeFileSync(file, content);
console.log('Fixed padding!');
