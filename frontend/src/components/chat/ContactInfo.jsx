import React from 'react';
import { useSocketStore } from '../../context/useSocketStore';
import { X, Link as LinkIcon,Reply ,Image as ImageIcon } from 'lucide-react';
import { useChatStore } from '../../context/useChatStore';
import {useState,useEffect} from 'react';


export default function ContactInfo({ user, onClose ,onReplyClick}) {
  const { onlineUsers } = useSocketStore();
  const { messages } = useChatStore();
  const recentMessages = (messages || []).slice(-3);
  const isOnline = user?.isGroup ? false : onlineUsers.includes(user?._id);
  if (!user) return null;

  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300 animate-in slide-in-from-right-10 overflow-y-auto">
      
      {/* Header */}
      <div className="flex h-[72px] shrink-0 items-center justify-center 
      sticky top-0 z-50 bg-white    px-6 relative">
        <h2 className="text-[16px] font-semibold text-zinc-700 dark:text-zinc-200">Contact Info</h2>
        <button onClick={onClose} className="absolute right-4 cursor-pointer rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Profile Details */}
      <div className="flex flex-col items-center pt-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="h-[120px] w-[120px] overflow-hidden rounded-full border-4 border-white shadow-sm dark:border-zinc-800 mb-4">
          <img
            src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.name || 'U')}&background=007AFF&color=fff`}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <h3 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{user.fullName || user.name}</h3>
        <p className="text-[14px] text-zinc-500 mt-1">{user.email}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-zinc-400'}`}></span>
          <p className={`text-[14px] font-medium ${isOnline ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
        
      </div>

     


{/* Conversation */}
      <div className="flex flex-col p-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200">Recent Conversations</h4>
        </div>
        
        <div className="flex flex-col gap-3">
          {recentMessages.length === 0 ? (
            <p className="text-[13px] text-zinc-400 italic">No recent messages.</p>
          ) : (
            recentMessages.map((msg, index) => {
              const isMe = (msg.sender._id || msg.sender) !== user._id;
              
              // Strip HTML for a clean preview, just like the sidebar does
              const previewText = (msg.content || '').replace(/<[^>]*>?/gm, '').trim();

              return (
                <div key={msg._id || index} className="flex flex-col gap-1 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-zinc-700 dark:text-zinc-300">
                      {isMe ? 'You' : user.fullName}
                    </span>

                    {/* <span className="text-[10px] text-zinc-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </span> */}
<button onClick={() => onReplyClick(msg._id)} className="absolute right-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 transition-colors" >
          <Reply size={20} className="cursor-pointer"/>
        </button>
                  </div>
                  <span className="text-[13px] text-zinc-600 dark:text-zinc-400 truncate">
                    {previewText || 'Attachment...'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>


    </aside>
  );
}
