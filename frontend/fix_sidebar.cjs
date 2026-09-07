const fs = require('fs');
const file = 'src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace combinedList logic
const newCombinedList = `const combinedList = [
    ...conversations.filter(c => c.isGroup).map(c => ({
      _id: c._id,
      fullName: c.groupName,
      isGroup: true,
      participants: c.participants
    })),
    ...users.map(u => ({
      ...u,
      isGroup: false
    }))
  ];`;

content = content.replace(/const combinedList = \[[\s\S]*?\}\);/m, newCombinedList);

// Replace paragraph logic
const newParagraph = `<p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {item.isGroup ? 'Group Chat' : \`@\${item.username}\`}
                  </p>`;

content = content.replace(/<p className="truncate text-xs text-zinc-500 dark:text-zinc-400">[\s\S]*?<\/p>/m, newParagraph);

fs.writeFileSync(file, content);
