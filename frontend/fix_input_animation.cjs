const fs = require('fs');
const file = 'src/components/chat/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add transition-all, duration-300, focus-within:-translate-y-1, and focus-within:shadow-xl
const oldFormClass = 'className="flex flex-col gap-2 rounded-[20px] border border-zinc-200 bg-white p-3 shadow-lg shadow-black/5 focus-within:ring-2 focus-within:ring-brand-primary/20 dark:border-zinc-800 dark:bg-zinc-900 mx-auto"';
const newFormClass = 'className="flex flex-col gap-2 rounded-[20px] border border-zinc-200 bg-white p-3 shadow-lg shadow-black/5 transition-all duration-300 focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:shadow-xl focus-within:shadow-black/10 focus-within:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900 mx-auto"';

content = content.replace(oldFormClass, newFormClass);

fs.writeFileSync(file, content);
console.log('Added animation to input box!');
