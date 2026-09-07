const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Fix the syntax error by rewriting that specific block properly
const badBlockRegex = /\{\(\(content \|\| ''\)\.replace\(\/<\[\^>\]\*\>\?\/gm, ''\)\.trim\(\) \|\| isInputFocused\) && \([\s\S]*?<\/div>\n\s*\) : <div \/>\}/m;

const goodBlock = `{((content || '').replace(/<[^>]*>?/gm, '').trim() || isInputFocused) ? (
              <div className="flex items-center gap-4 text-zinc-400 animate-in fade-in zoom-in duration-200">
                <button type="button" onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }} className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Bold size={18} strokeWidth={2.5} /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }} className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Italic size={18} strokeWidth={2.5} /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }} className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Underline size={18} strokeWidth={2.5} /></button>
              </div>
            ) : <div />}`;

content = content.replace(badBlockRegex, goodBlock);

fs.writeFileSync(file, content);
console.log('Fixed syntax error!');
