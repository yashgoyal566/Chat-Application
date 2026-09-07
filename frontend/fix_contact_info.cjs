const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<ContactInfo user=\{selectedUser\} onClose=\{.*\} \/>/g,
  '<RightProfilePane user={selectedUser} onClose={() => setShowProfilePane(false)} />'
);

fs.writeFileSync(file, content);
console.log('Fixed ContactInfo -> RightProfilePane');
