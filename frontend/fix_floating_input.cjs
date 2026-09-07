const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Change the main wrapper to be relative (it might already be, let's check)
// `<div className="flex h-full flex-col">` -> `<div className="relative flex h-full flex-col bg-[#F2F2F7] dark:bg-zinc-900">`
content = content.replace(
  /<div className="flex h-full flex-col">/m,
  '<div className="relative flex h-full flex-col bg-[#F2F2F7] dark:bg-zinc-900">'
);

// 2. Add padding-bottom to the message feed so the last message isn't hidden
// `<div className="flex-1 overflow-y-auto p-4">` -> `<div className="flex-1 overflow-y-auto p-4 pb-[130px]">`
content = content.replace(
  /<div className="flex-1 overflow-y-auto p-4">/m,
  '<div className="flex-1 overflow-y-auto p-4 pb-[140px]">'
);

// 3. Convert the input container to absolute floating
// `{/* Input */}\s*<div className="shrink-0 border-t border-zinc-200 bg-white p-4 dark:border-zinc-800\/60 dark:bg-zinc-950">`
content = content.replace(
  /\{\/\* Input \*\/\}\s*<div className="shrink-0 border-t border-zinc-200 bg-white p-4 dark:border-zinc-800\/60 dark:bg-zinc-950">/m,
  `{/* Input (Floating) */}
        <div className="absolute bottom-0 left-0 w-full p-4 pb-6 z-10">`
);

// 4. Boost the shadow on the form to make it look floating
content = content.replace(
  /className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-sm focus-within:ring-2 focus-within:ring-brand-primary\/20 dark:border-zinc-800 dark:bg-zinc-900"/m,
  'className="flex flex-col gap-2 rounded-[20px] border border-zinc-200 bg-white p-3 shadow-lg shadow-black/5 focus-within:ring-2 focus-within:ring-brand-primary/20 dark:border-zinc-800 dark:bg-zinc-900 mx-auto"'
);

fs.writeFileSync(file, content);
console.log('Made input floating!');
