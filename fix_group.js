const fs = require('fs');
const file = 'frontend/src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove the Plus button block
content = content.replace(
  /<button\s+onClick=\{\(\) => setIsCreatingGroup\(true\)\}[\s\S]*?<\/button>/m,
  ''
);

// Remove the AnimatePresence block
content = content.replace(
  /<AnimatePresence>[\s\S]*?<\/AnimatePresence>/m,
  ''
);

fs.writeFileSync(file, content);
