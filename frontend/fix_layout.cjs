const fs = require('fs');
const file = 'src/components/layout/ChatLayout.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<button className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">\s*<Settings size=\{20\} \/>\s*<\/button>/m,
  ''
);

fs.writeFileSync(file, content);
