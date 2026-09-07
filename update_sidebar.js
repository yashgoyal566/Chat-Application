const fs = require('fs');
const file = 'frontend/src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

const combinedListReplacement = `const combinedList = [
    ...conversations.filter(c => c.isGroup).map(c => ({
      _id: c._id,
      fullName: c.groupName,
      isGroup: true,
      participants: c.participants,
      lastMessage: c.lastMessage
    })),
    ...users.map(u => {
      const convo = conversations.find(c => !c.isGroup && c.participants.some(p => p._id === u._id));
      return {
        ...u,
        isGroup: false,
        lastMessage: convo?.lastMessage
      };
    })
  ].sort((a, b) => {
    const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(0);
    const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(0);
    return dateB - dateA;
  });`;

content = content.replace(/const combinedList = \[[\s\S]*?\];/m, combinedListReplacement);

const renderReplacement = `<p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {item.lastMessage ? (
                    item.lastMessage.image ? '📷 Photo' : item.lastMessage.content
                  ) : (
                    item.isGroup ? 'Group Chat' : \`@\${item.username}\`
                  )}
                </p>`;

content = content.replace(/<p className="truncate text-xs text-zinc-500 dark:text-zinc-400">[\s\S]*?<\/p>/m, renderReplacement);

fs.writeFileSync(file, content);
