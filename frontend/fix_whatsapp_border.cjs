const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Fix the rounded corners on the reply box to make the left edge perfectly flat (WhatsApp style)
content = content.replace(
  /rounded-l-sm rounded-r-md border-l-\[4px\] pl-1\.5 pr-3 py-1/g,
  "rounded-l-none rounded-r-lg border-l-[4px] pl-2 pr-3 py-1"
);

fs.writeFileSync(file, content);
