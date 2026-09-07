const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /className="w-full resize-none bg-transparent px-1 py-1 text-\[15px\] outline-none dark:text-zinc-50 min-h-\[40px\] max-h-\[120px\] overflow-y-auto empty:before:content-\[attr\(placeholder\)\] empty:before:text-zinc-400"/g,
  'className="w-full resize-none bg-transparent px-1 py-1 text-[15px] outline-none dark:text-zinc-50 min-h-[40px] max-h-[120px] overflow-y-auto overflow-x-hidden break-words [word-break:break-word] empty:before:content-[attr(placeholder)] empty:before:text-zinc-400"'
);

fs.writeFileSync(file, content);
console.log('Fixed input wrapping!');
