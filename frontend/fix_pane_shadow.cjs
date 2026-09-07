const fs = require('fs');
const file = 'src/components/chat/RightProfilePane.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove the shadow-xl and z-20 so it sits perfectly flat next to the chat window
content = content.replace(
  /className="flex w-80 flex-col border-l border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 shadow-xl z-20 transition-all duration-300 animate-in slide-in-from-right-10"/g,
  'className="flex w-80 flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300 animate-in slide-in-from-right-10 shrink-0"'
);

fs.writeFileSync(file, content);
console.log('Removed floating shadow effects from profile pane!');
