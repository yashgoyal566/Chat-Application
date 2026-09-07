const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Restore the beautiful rounded corners on the reply box!
content = content.replace(
  /rounded-l-none rounded-r-lg/g,
  "rounded-xl"
);

fs.writeFileSync(file, content);
