const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// The block to remove:
/*
<button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Smile size={20} strokeWidth={2} /></button>
<button 
  type="button" 
  onClick={() => fileInputRef.current?.click()}
  className="hover:text-zinc-600 dark:hover:text-zinc-300"
>
  <Paperclip size={20} strokeWidth={2} />
</button>
<button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Mic size={20} strokeWidth={2} /></button>
*/

content = content.replace(
  /<button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Smile size=\{20\} strokeWidth=\{2\} \/><\/button>[\s\S]*?<button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Mic size=\{20\} strokeWidth=\{2\} \/><\/button>/m,
  ''
);

fs.writeFileSync(file, content);
console.log('Removed right toolbar icons');
