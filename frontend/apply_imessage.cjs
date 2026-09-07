const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// The block starts at `{messages.map((msg) => {` and ends at `{/* Action Menu (Reply) */}`
// Actually it's easier to just do a smart regex replacement on the bubble styles.

// 1. Change the main flex wrapper to be flex-col so we can put the name on top
content = content.replace(
  /className=\{`flex \$\{isMe \? 'justify-end' : 'justify-start'\} mb-4`\}/g,
  "className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-4`}"
);

// 2. Remove the Name from inside the bubble
content = content.replace(
  /\{\/\* Name for Group Chats \*\/\}\s*\{!isMe && selectedUser\.isGroup && \(\s*<span className="mb-1 block text-xs font-semibold text-brand-primary">\s*\{msg\.sender\?\.fullName\}\s*<\/span>\s*\)\}/g,
  ""
);

// 3. Put the Name outside, above the bubble row
content = content.replace(
  /<div className=\{`flex max-w-\[70%\] \$\{isMe \? 'flex-row-reverse' : 'flex-row'\} items-end gap-2`\}>/g,
  `{!isMe && selectedUser.isGroup && (
                  <span className="mb-1 ml-10 text-[11px] text-zinc-500">
                    {msg.sender?.fullName}
                  </span>
                )}
                <div className={\`flex max-w-[75%] \${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2\`}>`
);

// 4. Update the Bubble Styling
const oldBubbleStyle = "isMe\n                          ? 'bg-brand-primary text-white rounded-br-sm'\n                          : 'bg-white text-zinc-900 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 rounded-bl-sm'";

const newBubbleStyle = "isMe\n                          ? 'bg-blue-600 text-white rounded-br-sm'\n                          : 'bg-[#E5E5EA] text-black dark:bg-zinc-800 dark:text-zinc-100 rounded-bl-sm'";

content = content.replace(oldBubbleStyle, newBubbleStyle);

// 5. Update the time text color for the blue bubble
content = content.replace(
  /span className=\{`mt-1 block px-2 text-\[10px\] \$\{isMe \? 'text-brand-primary\/40 text-blue-100' : \n'text-zinc-400'\}`\}/g,
  "span className={`mt-1 block px-2 text-[10px] ${isMe ? 'text-blue-200' : 'text-zinc-500'}`}"
);
content = content.replace(
  /span className=\{`mt-1 block px-2 text-\[10px\] \$\{isMe \? 'text-brand-primary\/40 text-blue-100' : 'text-zinc-400'\}`\}/g,
  "span className={`mt-1 block px-2 text-[10px] ${isMe ? 'text-blue-200' : 'text-zinc-500'}`}"
);

fs.writeFileSync(file, content);
