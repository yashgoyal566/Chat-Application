const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the container of the input reply preview
content = content.replace(
  /className="mb-2 flex items-center justify-between rounded-xl border border-brand-primary\/20 bg-brand-primary\/5 p-2"/g,
  'className="mb-2 flex items-center justify-between rounded-lg bg-[#F0F2F5] dark:bg-[#2A2F32] p-2"'
);

// Replace the inner content of the input reply preview
const oldInner = `<div className="flex flex-1 items-center gap-2 overflow-hidden border-l-4 border-brand-primary pl-2">\n                  <Reply size={14} className="shrink-0 text-brand-primary" />\n                  <div className="flex-1 overflow-hidden">\n                    <p className="text-xs font-semibold text-brand-primary">\n                      Replying to {(replyingTo.sender._id || replyingTo.sender) === authUser._id ? 'yourself' : \n(replyingTo.sender?.fullName || 'User')}\n                    </p>\n                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">\n                      {replyingTo.image ? '\uD83D\uDCF7 Photo' : replyingTo.content}\n                    </p>\n                  </div>\n                </div>`;

const newInner = `<div className="flex flex-1 items-center gap-2 overflow-hidden border-l-[4px] border-[#027EB5] pl-2">\n                  <div className="flex-1 overflow-hidden">\n                    <p className="text-[13px] font-semibold text-[#027EB5] mb-0.5">\n                      {(replyingTo.sender._id || replyingTo.sender) === authUser._id ? 'You' : (replyingTo.sender?.fullName || 'User')}\n                    </p>\n                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">\n                      {replyingTo.content}\n                    </p>\n                  </div>\n                </div>`;

// The emojis might cause replacement issues, let's use regex
const innerRegex = /<div className="flex flex-1 items-center gap-2 overflow-hidden border-l-4 border-brand-primary pl-2">[\s\S]*?<\/div>\s*<\/div>/m;

content = content.replace(innerRegex, newInner);

fs.writeFileSync(file, content);
