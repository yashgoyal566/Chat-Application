import { useEffect, useState } from 'react';
import { useChatStore } from '../../context/useChatStore';
import { useSocketStore } from '../../context/useSocketStore';
import { Search, Plus, Users, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function ChatSidebar() {
  const { users, conversations, getUsers, selectedUser, clearUnread, unreadCounts, setSelectedUser, createGroup, drafts = {} } = useChatStore();
  const { onlineUsers } = useSocketStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Combine individual users and group conversations into one list
  const combinedList = [
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
  });

  const filteredList = combinedList.filter((item) => 
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const handleCreateGroup = async () => {
    if (!groupName) return toast.error('Group name is required');
    if (selectedGroupUsers.length < 2) return toast.error('Select at least 2 users');
    
    await createGroup(groupName, selectedGroupUsers);
    setIsCreatingGroup(false);
    setGroupName('');
    setSelectedGroupUsers([]);
  };

  const toggleUserForGroup = (userId) => {
    if (selectedGroupUsers.includes(userId)) {
      setSelectedGroupUsers(selectedGroupUsers.filter(id => id !== userId));
    } else {
      setSelectedGroupUsers([...selectedGroupUsers, userId]);
    }
  };

  return (
    <div className="flex h-full flex-col relative bg-white">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-5 pt-8 pb-2">
        <h2 className="text-[34px] font-bold cursor-pointer tracking-tight text-black">Messages</h2>
      </div>
      
      {/* Search Bar */}
      <div className="pt-2 g">
        <div className="relative px-5 pb-2 ">
          <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-[60%] text-[#8E8E93]" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            
            className="w-full rounded-[20px]  bg-[#767680]/[0.12] py-1.5 pl-8 pr-4 text-[17px] text-black placeholder:text-[#8E8E93] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto ">
        {filteredList.map((item) => {
          const isSelected = selectedUser?._id === item._id;

           const unread = unreadCounts[item._id] || 0;
          
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
              onClick={() =>{ 
                 setSelectedUser(item);
                 clearUnread(item._id);
                 }}
              className={`flex w-full items-center pl-[20px] cursor-pointer text-left transition-colors ${
                isSelected ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
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

                    {/* Show green bubble if unread > 0, otherwise show the chevron arrow */}
    {unread > 0 ? (
      <div className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#0042d5] text-[11px] font-bold text-white">
        {unread}
      </div>
    ) : (
      <ChevronRight size={18} strokeWidth={2} className="text-[#C7C7CC]" />
    )}
    
  </div>
</div>
              
<p 
  className="text-[15px] text-[#8E8E93] leading-[1.3] mt-0.5 w-[80%] break-words"
  style={{
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
  }}
>
  {(() => {
      const rawDraft = (drafts || {})[item._id] || '';
      const cleanDraft = rawDraft.replace(/<[^>]*>?/gm, '').trim();
      
      if (cleanDraft) {
        return <span className="text-[#0042d5] font-medium tracking-tight">Draft: <span className="text-[#8E8E93] font-normal">{cleanDraft}</span></span>;
      }
      
      return item.lastMessage ? (
        typeof item.lastMessage === 'string' ? 'Sent a message' : (item.lastMessage.image ? '📷 Photo' : item.lastMessage.content?.replace(/<[^>]*>?/gm, ''))
      ) : (
        item.isGroup ? 'Group Chat' : 'Start a conversation'
      );
    })()}
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
}
