const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /setContent\(''\);\s*setImage\(null\);/m,
  "setContent('');\n    localStorage.removeItem(`draft_${selectedUser._id}`);\n    setImage(null);"
);

fs.writeFileSync(file, content);
