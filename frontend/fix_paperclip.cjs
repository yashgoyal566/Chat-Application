const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Put the Paperclip button back in between Smile and Mic
content = content.replace(
  /<button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Smile size=\{20\} \nstrokeWidth=\{2\} \/><\/button>\s*<button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Mic size=\{20\}/m,
  `<button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Smile size={20} strokeWidth={2} /></button>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <Paperclip size={20} strokeWidth={2} />
              </button>
              <button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Mic size={20}`
);

// We should also verify if the old ImageIcon is still lurking around somewhere!
content = content.replace(
  /<button\s*type="button"\s*onClick=\{\(\) => fileInputRef\.current\?\.click\(\)\}\s*className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"[\s\S]*?<ImageIcon size=\{20\} \/>\s*<\/button>/m,
  ""
);

fs.writeFileSync(file, content);
console.log('Fixed paperclip!');
