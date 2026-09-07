const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the <header ...> tag with <header onClick={...} ... cursor-pointer>
content = content.replace(
  /<header className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-white\/80 px-6 py-4 backdrop-blur-md dark:border-zinc-800\/60 dark:bg-zinc-950\/80">/g,
  '<header onClick={() => setShowProfilePane(!showProfilePane)} className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80 cursor-pointer hover:bg-white/90 transition-colors">'
);

fs.writeFileSync(file, content);
console.log('Fixed header click event!');
