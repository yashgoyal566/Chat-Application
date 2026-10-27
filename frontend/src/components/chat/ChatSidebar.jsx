import { useEffect, useState } from 'react';
import { useChatStore } from '../../context/useChatStore';
import { useSocketStore } from '../../context/useSocketStore';
import { Search, Plus, Users, X, ChevronRight, User as UserIcon, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/useAuthStore';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function ChatSidebar() {
  const { authUser, logout } = useAuthStore();
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
    <div className="flex h-full w-full flex-col relative bg-white">
      {/* Header with Title on Left and Profile + Logout on Very Right */}
      <div className="flex w-full shrink-0 items-center justify-between px-5 pt-6 pb-2">
        <h2 className="text-[28px] font-bold tracking-tight text-black dark:text-zinc-50">
          Messages
        </h2>
        
        {/* Profile & Logout Action Buttons (Mobile view only) */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <Link
            to="/profile"
            aria-label="Profile"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:ring-2 hover:ring-blue-500/40 active:scale-95 transition-all shadow-xs"
            title="Profile"
          >
            {authUser?.profilePicture ? (
              <img
                src={authUser.profilePicture}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : authUser?.fullName ? (
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
                {authUser.fullName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <UserIcon size={18} className="text-zinc-600 dark:text-zinc-300" />
            )}
          </Link>

          <button
            onClick={logout}
            aria-label="Log out"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 active:scale-95 transition-all shadow-xs cursor-pointer"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
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
            className="w-full rounded-[20px] bg-[#767680]/[0.12] py-1.5 pl-8 pr-4 text-[17px] text-black placeholder:text-[#8E8E93] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
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
              onClick={() => { 
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

                    {/* Unread badge */}
                    {unread > 0 ? (
                      <div className="flex h-[20px] min-w-[20px] px-1 items-center justify-center rounded-full bg-[#0042d5] text-[11px] font-bold text-white shadow-sm">
                        {unread > 99 ? '99+' : unread}
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
                      item.lastMessage.image ? (
                        <span className="italic text-zinc-500">Photo</span>
                      ) : (
                        item.lastMessage.content?.replace(/<[^>]*>?/gm, '') || ''
                      )
                    ) : (
                      <span className="italic text-zinc-400">No messages yet</span>
                    );
                  })()}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Create Group Button */}
      <button
        onClick={() => setIsCreatingGroup(true)}
        className="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#007AFF] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <Plus size={24} />
      </button>

      {/* Create Group Modal */}
      <AnimatePresence>
        {isCreatingGroup && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">New Group</h3>
                <button onClick={() => setIsCreatingGroup(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X size={20} />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-zinc-500">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-500">Select Participants</label>
                  <div className="mt-1 max-h-48 overflow-y-auto space-y-1">
                    {users.map((u) => {
                      const isSelected = selectedGroupUsers.includes(u._id);
                      return (
                        <div
                          key={u._id}
                          onClick={() => toggleUserForGroup(u._id)}
                          className={`flex items-center gap-3 rounded-lg p-2 cursor-pointer transition-colors ${
                            isSelected ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-zinc-300'}`}>
                            {isSelected && <span className="text-[10px]">✓</span>}
                          </div>
                          <span className="text-sm text-zinc-700 dark:text-zinc-200">{u.fullName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleCreateGroup}
                  className="w-full rounded-xl bg-brand-primary py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Create Group
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
