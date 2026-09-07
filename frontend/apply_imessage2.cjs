const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// The class name block for the message bubble is:
/*
                    <div
                      className={`relative rounded-2xl px-4 py-2 ${
                        isMe
                          ? 'bg-brand-primary text-white rounded-br-sm'
                          : 'bg-white text-zinc-900 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 rounded-bl-sm'
                      } ${highlightedMsgId === msg._id ? 'ring-2 ring-brand-primary ring-offset-2 dark:ring-offset-zinc-950' : ''}`}
                    >
*/

// Let's just find and replace "bg-brand-primary text-white rounded-br-sm" and the light one.
content = content.replace(/'bg-brand-primary text-white rounded-br-sm'/g, "'bg-blue-600 text-white rounded-br-sm'");
content = content.replace(/'bg-white text-zinc-900 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 rounded-bl-sm'/g, "'bg-[#E5E5EA] text-black dark:bg-zinc-800 dark:text-zinc-100 rounded-bl-sm'");

// Also let's ensure the time text is light blue instead of brand-primary/40
content = content.replace(/text-brand-primary\/40 text-blue-100/g, "text-blue-200");

fs.writeFileSync(file, content);
