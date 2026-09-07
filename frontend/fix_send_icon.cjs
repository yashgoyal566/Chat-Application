const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add ArrowUp to the imports
if (!content.includes('ArrowUp')) {
  content = content.replace(
    "import { Send, Loader2, X, Reply, Bold, Italic, Underline, Smile, Paperclip, Mic } from 'lucide-react';",
    "import { Send, Loader2, X, Reply, Bold, Italic, Underline, Smile, Paperclip, Mic, ArrowUp } from 'lucide-react';"
  );
}

// 2. Replace the Send paper airplane with the ArrowUp icon and remove the off-center margin
content = content.replace(
  /<Send size=\{14\} className="ml-\[2px\]" \/>/g,
  '<ArrowUp size={16} strokeWidth={2.5} />'
);

fs.writeFileSync(file, content);
console.log('Fixed send icon!');
