const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove timestamp
content = content.replace(
  /<span className=\{`mt-1 block px-2 text-\[10px\] \$\{isMe \? 'text-blue-200' : 'text-zinc-500'\}`\}>\s*\{msg\.createdAt \? format\(new Date\(msg\.createdAt\), 'HH:mm'\) : format\(new Date\(\), 'HH:mm'\)\}\s*<\/span>/m,
  ""
);

// Update bubble padding from p-2 to px-4 py-2
content = content.replace(
  /className=\{`relative max-w-\[75%\] rounded-2xl p-2 text-sm leading-relaxed transition-colors/g,
  "className={`relative max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed transition-colors"
);

// Remove px-2 from the p tag
content = content.replace(
  /\{msg\.content && <p className="px-2">\{msg\.content\}<\/p>\}/g,
  "{msg.content && <p>{msg.content}</p>}"
);

fs.writeFileSync(file, content);
