const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the padding classes
content = content.replace(
  /pl-2\.5 pr-4 py-1\.5/g,
  "pl-1.5 pr-3 py-1"
);

fs.writeFileSync(file, content);
