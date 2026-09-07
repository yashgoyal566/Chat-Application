const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add explicit text-zinc-400 to the buttons to prevent the mount transition glitch
content = content.replace(
  /className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Bold/g,
  'className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Bold'
);
content = content.replace(
  /className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Italic/g,
  'className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Italic'
);
content = content.replace(
  /className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Underline/g,
  'className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Underline'
);

fs.writeFileSync(file, content);
console.log('Fixed icon color flicker!');
