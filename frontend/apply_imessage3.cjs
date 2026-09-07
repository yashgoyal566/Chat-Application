const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /'bg-white text-zinc-900 shadow-sm border border-zinc-100 rounded-bl-sm dark:bg-zinc-800\/80 dark:border-zinc-700\/50 dark:text-zinc-100 dark:shadow-none'/g,
  "'bg-[#E5E5EA] text-black rounded-bl-sm dark:bg-[#3A3A3C] dark:text-white'"
);

fs.writeFileSync(file, content);
