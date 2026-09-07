const fs = require('fs');
const file = 'src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

const newParagraph = `<p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {item.isGroup ? 'Group Chat' : isOnline ? 'Online' : 'Offline'}
                  </p>`;

content = content.replace(/<p className="truncate text-xs text-zinc-500 dark:text-zinc-400">\s*\{item\.isGroup \? 'Group Chat' : `@\$\{item\.username\}`\}\s*<\/p>/m, newParagraph);

fs.writeFileSync(file, content);
