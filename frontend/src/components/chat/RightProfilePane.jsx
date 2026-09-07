import React from 'react';
import { X, ChevronRight, File, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export default function RightProfilePane({ user, onClose }) {
  if (!user) return null;

  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300 animate-in slide-in-from-right-10 overflow-y-auto">
      
      {/* Header */}
      <div className="flex h-[72px] shrink-0 items-center justify-center border-b
      sticky top-0 z-50 bg-white border-b   border-zinc-200 px-6 relative dark:border-zinc-800">
        <h2 className="text-[16px] font-semibold text-zinc-700 dark:text-zinc-200">Information</h2>
        <button onClick={onClose} className="absolute right-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 transition-colors">
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
        {/* <p className="text-[14px] font-medium text-zinc-600 mt-1">+1 (555) 000-0000</p> */}
      </div>

     

     

      {/* Links Section */}
      <div className="flex flex-col p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200">Links</h4>
          <button className="text-[13px] text-zinc-400 hover:text-zinc-600 font-medium">Show More</button>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800">
              <LinkIcon size={20} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[14px] font-medium text-zinc-800 truncate dark:text-zinc-200 group-hover:text-blue-500 transition-colors">Social Web Components</span>
              <span className="text-[12px] text-zinc-400 truncate">https://dribbble.com/shots/...</span>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
