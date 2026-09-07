const fs = require('fs');
const file = 'src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove p-2 from the scroll container
content = content.replace(
  /<div className="flex-1 overflow-y-auto p-2">/g,
  '<div className="flex-1 overflow-y-auto">'
);

// Update the button row layout
const oldButtonRow = /className=\{`flex w-full items-center pl-4 text-left transition-colors \$\{/g;
const newButtonRow = 'className={`flex w-full items-center pl-[20px] text-left transition-colors ${';
content = content.replace(oldButtonRow, newButtonRow);

// Update Avatar size
content = content.replace(
  /className="relative h-\[48px\] w-\[48px\] shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700 mr-3"/g,
  'className="relative h-[52px] w-[52px] shrink-0 rounded-full bg-zinc-200 mr-3"'
);

// Update Name and Time row
content = content.replace(
  /<h4 className="truncate text-\[16px\] font-semibold text-black dark:text-white">\{item\.fullName\}<\/h4>/g,
  '<h4 className="truncate text-[17px] font-semibold text-black tracking-tight">{item.fullName}</h4>'
);

content = content.replace(
  /<span className="text-\[15px\] text-\[#8E8E93\]">\{timeString\}<\/span>/g,
  '<span className="text-[15px] text-[#8E8E93] font-normal">{timeString}</span>'
);

// Update the chevron to be thinner by using strokeWidth
content = content.replace(
  /<ChevronRight size=\{16\} className="text-\[#C7C7CC\] translate-y-\[1px\]" \/>/g,
  '<ChevronRight size={18} strokeWidth={2} className="text-[#C7C7CC]" />'
);

// Update the last message to match iOS typography perfectly
content = content.replace(
  /<p className="text-\[15px\] text-\[#8E8E93\] line-clamp-2 leading-\[1\.3\]">/g,
  '<p className="text-[15px] text-[#8E8E93] line-clamp-2 leading-[1.3] mt-0.5 pr-2">'
);

// Update padding of the right content area
content = content.replace(
  /className="flex-1 flex flex-col justify-center py-3 pr-4 border-b border-\[#E5E5EA\] dark:border-zinc-800 overflow-hidden"/g,
  'className="flex-1 flex flex-col justify-center py-[12px] pr-4 border-b border-[#E5E5EA] overflow-hidden"'
);

fs.writeFileSync(file, content);
