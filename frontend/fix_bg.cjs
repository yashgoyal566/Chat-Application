const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the main wrapper div to include the background image
content = content.replace(
  /<div className="relative flex h-full flex-col bg-\[#F2F2F7\] dark:bg-zinc-900">/m,
  `<div 
      className="relative flex h-full flex-col dark:bg-zinc-900"
      style={{
        backgroundImage: "url('/chat-bg.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: '400px',
        backgroundColor: '#F2F2F7'
      }}
    >`
);

// We should also make sure the header stays opaque so the background doesn't bleed through it
content = content.replace(
  /<div className="flex h-16 shrink-0 z-10 bg-white dark:bg-zinc-950 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">/m,
  `<div className="flex h-16 shrink-0 z-10 bg-white/95 backdrop-blur-md dark:bg-zinc-950/95 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">`
);

fs.writeFileSync(file, content);
console.log('Added doodle background!');
