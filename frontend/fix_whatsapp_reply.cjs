const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the reply block container
const oldReplyBlockRegex = /className=\{`mb-1\.5 mt-0\.5 cursor-pointer rounded-md border-l-\[3px\] px-2\.5 py-1\.5 text-xs opacity-90 hover:opacity-100 \$\{\s*isMe \s*\? 'border-white\/60 bg-black\/10 text-white' \s*: 'border-\[#8E8E93\] bg-\[#D1D1D6\] text-black'\s*\}`\}/m;

const newReplyBlock = "className={`mb-1.5 mt-0.5 cursor-pointer rounded-lg border-l-[4px] p-2 text-[13px] leading-tight transition-opacity hover:opacity-90 ${\n                            isMe \n                              ? 'border-[#90CAF9] bg-black/10 text-white/90' \n                              : 'border-[#027EB5] bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300'\n                          }`}";

content = content.replace(oldReplyBlockRegex, newReplyBlock);

// Replace the sender name styling inside the reply block
const oldNameRegex = /<p className="font-bold opacity-80">\{msg\.replyTo\.sender\?\.fullName \|\| 'Unknown'\}<\/p>/g;
const newName = "<p className={`font-semibold mb-0.5 ${isMe ? 'text-[#90CAF9]' : 'text-[#027EB5]'}`}>{msg.replyTo.sender?.fullName || 'Unknown'}</p>";

content = content.replace(oldNameRegex, newName);

// Ensure the replied text is slightly faded/gray
const oldContentRegex = /\{msg\.replyTo\.content && \(\s*<p className="truncate">\{msg\.replyTo\.content\}<\/p>\s*\)\}/g;
const newContent = "{msg.replyTo.content && (\n                            <p className={`truncate text-xs ${isMe ? 'text-white/80' : 'text-zinc-500 dark:text-zinc-400'}`}>{msg.replyTo.content}</p>\n                          )}";

content = content.replace(oldContentRegex, newContent);

fs.writeFileSync(file, content);
