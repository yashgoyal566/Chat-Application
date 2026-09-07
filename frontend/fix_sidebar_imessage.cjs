const fs = require('fs');
const file = 'src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add ChevronRight to imports
if (!content.includes('ChevronRight')) {
  content = content.replace("import { Users }", "import { Users, ChevronRight }");
}

// 2. Rewrite combinedList and sort it
const oldListRegex = /const combinedList = \[[^]*?\];/m;
const newList = `const combinedList = [
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

content = content.replace(oldListRegex, newList);

// 3. Rewrite the entire rendering block
const oldRenderRegex = /\{filteredList\.map\(\(item\) => \{[\s\S]*?<\/button>\n\s*\)\}\)\}/m;
const newRender = `{filteredList.map((item) => {
            const isSelected = selectedUser?._id === item._id;
            
            // Format time for iOS style
            let timeString = '';
            if (item.lastMessage?.createdAt) {
              const date = new Date(item.lastMessage.createdAt);
              const today = new Date();
              if (date.toDateString() === today.toDateString()) {
                timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
              } else {
                timeString = date.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: '2-digit' });
              }
            }
            
            return (
              <button
                key={item._id}
                onClick={() => setSelectedUser(item)}
                className={\`flex w-full items-center pl-4 text-left transition-colors \${
                  isSelected ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }\`}
              >
                {/* Avatar */}
                <div className="relative h-[48px] w-[48px] shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700 mr-3">
                  {item.isGroup ? (
                     <div className="flex h-full w-full items-center justify-center font-medium text-zinc-500">
                       <Users size={24} />
                     </div>
                  ) : item.profilePicture ? (
                    <img src={item.profilePicture} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-zinc-500 uppercase">
                      {item.fullName?.charAt(0) || '?'}
                    </div>
                  )}
                </div>

                {/* Right Side (Name, Time, Last Message) */}
                <div className="flex-1 flex flex-col justify-center py-3 pr-4 border-b border-[#E5E5EA] dark:border-zinc-800 overflow-hidden">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="truncate text-[16px] font-semibold text-black dark:text-white">{item.fullName}</h4>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <span className="text-[15px] text-[#8E8E93]">{timeString}</span>
                      <ChevronRight size={16} className="text-[#C7C7CC] translate-y-[1px]" />
                    </div>
                  </div>
                  <p className="text-[15px] text-[#8E8E93] line-clamp-2 leading-[1.3]">
                    {item.lastMessage ? (
                      item.lastMessage.image ? '📷 Photo' : item.lastMessage.content
                    ) : (
                      item.isGroup ? 'Group Chat' : 'Start a conversation'
                    )}
                  </p>
                </div>
              </button>
            );
          })}`;

content = content.replace(oldRenderRegex, newRender);

fs.writeFileSync(file, content);
