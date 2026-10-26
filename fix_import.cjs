const fs = require('fs');
const file = 'frontend/src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /import \{ Send, Loader2, X, Reply, Bold, Italic, Underline, Smile, Paperclip, Mic, ArrowUp \} from 'lucide-react';/,
  "import { Send, Loader2, X, Reply, Bold, Italic, Underline, Smile, Paperclip, Mic, ArrowUp, Pin } from 'lucide-react';"
);

fs.writeFileSync(file, content);
console.log('Fixed missing Pin import!');
