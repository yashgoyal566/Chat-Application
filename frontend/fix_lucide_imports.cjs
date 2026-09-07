const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the lucide-react import regardless of what's currently in it
content = content.replace(
  /import\s+\{([^}]+)\}\s+from\s+'lucide-react';/,
  "import { Send, Loader2, X, Reply, Bold, Italic, Underline, Smile, Paperclip, Mic } from 'lucide-react';"
);

fs.writeFileSync(file, content);
console.log('Fixed imports!');
