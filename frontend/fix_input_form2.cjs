const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update imports
if (!content.includes('Bold, Italic')) {
  content = content.replace(
    "import { Send, Loader2, Image as ImageIcon, X, Reply } from 'lucide-react';",
    "import { Send, Loader2, Image as ImageIcon, X, Reply, Bold, Italic, Underline, Smile, Paperclip, Mic } from 'lucide-react';"
  );
}

// 2. Add handleKeyDown
if (!content.includes('const handleKeyDown =')) {
  content = content.replace(
    'const handleInputChange = (e) => {',
    `const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };
  
  const handleInputChange = (e) => {`
  );
}

// 3. Replace the form block
const formRegex = /<form[\s\S]*?onSubmit=\{handleSend\}[\s\S]*?<\/form>/m;

const newForm = `<form
          onSubmit={handleSend}
          className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-sm focus-within:ring-2 focus-within:ring-brand-primary/20 dark:border-zinc-800 dark:bg-zinc-900"
        >
          {/* Top row: Text area */}
          <textarea
            ref={messageInputRef}
            placeholder="Enter to send, Shift + Enter to add new line"
            value={content}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={2}
            className="w-full resize-none bg-transparent px-1 py-1 text-[15px] outline-none placeholder:text-zinc-400 dark:text-zinc-50 min-h-[40px]"
          />
          
          {/* Bottom row: Toolbars */}
          <div className="flex items-center justify-between px-1">
            {/* Formatting Tools (Left) */}
            <div className="flex items-center gap-4 text-zinc-400">
              <button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Bold size={18} strokeWidth={2.5} /></button>
              <button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Italic size={18} strokeWidth={2.5} /></button>
              <button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Underline size={18} strokeWidth={2.5} /></button>
            </div>
            
            {/* Attachment Tools (Right) */}
            <div className="flex items-center gap-4 text-zinc-400">
              <button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Smile size={20} strokeWidth={2} /></button>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <Paperclip size={20} strokeWidth={2} />
              </button>
              <button type="button" className="hover:text-zinc-600 dark:hover:text-zinc-300"><Mic size={20} strokeWidth={2} /></button>
              
              {/* Actual Send Button (Only show if there's text, otherwise hidden to match screenshot) */}
              {content.trim() && (
                <button
                  type="submit"
                  disabled={isSending}
                  className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#007AFF] text-white transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Send size={14} className="ml-[2px]" />
                </button>
              )}
            </div>
          </div>
        </form>`;

content = content.replace(formRegex, newForm);

// Remove the standalone ImageIcon button that was outside the form
content = content.replace(
  /<button\s*type="button"\s*onClick=\{\(\) => fileInputRef\.current\?\.click\(\)\}[\s\S]*?<\/button>/m,
  ""
);

fs.writeFileSync(file, content);
console.log('Replaced form correctly!');
