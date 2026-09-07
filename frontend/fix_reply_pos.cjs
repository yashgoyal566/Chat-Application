const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the floating button from its current broken position
const brokenButtonRegex = /\{\/\* Floating Reply Button \(iMessage Reaction Style\) \*\/\}\s*<button[\s\S]*?<\/button>\s*\{\/\* Actual Bubble \*\/\}\s*<div\s+className=\{`relative flex flex-col rounded-\[20px\]/m;

const actualBubbleCode = `{/* Actual Bubble */}
                          <div
                            className={\`relative flex flex-col rounded-[20px]`;

content = content.replace(brokenButtonRegex, actualBubbleCode);

// 2. Inject it INSIDE the Actual Bubble, right after the opening div
const insideBubbleRegex = /\{\/\* Actual Bubble \*\/\}\s*<div\s+className=\{`relative flex flex-col rounded-\[20px\] px-\[16px\] py-\[10px\] text-\[15px\] leading-\[1\.3\] \$\{\s*isHighlighted \? 'ring-2 ring-brand-primary ring-offset-2' : ''\s*\} \$\{\s*isMe\s*\n\s*\? 'bg-\[#007AFF\] text-white imessage-outgoing'\s*\n\s*: 'bg-\[#E5E5EA\] text-black imessage-incoming dark:bg-\[#262628\] dark:text-white'\s*\}\`\}\s*>/m;

const replacement = `
                          {/* Actual Bubble */}
                          <div
                            className={\`relative flex flex-col rounded-[20px] px-[16px] py-[10px] text-[15px] leading-[1.3] \${
                              isHighlighted ? 'ring-2 ring-brand-primary ring-offset-2' : ''
                            } \${
                              isMe
                                ? 'bg-[#007AFF] text-white imessage-outgoing'
                                : 'bg-[#E5E5EA] text-black imessage-incoming dark:bg-[#262628] dark:text-white'
                            }\`}
                          >
                            {/* Floating Reply Button (iMessage Reaction Style) */}
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
`;

content = content.replace(insideBubbleRegex, replacement);

fs.writeFileSync(file, content);
console.log('Fixed position!');
