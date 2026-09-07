const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldReplyBlock = "className={`mb-2 cursor-pointer rounded-lg border-l-4 p-2 text-xs opacity-90 hover:opacity-100 ${\n                            isMe \n                              ? 'border-white/50 bg-white/10 text-white' \n                              : 'border-brand-primary/50 bg-zinc-50 text-zinc-600 dark:bg-zinc-900/50 dark:text-zinc-300'\n                          }`}";

const newReplyBlock = "className={`mb-1.5 mt-0.5 cursor-pointer rounded-md border-l-[3px] px-2.5 py-1.5 text-xs opacity-90 hover:opacity-100 ${\n                            isMe \n                              ? 'border-white/60 bg-black/10 text-white' \n                              : 'border-[#8E8E93] bg-[#D1D1D6] text-black'\n                          }`}";

content = content.replace(oldReplyBlock, newReplyBlock);

// Also remove the explicit text color from the p tags inside the reply
content = content.replace(
  /<p className="font-semibold">\{msg\.replyTo\.sender\?\.fullName \|\| 'Unknown'\}<\/p>/g,
  '<p className="font-bold opacity-80">{msg.replyTo.sender?.fullName || \'Unknown\'}</p>'
);

fs.writeFileSync(file, content);
