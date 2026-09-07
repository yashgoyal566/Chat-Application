const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace bubble padding from px-4 py-2 to p-1.5
content = content.replace(
  /className=\{`relative max-w-\[75%\] rounded-2xl px-4 py-2 text-sm leading-relaxed transition-colors/g,
  "className={`relative flex flex-col min-w-[120px] max-w-[75%] rounded-2xl p-1.5 text-sm leading-relaxed transition-colors"
);

// Add horizontal padding to the main text so it doesn't hit the curved bubble walls
content = content.replace(
  /\{msg\.content && <p>\{msg\.content\}<\/p>\}/g,
  "{msg.content && <p className=\"px-2.5 py-0.5\">{msg.content}</p>}"
);

// Make the reply box fill the bubble with a tiny margin
content = content.replace(
  /mb-1\.5 flex w-full flex-col/g,
  "mb-0.5 flex self-stretch flex-col"
);

fs.writeFileSync(file, content);
