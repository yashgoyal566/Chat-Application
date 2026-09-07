const fs = require('fs');
const file = 'src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove header border and adjust padding
content = content.replace(
  /<div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">/g,
  '<div className="flex shrink-0 items-center justify-between px-5 pt-8 pb-2">'
);

// 2. Change "Chats" to "Messages" with HUGE iOS font
content = content.replace(
  /<h2 className="text-xl font-bold">Chats<\/h2>/g,
  '<h2 className="text-[34px] font-bold tracking-tight text-black">Messages</h2>'
);

// 3. Search Bar styling (iOS style)
const oldSearch = /<div className="relative">\s*<Search className="absolute left-3 top-1\/2 h-4 w-4 -translate-y-1\/2 text-zinc-400" \/>\s*<input\s*type="text"\s*placeholder="Search chats..."\s*value=\{searchTerm\}\s*onChange=\{\(e\) => setSearchTerm\(e.target.value\)\}\s*className="w-full rounded-full bg-zinc-100 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-zinc-800 dark:focus:ring-brand-primary"\s*\/>\s*<\/div>/g;

const newSearch = `<div className="relative px-5 pb-2">
          <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-[60%] text-[#8E8E93]" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-[10px] bg-[#767680]/[0.12] py-1.5 pl-8 pr-4 text-[17px] text-black placeholder:text-[#8E8E93] focus:outline-none"
          />
        </div>`;

content = content.replace(oldSearch, newSearch);

// Also we need to make sure the header section encompasses the search bar correctly.
// Wait, the original code had the search bar below the header.
// Original:
// <aside ...>
//   <div className="flex h-16 ..."> ... </div>
//   <div className="p-4"> <div className="relative"> ... </div> </div>
// Let's replace the <div className="p-4"> container to remove the padding!
content = content.replace(
  /<div className="p-4">\s*<div className="relative px-5 pb-2">/g,
  '<div className="pt-2">\n        <div className="relative px-5 pb-2">'
);

fs.writeFileSync(file, content);
