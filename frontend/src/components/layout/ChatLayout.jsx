import { useAuthStore } from '../../context/useAuthStore';
import { LogOut, Settings, User as UserIcon, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatSidebar from '../chat/ChatSidebar';
import ChatWindow from '../chat/ChatWindow';
import { useChatStore } from '../../context/useChatStore';
import { useSocketStore } from '../../context/useSocketStore';
import { useEffect } from 'react';

export default function ChatLayout() {
  const { logout } = useAuthStore();
  const { selectedUser, listenToMessages, stopListeningToMessages } = useChatStore();
  const { socket } = useSocketStore();

  // Listen globally to messages so unread counts work even on the home screen!
  useEffect(() => {
    listenToMessages();
    return () => stopListeningToMessages();
  }, [listenToMessages, stopListeningToMessages, socket]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar Navigation */}
      <nav className="flex w-16 flex-col items-center justify-between border-r border-zinc-200 bg-white py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <MessageSquare size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
            <UserIcon size={20} />
          </Link>
          
          <button onClick={logout} className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
            <LogOut size={20} className='cursor-pointer'/>
          </button>
        </div>
      </nav> 

      {/* Chat List (Left Pane) */}
      <aside className="flex w-90 flex-col border-r   border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <ChatSidebar />
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
        {!selectedUser ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              <MessageSquare size={32} className="text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100">Welcome to Chat</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Select a conversation from the sidebar to start messaging.</p>
          </div>
        ) : (
          <ChatWindow />
        )}
      </main>
 
     
    </div>
  );
}
