const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add isInputFocused state
content = content.replace(
  /const \[isSending, setIsSending\] = useState\(false\);/,
  `const [isSending, setIsSending] = useState(false);\n  const [isInputFocused, setIsInputFocused] = useState(false);`
);

// 2. Add onFocus and onBlur to the contentEditable div
content = content.replace(
  /onInput=\{handleInputChange\}/,
  `onInput={handleInputChange}\n            onFocus={() => setIsInputFocused(true)}\n            onBlur={() => setIsInputFocused(false)}`
);

// 3. Conditionally render the Formatting Tools div
const formattingRegex = /\{\/\* Formatting Tools \(Left\) \*\/\}\s*<div className="flex items-center gap-4 text-zinc-400">[\s\S]*?<\/div>/m;

const newFormatting = `{/* Formatting Tools (Left) */}
            {((content || '').replace(/<[^>]*>?/gm, '').trim() || isInputFocused) && (
              <div className="flex items-center gap-4 text-zinc-400 animate-in fade-in zoom-in duration-200">
                <button type="button" onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }} className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Bold size={18} strokeWidth={2.5} /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }} className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Italic size={18} strokeWidth={2.5} /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }} className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Underline size={18} strokeWidth={2.5} /></button>
              </div>
            )}`;

content = content.replace(formattingRegex, newFormatting);

fs.writeFileSync(file, content);
console.log('Added conditional rendering to formatting toolbar!');
