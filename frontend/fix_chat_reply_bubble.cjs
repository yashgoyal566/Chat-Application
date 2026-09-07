const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the old Reply buttons
// They look like: {/* Action Menu (Reply) */} ... </button>
content = content.replace(/\{\/\* Action Menu \(Reply\) \*\/\}\s*\{isMe && \(\s*<button[\s\S]*?<\/button>\s*\)\}/g, '');
content = content.replace(/\{\/\* Action Menu \(Reply\) \*\/\}\s*\{!isMe && \(\s*<button[\s\S]*?<\/button>\s*\)\}/g, '');

// 2. Inject the new floating Reply button INSIDE the "Actual Bubble" div
const actualBubbleRegex = /\{\/\* Actual Bubble \*\/\}\s*<div\s+className=\{`relative flex flex-col rounded-\[20px\]/m;

const floatingButton = `{/* Floating Reply Button (iMessage Reaction Style) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setReplyingTo(msg);
                            }}
                            className={\`absolute -top-3 \${isMe ? '-left-3' : '-right-3'} hidden group-hover:flex items-center justify-center h-8 w-8 rounded-full bg-[#007AFF] text-white ring-2 ring-white dark:ring-zinc-900 transition-transform hover:scale-110 z-20 cursor-pointer shadow-sm\`}
                          >
                            <Reply size={14} className="mt-[1px]" />
                            
                            {/* Thought dots tail */}
                            <span className={\`absolute -bottom-[3px] \${isMe ? 'left-[6px]' : 'right-[6px]'} w-[10px] h-[10px] rounded-full bg-[#007AFF] ring-2 ring-white dark:ring-zinc-900 -z-10\`}></span>
                            <span className={\`absolute -bottom-[9px] \${isMe ? 'left-[12px]' : 'right-[12px]'} w-[5px] h-[5px] rounded-full bg-[#007AFF] ring-2 ring-white dark:ring-zinc-900 -z-20\`}></span>
                          </button>
                          
                          {/* Actual Bubble */}
                          <div
                            className={\`relative flex flex-col rounded-[20px]`;

content = content.replace(actualBubbleRegex, floatingButton);

fs.writeFileSync(file, content);
console.log('Done!');
