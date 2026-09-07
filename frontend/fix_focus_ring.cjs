const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the old ring styling with a sleek modern blue glow
content = content.replace(
  /focus-within:ring-2 focus-within:ring-brand-primary\/20/g,
  'focus-within:border-[#007AFF]/40 focus-within:ring-4 focus-within:ring-[#007AFF]/10'
);

fs.writeFileSync(file, content);
console.log('Updated input focus ring!');
