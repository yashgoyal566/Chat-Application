const fs = require('fs');
const file = 'src/components/chat/ChatSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// We need ChevronRight from lucide-react
if (!content.includes('ChevronRight')) {
  content = content.replace("import { Search, Plus, Users, X }", "import { Search, Plus, Users, X, ChevronRight }");
}

const startIndex = content.indexOf('return (');
if (startIndex !== -1) {
  const newReturnBlock = `return (
    <div className="flex h-full flex-col relative bg-white">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-5 pt-8 pb-2">
        <h2 className="text-[34px] font-bold tracking-tight text-black">Messages</h2>
      </div>
      
      {/* Search Bar */}
      <div className="pt-2">
        <div className="relative px-5 pb-2">
          <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-[60%] text-[#8E8E93]" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-[10px] bg-[#767680]/[0.12] py-1.5 pl-8 pr-4 text-[17px] text-black placeholder:text-[#8E8E93] focus:outline-none"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredList.map((item) => {
          const isSelected = selectedUser?._id === item._id;
          
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
              className={\`flex w-full items-center pl-[20px] text-left transition-colors \${
                isSelected ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }\`}
            >
              {/* Avatar */}
              <div className="relative h-[52px] w-[52px] shrink-0 rounded-full bg-zinc-200 mr-3">
                {item.isGroup ? (
                   <div className="flex h-full w-full items-center justify-center font-medium text-zinc-500">
                     <Users size={24} />
                   </div>
                ) : item.profilePicture ? (
                  <img src={item.profilePicture} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-zinc-500 uppercase">
                    {item.fullName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Right Side (Name, Time, Last Message) */}
              <div className="flex-1 flex flex-col justify-center py-[12px] pr-4 border-b border-[#E5E5EA] overflow-hidden">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="truncate text-[17px] font-semibold text-black tracking-tight">{item.fullName}</h4>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <span className="text-[15px] text-[#8E8E93] font-normal">{timeString}</span>
                    <ChevronRight size={18} strokeWidth={2} className="text-[#C7C7CC]" />
                  </div>
                </div>
                <p className="text-[15px] text-[#8E8E93] line-clamp-2 leading-[1.3] mt-0.5 pr-2">
                  {item.lastMessage ? (
                    typeof item.lastMessage === 'string' ? 'Sent a message' : (item.lastMessage.image ? '\uD83D\uDCF7 Photo' : item.lastMessage.content)
                  ) : (
                    item.isGroup ? 'Group Chat' : 'Start a conversation'
                  )}
                </p>
              </div>
            </button>
          );
        })}
        {filteredList.length === 0 && (
          <div className="mt-10 text-center text-sm text-zinc-500">No chats found</div>
        )}
      </div>
    </div>
  );
}`;

  content = content.slice(0, startIndex) + newReturnBlock;
  fs.writeFileSync(file, content);
}
