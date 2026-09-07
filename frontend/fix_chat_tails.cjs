const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// The exact bubble container regex
const bubbleContainerRegex = /<div\s+className=\{`relative flex flex-col rounded-\[20px\] px-\[16px\] py-\[10px\] text-\[15px\] leading-\[1\.3\] \$\{\s*isHighlighted \? 'ring-2 ring-brand-primary ring-offset-2' : ''\s*\} \$\{\s*isMe\s*\? 'bg-\[#007AFF\] text-white rounded-br-\[4px\]'\s*: 'bg-\[#E5E5EA\] text-black rounded-bl-\[4px\] dark:bg-\[#262628\] dark:text-white'\s*\}`\}\s*>/m;

const newBubbleContainer = `<div
                            className={\`relative flex flex-col rounded-[20px] px-[16px] py-[10px] text-[15px] leading-[1.3] \${
                              isHighlighted ? 'ring-2 ring-brand-primary ring-offset-2' : ''
                            } \${
                              isMe
                                ? 'bg-[#007AFF] text-white rounded-br-[4px]'
                                : 'bg-[#E5E5EA] text-black rounded-bl-[4px] dark:bg-[#262628] dark:text-white'
                            }\`}
                          >
                            {/* iMessage SVG Tails */}
                            {isMe ? (
                              <svg viewBox="0 0 8 13" width="8" height="13" className="absolute -right-[7px] bottom-[0px] text-[#007AFF] fill-current">
                                <path d="M.522.616c.394 2.82 2.19 6.208 7.373 8.356v3.136c-5.748-1.547-8.326-6.136-7.89-11.492H.523Z" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 8 13" width="8" height="13" className="absolute -left-[7px] bottom-[0px] text-[#E5E5EA] dark:text-[#262628] fill-current">
                                <path d="M7.478.616C7.084 3.436 5.288 6.824.105 8.972v3.136c5.748-1.547 8.326-6.136 7.89-11.492H7.477Z" />
                              </svg>
                            )}`;

content = content.replace(bubbleContainerRegex, newBubbleContainer);

// Also we should ensure the bubble doesn't get squished by the flex parent since we added a tail. 
// The tail is absolute so it doesn't affect flow, but we need to ensure the parent has margin if it touches the avatar.
// But the incoming avatar is at `mr-2` (8px), and the tail extends 7px into that gap. So it fits perfectly!

fs.writeFileSync(file, content);
console.log('Tails added!');
